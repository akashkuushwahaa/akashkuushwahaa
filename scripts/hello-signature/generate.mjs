// Sets the site owner's name in EMS Allure, a single-stroke (pen-plotter)
// derivative of the Allura typeface, and writes it out as one SVG path per pen
// stroke for the loading screen to draw. Strokes stay separate because browsers
// restart the dash pattern on every subpath, so a compound path cannot be
// revealed in order. The font stores each glyph as a polyline, so
// the points are smoothed into cubic Beziers on the way through.
//
//   node scripts/hello-signature/generate.mjs ["Some Name"]
//
// EMS Allure: SIL Open Font License, by Sheldon B. Michaels and Windell H.
// Oskay (evil-mad/EggBot), after Allura by Rob Leuschke.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const resume = fs.readFileSync(path.join(root, "src/data/resume.tsx"), "utf8");
const text = process.argv[2] ?? resume.match(/^\s*name:\s*"([^"]+)"/m)[1];

const SCALE = 0.1;
const PAD = 4;
const STROKE = 3;

const svg = fs.readFileSync(path.join(here, "EMSAllure.svg"), "utf8");
const glyphs = new Map();
for (const match of svg.matchAll(/<glyph\s+([^>]*)\/>/g)) {
    const attrs = Object.fromEntries(
        [...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]])
    );
    const unicode = attrs.unicode?.replace(/&#x([0-9a-f]+);/i, (_, hex) =>
        String.fromCodePoint(parseInt(hex, 16))
    );
    if (unicode) glyphs.set(unicode, attrs);
}
const defaultAdvance = parseFloat(
    svg.match(/<font[^>]*horiz-adv-x="([\d.]+)"/)[1]
);
const advance = (glyph) =>
    parseFloat(glyph["horiz-adv-x"] ?? defaultAdvance) * SCALE;

function strokesFor(word) {
    const strokes = [];
    let x = 0;
    for (const char of word) {
        const glyph = glyphs.get(char);
        if (!glyph) throw new Error(`EMS Allure has no glyph for "${char}"`);
        for (const sub of (glyph.d ?? "").split(/(?=M)/)) {
            const points = [
                ...sub.matchAll(/[ML]\s*([-\d.]+)\s+([-\d.]+)/g),
            ].map((p) => [
                x + parseFloat(p[1]) * SCALE,
                -parseFloat(p[2]) * SCALE,
            ]);
            if (points.length) strokes.push(points);
        }
        x += advance(glyph);
    }
    return strokes;
}

const round = (n) => Math.round(n * 10) / 10;

// Catmull-Rom through the polyline points, with the tangent dropped to zero at
// sharp corners so pen reversals stay crisp instead of looping.
function tangent(points, i) {
    const at = (j) => points[Math.max(0, Math.min(points.length - 1, j))];
    const [a, b, c] = [at(i - 1), at(i), at(i + 1)];
    const v1 = [b[0] - a[0], b[1] - a[1]];
    const v2 = [c[0] - b[0], c[1] - b[1]];
    const l1 = Math.hypot(...v1);
    const l2 = Math.hypot(...v2);
    if (!l1 || !l2) return [0, 0];
    const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (l1 * l2);
    const k = cos < 0.2 ? 0 : cos;
    return [((c[0] - a[0]) / 2) * k, ((c[1] - a[1]) / 2) * k];
}

function toBeziers(points) {
    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
        const [a, b] = [points[i], points[i + 1]];
        const ta = tangent(points, i);
        const tb = tangent(points, i + 1);
        segments.push([
            a,
            [a[0] + ta[0] / 3, a[1] + ta[1] / 3],
            [b[0] - tb[0] / 3, b[1] - tb[1] / 3],
            b,
        ]);
    }
    return segments;
}

function bezierLength([p0, p1, p2, p3]) {
    let length = 0;
    let previous = p0;
    for (let i = 1; i <= 16; i++) {
        const t = i / 16;
        const u = 1 - t;
        const point = [
            u * u * u * p0[0] +
                3 * u * u * t * p1[0] +
                3 * u * t * t * p2[0] +
                t * t * t * p3[0],
            u * u * u * p0[1] +
                3 * u * u * t * p1[1] +
                3 * u * t * t * p2[1] +
                t * t * t * p3[1],
        ];
        length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
        previous = point;
    }
    return length;
}

const words = text.split(" ").map(strokesFor);
const everyPoint = words.flat(2);
const minY = Math.min(...everyPoint.map((p) => p[1])) - PAD;
const maxY = Math.max(...everyPoint.map((p) => p[1])) + PAD;
const height = round(maxY - minY);

const output = words.map((strokes) => {
    const points = strokes.flat();
    const minX = Math.min(...points.map((p) => p[0])) - PAD;
    const maxX = Math.max(...points.map((p) => p[0])) + PAD;
    return {
        width: round(maxX - minX),
        strokes: strokes.map((stroke) => {
            const shifted = stroke.map(([x, y]) => [x - minX, y - minY]);
            let d = `M${round(shifted[0][0])} ${round(shifted[0][1])}`;
            let length = 0;
            if (shifted.length === 1) d += "l0 0";
            for (const segment of toBeziers(shifted)) {
                const [, c1, c2, end] = segment;
                d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(end[0])} ${round(end[1])}`;
                length += bezierLength(segment);
            }
            return { length: Math.round(length), d };
        }),
    };
});

const file = path.join(root, "src/data/hello-signature.ts");
fs.writeFileSync(
    file,
    `// Generated by scripts/hello-signature/generate.mjs. Do not edit by hand.
export interface SignatureStroke {
    length: number;
    d: string;
}

export interface SignatureWord {
    width: number;
    strokes: SignatureStroke[];
}

export const HELLO_SIGNATURE = {
    text: ${JSON.stringify(text)},
    height: ${height},
    space: ${round(advance(glyphs.get(" ")))},
    strokeWidth: ${STROKE},
    words: ${JSON.stringify(output, null, 4).replace(/\n/g, "\n    ")} as SignatureWord[],
};
`
);
console.log(`wrote ${path.relative(root, file)} for "${text}"`);

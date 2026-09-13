// Renders public/code-review-demo.mp4 from transcript.txt, the verbatim
// terminal output of one run of the agent.
//
// The transcript is coloured and paced by the rules below, headless Edge
// draws it with page.html, one screenshot is taken per distinct frame, and
// ffmpeg encodes them. Needs Edge (or EDGE pointing at a Chromium binary) and
// ffmpeg on PATH (or FFMPEG pointing at one). DEMO_OUT overrides the output.
import { spawn, spawnSync } from "node:child_process";
import {
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT =
    process.env.DEMO_OUT ??
    path.resolve(here, "../../public/code-review-demo.mp4");
const FPS = 30;
const SIZE = { width: 1920, height: 1080 };
const EDGE =
    process.env.EDGE ??
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const FFMPEG = process.env.FFMPEG ?? "ffmpeg";
const PORT = 9333;

// ---- the session: what was typed, and how the transcript is shown ----

const SESSION = {
    title: "code-review-agent — python · 104×30",
    prompt: { dir: "code-review-agent", branch: "main" },
    command:
        "python review.py https://github.com/akashkuushwahaa/code-review-agent-demo/pull/1 --dry-run",
    typing: { start: 0.8, cps: 32 },
    tail: 4,
};

// How long a line waits after the one before it. Lines that stand for a
// model call get a real pause; a NVIDIA call actually takes a minute or two,
// which nobody needs to sit through.
function pause(line, previous) {
    if (/^Reviewing \S+\.\.\.$/.test(line)) return 0.5;
    if (/^Verifying \d+ finding/.test(line)) return 0.5;
    if (/^Indexed \d+ source file/.test(previous)) return 0.9;
    if (/^Reviewing \S+\.\.\.$/.test(previous)) return 2.4;
    if (/^Verifying \d+ finding/.test(previous)) return 2.2;
    if (/^What this PR does/.test(line)) return 2.0;
    if (/^\[dry run\] Would post summary comment/.test(line)) return 0.9;
    if (/transient error/.test(line)) return 0.7;
    if (line.trim() === "") return 0.12;
    if (/^\s*(#|<|\||-{3,}|={3,})/.test(line)) return 0.06;
    return 0.2;
}

// Colour: a red badge on [high], the verifier and warnings in yellow,
// bookkeeping dim, the cost line green. Everything else stays the terminal's
// foreground, the way the CLI actually prints it.
function segments(line) {
    const severity = /^(\s*- )\[(high|medium|low)\](.*)$/.exec(line);
    if (severity) {
        const [, indent, level, rest] = severity;
        const badge = level === "high" ? "badge" : `badge-${level}`;
        return [
            { text: indent },
            { text: level.toUpperCase(), cls: badge },
            { text: rest },
        ];
    }
    const tagged = /^(\s*)(\[[a-z ]+\])(.*)$/.exec(line);
    if (tagged) {
        const [, indent, tag, rest] = tagged;
        const cls = /^\[(warn|verifier)\]$/.test(tag) ? "yellow" : "dim";
        return [{ text: indent }, { text: tag, cls }, { text: rest, cls }];
    }
    if (/^Cost: /.test(line)) return [{ text: line, cls: "green" }];
    if (/^(Advisory only|-{3,}|={3,})/.test(line)) {
        return [{ text: line, cls: "dim" }];
    }
    if (/^(Reviewing|Verifying|Indexed|Merged) /.test(line)) {
        const [head, ...rest] = line.split(" ");
        return [{ text: head, cls: "cyan" }, { text: ` ${rest.join(" ")}` }];
    }
    if (/^(PR context|Provider): /.test(line)) {
        const at = line.indexOf(":") + 1;
        return [
            { text: line.slice(0, at), cls: "cyan" },
            { text: line.slice(at) },
        ];
    }
    if (
        /^(What this PR does|Where to look first:|Description vs diff:|Breaking changes:)/.test(
            line
        )
    ) {
        const at = line.indexOf(":") + 1 || line.length;
        return [
            { text: line.slice(0, at), cls: "bold" },
            { text: line.slice(at) },
        ];
    }
    if (/^\s*(#|<|\|)/.test(line)) return [{ text: line, cls: "dim" }];
    return [{ text: line }];
}

function session() {
    const raw = readFileSync(path.join(here, "transcript.txt"), "utf8")
        .replace(/\r\n/g, "\n")
        .replace(/\n+$/, "")
        .split("\n");
    const lines = raw.map((line, index) => ({
        d: pause(line, raw[index - 1] ?? ""),
        segments: segments(line),
    }));
    return { ...SESSION, lines };
}

// ---- driving Edge ----

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pageTarget() {
    for (let attempt = 0; attempt < 100; attempt++) {
        try {
            const list = await (
                await fetch(`http://127.0.0.1:${PORT}/json/list`)
            ).json();
            const page = list.find(
                (target) =>
                    target.type === "page" && target.webSocketDebuggerUrl
            );
            if (page) return page.webSocketDebuggerUrl;
        } catch {
            // Edge is still starting.
        }
        await sleep(200);
    }
    throw new Error("Edge never exposed a page target");
}

function devtools(ws) {
    let next = 0;
    const pending = new Map();
    const waiting = new Map();
    ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const { resolve, reject } = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) reject(new Error(message.error.message));
            else resolve(message.result);
        } else if (message.method && waiting.has(message.method)) {
            waiting.get(message.method)(message.params);
            waiting.delete(message.method);
        }
    });
    return {
        send: (method, params = {}) =>
            new Promise((resolve, reject) => {
                const id = ++next;
                pending.set(id, { resolve, reject });
                ws.send(JSON.stringify({ id, method, params }));
            }),
        once: (method) =>
            new Promise((resolve) => waiting.set(method, resolve)),
    };
}

const work = mkdtempSync(path.join(tmpdir(), "code-review-demo-"));
const frames = path.join(work, "frames");
mkdirSync(frames);

const edge = spawn(
    EDGE,
    [
        "--headless=new",
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${path.join(work, "profile")}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        // The page loads Geist Mono from node_modules over file://.
        "--allow-file-access-from-files",
        `--window-size=${SIZE.width},${SIZE.height}`,
        "about:blank",
    ],
    { stdio: "ignore" }
);

try {
    const ws = new WebSocket(await pageTarget());
    await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve);
        ws.addEventListener("error", reject);
    });
    const cdp = devtools(ws);
    await cdp.send("Page.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
        ...SIZE,
        deviceScaleFactor: 1,
        mobile: false,
    });
    const loaded = cdp.once("Page.loadEventFired");
    await cdp.send("Page.navigate", {
        url: pathToFileURL(path.join(here, "page.html")).href,
    });
    await loaded;
    await cdp.send("Runtime.evaluate", {
        expression: "document.fonts.ready.then(() => true)",
        awaitPromise: true,
    });
    const evaluate = async (expression) =>
        (
            await cdp.send("Runtime.evaluate", {
                expression,
                returnByValue: true,
            })
        ).result.value;

    const duration = await evaluate(`init(${JSON.stringify(session())})`);
    const total = Math.ceil(duration * FPS);
    const shots = [];
    let last = null;
    for (let frame = 0; frame < total; frame++) {
        const key = await evaluate(`render(${frame / FPS})`);
        if (key === last) {
            shots.at(-1).frames++;
            continue;
        }
        const { data } = await cdp.send("Page.captureScreenshot", {
            format: "png",
        });
        const file = path.join(
            frames,
            `${String(shots.length).padStart(5, "0")}.png`
        );
        writeFileSync(file, Buffer.from(data, "base64"));
        shots.push({ file, frames: 1 });
        last = key;
        if (frame % 300 === 0) {
            console.log(`${frame}/${total} frames, ${shots.length} shots`);
        }
    }
    ws.close();

    // The concat demuxer holds each shot for as long as it stayed on screen.
    const entry = (shot) => `file '${shot.file.replace(/\\/g, "/")}'`;
    const list =
        shots
            .map(
                (shot) =>
                    `${entry(shot)}\nduration ${(shot.frames / FPS).toFixed(4)}`
            )
            .join("\n") + `\n${entry(shots.at(-1))}\n`;
    const listPath = path.join(work, "list.txt");
    writeFileSync(listPath, list);
    const ffmpeg = spawnSync(
        FFMPEG,
        [
            "-y",
            "-loglevel",
            "error",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            listPath,
            "-vf",
            `fps=${FPS},format=yuv420p`,
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "20",
            "-tune",
            "stillimage",
            "-movflags",
            "+faststart",
            OUT,
        ],
        { stdio: "inherit" }
    );
    if (ffmpeg.status !== 0) throw new Error("ffmpeg failed");
    console.log(
        `wrote ${OUT}: ${duration.toFixed(1)}s, ${shots.length} distinct frames`
    );
} finally {
    edge.kill();
    await sleep(500);
    try {
        rmSync(work, { recursive: true, force: true });
    } catch {
        // Edge may still hold its profile open for a moment; the temp dir
        // is disposable either way.
    }
}

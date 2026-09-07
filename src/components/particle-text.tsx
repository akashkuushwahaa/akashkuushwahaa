"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Props {
    children: string;
    className?: string;
}

type Particle = {
    x: number;
    y: number;
    homeX: number;
    homeY: number;
    vx: number;
    vy: number;
    r: number;
};

const SAMPLE_STEP = 3;
const PAD = 26;
const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 2600;
const SPRING = 0.055;
const FRICTION = 0.86;

// The word is rendered to an offscreen canvas, sampled into particles, then
// redrawn every frame. Particles spring back to their glyph position and are
// pushed aside by the pointer. The real text stays in the DOM underneath —
// invisible but selectable and readable by a screen reader — so this is purely
// a decorative layer that can fail without costing the headline.
export function ParticleText({ children, className }: Props) {
    const hostRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        const measure = textRef.current;
        const canvas = canvasRef.current;
        if (!host || !measure || !canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduced) return;

        let particles: Particle[] = [];
        let disposed = false;
        let visible = true;
        let raf = 0;
        let width = 0;
        let height = 0;
        const pointer = { x: -9999, y: -9999, active: false };

        const build = () => {
            const box = measure.getBoundingClientRect();
            if (box.width < 2 || box.height < 2) {
                return;
            }

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.ceil(box.width) + PAD * 2;
            height = Math.ceil(box.height) + PAD * 2;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const styles = getComputedStyle(measure);
            const font = `${styles.fontWeight} ${styles.fontSize} / ${styles.lineHeight} ${styles.fontFamily}`;

            const stamp = document.createElement("canvas");
            stamp.width = width;
            stamp.height = height;
            const sctx = stamp.getContext("2d", { willReadFrequently: true });
            if (!sctx) {
                return;
            }

            sctx.font = font;
            // Canvas ignores CSS letter-spacing unless it is set explicitly,
            // and the headline carries heavy negative tracking. Without this
            // the stamp is drawn wider than the DOM text and swallows the
            // space after the word.
            sctx.letterSpacing = styles.letterSpacing;
            sctx.textBaseline = "middle";
            sctx.fillStyle = "#fff";
            sctx.fillText(children, PAD, height / 2);

            const { data } = sctx.getImageData(0, 0, width, height);
            const next: Particle[] = [];

            for (let y = 0; y < height; y += SAMPLE_STEP) {
                for (let x = 0; x < width; x += SAMPLE_STEP) {
                    if (data[(y * width + x) * 4 + 3] > 140) {
                        // A regular lattice reads as a dot-matrix display, so
                        // each point is nudged off the grid and sized from the
                        // same hash — deterministic, but not visibly ordered.
                        const hash = (x * 73856093) ^ (y * 19349663);
                        const jx = ((hash & 255) / 255 - 0.5) * SAMPLE_STEP;
                        const jy =
                            (((hash >> 8) & 255) / 255 - 0.5) * SAMPLE_STEP;
                        const homeX = x + jx;
                        const homeY = y + jy;
                        next.push({
                            x: homeX,
                            y: homeY,
                            homeX,
                            homeY,
                            vx: 0,
                            vy: 0,
                            r: 1.5 + (((hash >> 16) & 255) / 255) * 1.5,
                        });
                    }
                }
            }

            particles = next;
            ctx.fillStyle = styles.color;
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // The loop only runs while something moves: the pointer is near the
        // word or particles are still springing home. At rest it stops, so
        // the hero does not burn a frame budget while the page scrolls.
        const tick = () => {
            let energy = 0;
            for (const p of particles) {
                if (pointer.active) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0.01) {
                        const d = Math.sqrt(d2);
                        const force = REPEL_STRENGTH / d2;
                        p.vx += (dx / d) * force;
                        p.vy += (dy / d) * force;
                    }
                }

                p.vx = (p.vx + (p.homeX - p.x) * SPRING) * FRICTION;
                p.vy = (p.vy + (p.homeY - p.y) * SPRING) * FRICTION;
                p.x += p.vx;
                p.y += p.vy;
                energy = Math.max(
                    energy,
                    Math.abs(p.vx) + Math.abs(p.vy),
                    Math.abs(p.homeX - p.x) + Math.abs(p.homeY - p.y)
                );
            }
            draw();
            raf =
                pointer.active || energy > 0.05
                    ? requestAnimationFrame(tick)
                    : 0;
        };

        const onMove = (event: PointerEvent) => {
            const box = canvas.getBoundingClientRect();
            pointer.x = event.clientX - box.left;
            pointer.y = event.clientY - box.top;
            pointer.active =
                pointer.x > -REPEL_RADIUS &&
                pointer.x < width + REPEL_RADIUS &&
                pointer.y > -REPEL_RADIUS &&
                pointer.y < height + REPEL_RADIUS;
            if (pointer.active && !raf && visible && !disposed) {
                raf = requestAnimationFrame(tick);
            }
        };

        const onLeave = () => {
            pointer.active = false;
        };

        const start = () => {
            if (disposed) return;
            build();
            draw();
            if (particles.length) host.dataset.ready = "true";
            cancelAnimationFrame(raf);
            if (visible) raf = requestAnimationFrame(tick);
        };

        // Fonts land after first paint; sampling before they do stamps a
        // fallback face into the particles.
        const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
        if (fonts?.ready) {
            fonts.ready.then(start).catch(start);
        } else {
            start();
        }

        const observer = new ResizeObserver(() => start());
        observer.observe(host);

        const themeObserver = new MutationObserver(start);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else cancelAnimationFrame(raf);
        });
        visibilityObserver.observe(host);

        if (!reduced) {
            window.addEventListener("pointermove", onMove, { passive: true });
            window.addEventListener("pointerleave", onLeave);
        }

        return () => {
            disposed = true;
            delete host.dataset.ready;
            cancelAnimationFrame(raf);
            observer.disconnect();
            themeObserver.disconnect();
            visibilityObserver.disconnect();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
        };
    }, [children]);

    return (
        <span
            ref={hostRef}
            className={cn(
                "particle-text relative inline-block align-baseline",
                className
            )}
        >
            <span ref={textRef} className="particle-source">
                {children}
            </span>
            <canvas
                ref={canvasRef}
                aria-hidden
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
                style={{ marginLeft: `-${PAD}px` }}
            />
        </span>
    );
}

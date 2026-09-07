"use client";

import { CURTAIN_ID } from "@/components/loading-screen";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const COVER_MS = 400;
const REVEAL_MS = 500;
const REVEAL_AT = 0.4;
const GUARD_MS = 8000;
const DRAW_MS = 1800;
const HOLD_MS = 420;
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";
const PEN_EASE = 0.6;

// Share of the signature drawn at a fraction of the draw time: a linear pen
// blended with a sine ease-in-out. Monotonic, so it can be inverted by
// bisection to find when a given stroke should start.
const penProgress = (time: number) =>
    (1 - PEN_EASE) * time + (PEN_EASE * (1 - Math.cos(Math.PI * time))) / 2;
const timeAt = (progress: number) => {
    let low = 0;
    let high = 1;
    for (let step = 0; step < 32; step++) {
        const middle = (low + high) / 2;
        if (penProgress(middle) < progress) low = middle;
        else high = middle;
    }
    return (low + high) / 2;
};

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const routeReady = useRef<(() => void) | null>(null);

    useEffect(() => {
        routeReady.current?.();
    }, [pathname]);

    useEffect(() => {
        const curtain = document.getElementById(CURTAIN_ID);
        if (!curtain) return;
        const hello = curtain.querySelector<HTMLElement>(".hello");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let disposed = false;
        let busy = false;
        let signing = false;
        let queuedHref: string | undefined;
        let animation: Animation | undefined;
        let strokes: Animation[] = [];
        let guard: number | undefined;
        let revealTimer: number | undefined;

        const revealText = () => {
            window.clearTimeout(revealTimer);
            document.documentElement.dataset.pageMotion = "reveal";
            window.dispatchEvent(new Event("portfolio:reveal"));
        };
        const finish = () => {
            animation?.cancel();
            strokes.forEach((stroke) => stroke.cancel());
            strokes = [];
            window.clearTimeout(guard);
            routeReady.current = null;
            curtain.style.transform = "translateY(100%)";
            curtain.style.pointerEvents = "none";
            delete document.documentElement.dataset.pageMotion;
            busy = false;
        };
        const travel = async (from: string, to: string, duration: number) => {
            animation?.cancel();
            animation = curtain.animate(
                [
                    { transform: `translateY(${from})` },
                    { transform: `translateY(${to})` },
                ],
                { duration, easing: EASING, fill: "forwards" }
            );
            await animation.finished;
        };
        // Every pen stroke is its own path. They play back to back, with the
        // time each one gets taken from one easing curve over the whole
        // signature, so the pen accelerates in and settles out like
        // handwriting rather than restarting on every letter.
        const sign = async () => {
            signing = true;
            curtain.style.animation = "none";
            curtain.style.transform = "translateY(0%)";
            const paths = Array.from(
                curtain.querySelectorAll<SVGPathElement>("[data-hello-stroke]")
            );
            const lengths = paths.map((path) =>
                Number(path.dataset.helloStroke)
            );
            const total = lengths.reduce((sum, length) => sum + length, 0);
            let drawn = 0;
            strokes = paths.map((path, index) => {
                const from = drawn / total;
                drawn += lengths[index];
                const to = drawn / total;
                const start = timeAt(from) * DRAW_MS;
                const duration = timeAt(to) * DRAW_MS - start;
                const samples = Array.from({ length: 9 }, (_, step) => {
                    const at = (start + (duration * step) / 8) / DRAW_MS;
                    return ((penProgress(at) - from) / (to - from)).toFixed(4);
                });
                const options: KeyframeAnimationOptions = {
                    duration,
                    delay: start,
                    fill: "forwards",
                };
                const keyframes = [
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0 },
                ];
                try {
                    return path.animate(keyframes, {
                        ...options,
                        easing: `linear(${samples.join(", ")})`,
                    });
                } catch {
                    return path.animate(keyframes, options);
                }
            });
            await Promise.all(strokes.map((stroke) => stroke.finished));
            await new Promise((resolve) => window.setTimeout(resolve, HOLD_MS));
            signing = false;
            delete curtain.dataset.initial;
        };
        const run = async (href?: string) => {
            if (busy || disposed) return;
            busy = true;
            document.documentElement.dataset.pageMotion = "cover";
            window.dispatchEvent(
                new CustomEvent("portfolio:cover", {
                    detail: { initial: !href },
                })
            );
            curtain.style.pointerEvents = "auto";
            try {
                if (!href && "initial" in curtain.dataset) {
                    await sign();
                } else {
                    await travel("100%", "0%", COVER_MS);
                }
                if (disposed) return;
                if (href) {
                    await new Promise<void>((resolve) => {
                        routeReady.current = resolve;
                        guard = window.setTimeout(resolve, GUARD_MS);
                        router.push(href);
                    });
                }
                if (disposed) return;
                // The panel clears the top of the page late in its travel, so
                // the words start rising once it is about to uncover them.
                revealTimer = window.setTimeout(
                    revealText,
                    REVEAL_MS * REVEAL_AT
                );
                await travel("0%", "-100%", REVEAL_MS);
            } catch {
                // Cancellation also occurs when the motion preference changes.
            } finally {
                if (!disposed) {
                    revealText();
                    finish();
                    if (hello) hello.hidden = true;
                    window.dispatchEvent(new Event("portfolio:ready"));
                    if (queuedHref) {
                        const nextHref = queuedHref;
                        queuedHref = undefined;
                        void run(nextHref);
                    }
                }
            }
        };
        const onClick = (event: MouseEvent) => {
            if (
                reduced.matches ||
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const anchor =
                event.target instanceof Element
                    ? event.target.closest("a")
                    : null;
            if (
                !anchor ||
                anchor.hasAttribute("download") ||
                (anchor.target && anchor.target !== "_self")
            )
                return;
            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("#")) return;
            const url = new URL(anchor.href, window.location.href);
            if (
                url.origin !== window.location.origin ||
                url.pathname === window.location.pathname ||
                /\.[a-z0-9]+$/i.test(url.pathname)
            )
                return;
            // Capture before Next's Link handler so the old route stays until covered.
            event.preventDefault();
            const destination = url.pathname + url.search + url.hash;
            if (busy) queuedHref = destination;
            else void run(destination);
        };
        const onPreference = () => {
            if (reduced.matches) {
                routeReady.current?.();
                animation?.cancel();
                revealText();
                finish();
                if (hello) hello.hidden = true;
                window.dispatchEvent(new Event("portfolio:ready"));
            }
        };
        document.addEventListener("click", onClick, true);
        reduced.addEventListener("change", onPreference);
        if (!reduced.matches) void run();
        return () => {
            disposed = true;
            routeReady.current?.();
            finish();
            // Under React's development double-mount the signature must be
            // able to start over, so the server-rendered state is restored.
            if (signing) {
                signing = false;
                curtain.style.animation = "";
                curtain.style.transform = "";
            }
            document.removeEventListener("click", onClick, true);
            reduced.removeEventListener("change", onPreference);
        };
    }, [router]);

    return <div key={pathname}>{children}</div>;
}

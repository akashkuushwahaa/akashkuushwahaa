"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const COVER_MS = 400;
const REVEAL_MS = 500;
const GUARD_MS = 8000;
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const curtainRef = useRef<HTMLDivElement>(null);
    const routeReady = useRef<(() => void) | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    useEffect(() => {
        routeReady.current?.();
    }, [pathname]);

    useEffect(() => {
        const curtain = curtainRef.current;
        if (!mounted || !curtain) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let disposed = false;
        let busy = false;
        let queuedHref: string | undefined;
        let animation: Animation | undefined;
        let guard: number | undefined;

        const revealText = () => {
            document.documentElement.dataset.pageMotion = "reveal";
            window.dispatchEvent(new Event("portfolio:reveal"));
        };
        const finish = () => {
            animation?.cancel();
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
                await travel("100%", "0%", COVER_MS);
                if (disposed) return;
                if (href) {
                    await new Promise<void>((resolve) => {
                        routeReady.current = resolve;
                        guard = window.setTimeout(resolve, GUARD_MS);
                        router.push(href);
                    });
                }
                if (disposed) return;
                revealText();
                await travel("0%", "-100%", REVEAL_MS);
            } catch {
                // Cancellation also occurs when the motion preference changes.
            } finally {
                if (!disposed) {
                    revealText();
                    finish();
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
            document.removeEventListener("click", onClick, true);
            reduced.removeEventListener("change", onPreference);
        };
    }, [mounted, router]);

    return (
        <>
            {mounted &&
                createPortal(
                    <LoadingScreen curtainRef={curtainRef} />,
                    document.body
                )}
            <div key={pathname}>{children}</div>
        </>
    );
}

"use client";

import { cn } from "@/lib/utils";
import { Fragment, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

interface Props {
    children: string;
    className?: string;
    delay?: number;
    stagger?: number;
    afterTransition?: boolean;
    accent?: { word: string; content: ReactNode };
}

export function AnimatedText({
    children,
    className,
    delay = 0,
    stagger = 36,
    afterTransition = false,
    accent,
}: Props) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let visible = false;
        const reveal = () => {
            const phase = document.documentElement.dataset.pageMotion;
            if (visible && (afterTransition ? !phase : phase !== "cover")) {
                element.dataset.visible = "true";
            }
        };
        const cover = (event: Event) => {
            if (
                (event as CustomEvent<{ initial: boolean }>).detail.initial &&
                element.getBoundingClientRect().top < window.innerHeight
            ) {
                delete element.dataset.visible;
            }
        };
        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                reveal();
            },
            { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
        );
        element.dataset.motion = "ready";
        if (reduced.matches) element.dataset.visible = "true";
        observer.observe(element);
        window.addEventListener("portfolio:reveal", reveal);
        window.addEventListener("portfolio:ready", reveal);
        window.addEventListener("portfolio:cover", cover);
        return () => {
            observer.disconnect();
            window.removeEventListener("portfolio:reveal", reveal);
            window.removeEventListener("portfolio:ready", reveal);
            window.removeEventListener("portfolio:cover", cover);
        };
    }, [afterTransition]);

    return (
        <span ref={ref} className={cn("animated-text", className)}>
            {children.split(/(\s+)/).map((word, index) =>
                /^\s+$/.test(word) ? (
                    <Fragment key={index}>{word}</Fragment>
                ) : (
                    <span key={index} className="text-word-clip">
                        <span
                            className="text-word-inner"
                            style={
                                {
                                    "--word-delay": `${delay + Math.min((index / 2) * stagger, Math.max(260, stagger * 4))}ms`,
                                } as CSSProperties
                            }
                        >
                            {accent?.word === word ? accent.content : word}
                        </span>
                    </span>
                )
            )}
        </span>
    );
}

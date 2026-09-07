"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
    max?: number;
}

// Leans the panel toward the pointer and springs it flat again on leave. The
// angles are written as custom properties and the transform lives in CSS, so
// the browser tweens between pointer samples instead of snapping to each one.
export function HoverTilt({ children, className, max = 5 }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (
            !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
            return;

        let raf = 0;
        let pending: MouseEvent | null = null;

        const apply = () => {
            raf = 0;
            if (!pending) return;
            const box = element.getBoundingClientRect();
            const x = (pending.clientX - box.left) / box.width - 0.5;
            const y = (pending.clientY - box.top) / box.height - 0.5;
            element.style.setProperty(
                "--tilt-x",
                `${(-y * max).toFixed(2)}deg`
            );
            element.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
        };
        const onMove = (event: MouseEvent) => {
            pending = event;
            if (!raf) raf = requestAnimationFrame(apply);
        };
        const onEnter = () => {
            element.dataset.tilt = "active";
        };
        const onLeave = () => {
            cancelAnimationFrame(raf);
            raf = 0;
            pending = null;
            delete element.dataset.tilt;
            element.style.setProperty("--tilt-x", "0deg");
            element.style.setProperty("--tilt-y", "0deg");
        };

        element.addEventListener("mouseenter", onEnter);
        element.addEventListener("mousemove", onMove);
        element.addEventListener("mouseleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            element.removeEventListener("mouseenter", onEnter);
            element.removeEventListener("mousemove", onMove);
            element.removeEventListener("mouseleave", onLeave);
        };
    }, [max]);

    return (
        <div ref={ref} className={cn("hover-tilt", className)}>
            {children}
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Props {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    as?: "div" | "section" | "li";
}

// The hidden state lives in CSS (`.js-reveal .reveal`), not in React state, so
// server and client markup match. The `js-reveal` class is added at runtime, so
// content is never hidden unless JS is actually there to reveal it again.
export function ScrollReveal({
    children,
    delay = 0,
    className,
    as: Tag = "div",
}: Props) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        // Opt the document into the hidden state only now that JS is running.
        document.documentElement.classList.add("js-reveal");

        const element = ref.current;
        if (!element) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            element.classList.add("is-visible");
            return;
        }

        let intersecting = false;
        const reveal = () => {
            if (
                intersecting &&
                document.documentElement.dataset.pageMotion !== "cover"
            ) {
                element.classList.add("is-visible");
                observer.unobserve(element);
            }
        };
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        intersecting = true;
                        reveal();
                    }
                }
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
        );

        observer.observe(element);
        window.addEventListener("portfolio:reveal", reveal);
        return () => {
            observer.disconnect();
            window.removeEventListener("portfolio:reveal", reveal);
        };
    }, []);

    return (
        <Tag
            ref={ref as never}
            className={cn("reveal", className)}
            style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
        >
            {children}
        </Tag>
    );
}

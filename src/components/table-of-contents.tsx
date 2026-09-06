"use client";

import type { Heading } from "@/data/content";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
    headings: Heading[];
}

export function TableOfContents({ headings }: Props) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const elements = headings
            .map((heading) => document.getElementById(heading.id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) {
            return;
        }

        // The active heading is whichever one sits closest above the reading
        // line, so the highlight tracks what you are looking at rather than
        // whatever happens to be intersecting the viewport.
        const onScroll = () => {
            const line = 140;
            let current = elements[0];

            for (const element of elements) {
                if (element.getBoundingClientRect().top <= line) {
                    current = element;
                }
            }

            setActiveId(current.id);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [headings]);

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav aria-label="On this page" className="sticky top-28">
            <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                On this page
            </p>
            <ul className="mt-3 flex flex-col gap-y-2 border-l border-border">
                {headings.map((heading) => {
                    const active = heading.id === activeId;
                    return (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                aria-current={active ? "location" : undefined}
                                className={cn(
                                    "-ml-px block border-l py-0.5 pl-3 text-xs transition-colors duration-base",
                                    active
                                        ? "border-brand text-brand"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

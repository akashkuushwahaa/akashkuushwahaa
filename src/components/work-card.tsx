"use client";

import { ProjectVisual } from "@/components/project-visual";
import { TagList } from "@/components/tag-list";
import Link from "next/link";
import { useRef, useState } from "react";

interface Props {
    index?: number;
    slug: string;
    href: string;
    title: string;
    outcome: string;
    tags: readonly string[];
}

export function WorkCard({ slug, href, title, outcome, tags }: Props) {
    const visualRef = useRef<HTMLDivElement>(null);
    const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

    // The overlay link covers the card, so mousemove is tracked on the article
    // and mapped back into the visual's own box.
    const track = (event: React.MouseEvent<HTMLElement>) => {
        const box = visualRef.current?.getBoundingClientRect();
        if (
            !box ||
            !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        ) {
            return;
        }

        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;

        setCursor(inside ? { x, y } : null);
    };

    return (
        <article
            className="work-card group relative"
            data-preview-active={cursor ? "true" : undefined}
            onMouseMove={track}
            onMouseLeave={() => setCursor(null)}
        >
            <div
                ref={visualRef}
                className="work-cursor-area relative overflow-hidden rounded-xl"
            >
                <ProjectVisual slug={slug} />
                {cursor && (
                    <span
                        aria-hidden
                        style={{ left: cursor.x, top: cursor.y }}
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-pop px-4 py-2 font-mono text-[10px] uppercase tracking-label text-brand-pop-ink"
                    >
                        View case study
                    </span>
                )}
            </div>

            <div className="mt-5 flex flex-col gap-2">
                <TagList tags={tags.slice(0, 4)} />
                <h3 className="max-w-[72ch] text-pretty text-lg font-normal leading-relaxed tracking-ui sm:text-xl">
                    <Link
                        href={href}
                        className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-ring"
                    >
                        {title}
                        <span className="work-outcome">
                            <span> — </span>
                            <span className="text-green">{outcome}</span>
                        </span>
                    </Link>
                </h3>
            </div>
        </article>
    );
}

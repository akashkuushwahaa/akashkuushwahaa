"use client";

import { ProjectVisual } from "@/components/project-visual";
import { TagList } from "@/components/tag-list";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface Props {
    index?: number;
    slug: string;
    href: string;
    title: string;
    outcome: string;
    tags: readonly string[];
}

const FOLLOW = 0.16;

export function WorkCard({ slug, href, title, outcome, tags }: Props) {
    const cardRef = useRef<HTMLElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    // The label trails the pointer through a small lerp and is moved by hand
    // rather than through state, so a mouse move never re-renders the card.
    useEffect(() => {
        const card = cardRef.current;
        const visual = visualRef.current;
        const label = labelRef.current;
        if (!card || !visual || !label) return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
            return;

        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        let active = false;
        let raf = 0;

        const frame = () => {
            raf = 0;
            current.x += (target.x - current.x) * FOLLOW;
            current.y += (target.y - current.y) * FOLLOW;
            label.style.transform = `translate(${current.x}px, ${current.y}px) translate(-50%, -50%)`;
            if (Math.hypot(target.x - current.x, target.y - current.y) > 0.2) {
                raf = requestAnimationFrame(frame);
            }
        };
        const onMove = (event: MouseEvent) => {
            const box = visual.getBoundingClientRect();
            const x = event.clientX - box.left;
            const y = event.clientY - box.top;
            const inside =
                x >= 0 && y >= 0 && x <= box.width && y <= box.height;
            if (inside && !active) {
                current.x = x;
                current.y = y;
            }
            if (inside !== active) {
                active = inside;
                card.toggleAttribute("data-preview-active", inside);
            }
            if (inside) {
                target.x = x;
                target.y = y;
                if (!raf) raf = requestAnimationFrame(frame);
            }
        };
        const onLeave = () => {
            active = false;
            card.removeAttribute("data-preview-active");
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <article ref={cardRef} className="work-card group relative">
            <div
                ref={visualRef}
                className="work-cursor-area relative overflow-hidden rounded-xl"
            >
                <ProjectVisual slug={slug} />
                <span
                    ref={labelRef}
                    aria-hidden
                    className="work-cursor-label pointer-events-none absolute left-0 top-0 z-20 rounded-full bg-brand-pop px-4 py-2 font-mono text-[10px] uppercase tracking-label text-brand-pop-ink"
                >
                    View case study
                </span>
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

"use client";

import { useState } from "react";

interface Props {
    src: string;
    label: string;
    poster: React.ReactNode;
}

// The file is large, so nothing is fetched until someone asks for it: the
// static visual stands in as the poster and `preload="none"` keeps the video
// off the wire until the first click.
export function ProjectMedia({ src, label, poster }: Props) {
    const [playing, setPlaying] = useState(false);

    if (playing) {
        return (
            <video
                src={src}
                controls
                autoPlay
                muted
                loop
                playsInline
                aria-label={label}
                className="w-full rounded-xl border border-border bg-card shadow-work"
            />
        );
    }

    return (
        <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative block w-full text-left"
        >
            {poster}
            <span className="pointer-events-none absolute inset-0 grid place-items-center rounded-xl bg-background/40 opacity-0 transition-opacity duration-medium group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                <span className="flex items-center gap-2 rounded-full bg-brand-pop px-5 py-2.5 font-mono text-[10px] uppercase tracking-label text-brand-pop-ink">
                    <span aria-hidden>&#9654;</span>
                    Play demo
                </span>
            </span>
            <span className="sr-only">Play the {label}</span>
        </button>
    );
}

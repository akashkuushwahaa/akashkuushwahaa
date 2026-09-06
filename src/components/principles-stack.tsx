"use client";

import { Fragment, useEffect, useRef } from "react";

interface Principle {
    title: string;
    body: string;
}

interface Props {
    principles: readonly Principle[];
}

const STICKY_TOP = 240;
const FADE_OVER = 420;

function ProgressText({ children }: { children: string }) {
    return (
        <>
            <span className="sr-only">{children}</span>
            <span aria-hidden="true" data-principle-text>
                {children.split(/(\s+)/).map((word, index) =>
                    /^\s+$/.test(word) ? (
                        <Fragment key={index}>{word}</Fragment>
                    ) : (
                        <span
                            key={index}
                            className="inline-block whitespace-nowrap"
                        >
                            {Array.from(word).map((character, charIndex) => (
                                <span key={charIndex} data-principle-char>
                                    {character}
                                </span>
                            ))}
                        </span>
                    )
                )}
            </span>
        </>
    );
}

// Every item pins at the same offset, so the next one rides up and covers the
// one before it. The outgoing item fades out as its successor closes on the
// pin line, which is what makes the number read as counting up in place rather
// than as four separate cards. Reduced motion drops the whole mechanism back to
// a plain list via CSS (see `.principle-item` in globals.css).
export function PrinciplesStack({ principles }: Props) {
    const listRef = useRef<HTMLOListElement>(null);

    useEffect(() => {
        const list = listRef.current;
        if (!list) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const items = Array.from(list.children) as HTMLElement[];
        const textBlocks = Array.from(
            list.querySelectorAll<HTMLElement>("[data-principle-text]")
        ).map((element) => ({
            element,
            characters: Array.from(
                element.querySelectorAll<HTMLElement>("[data-principle-char]")
            ),
        }));
        let raf = 0;

        const update = () => {
            raf = 0;
            textBlocks.forEach(({ element, characters }) => {
                const progress = Math.max(
                    0,
                    Math.min(
                        1,
                        (window.innerHeight * 0.9 -
                            element.getBoundingClientRect().top) /
                            (window.innerHeight * 0.35)
                    )
                );
                characters.forEach((character, index) => {
                    character.style.opacity = String(
                        0.25 +
                            Math.max(
                                0,
                                Math.min(
                                    1,
                                    progress * (characters.length + 8) - index
                                )
                            ) *
                                0.75
                    );
                });
            });
            items.forEach((item, index) => {
                const next = items[index + 1];
                if (!next) {
                    item.style.opacity = "1";
                    return;
                }
                const distance = next.getBoundingClientRect().top - STICKY_TOP;
                const ratio = Math.max(0, Math.min(1, distance / FADE_OVER));
                item.style.opacity = String(ratio);
            });
        };

        const onScroll = () => {
            if (!raf) {
                raf = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [principles]);

    return (
        <ol ref={listRef} className="relative">
            {principles.map((principle, index) => (
                <li
                    key={principle.title}
                    className="principle-item sticky"
                    style={{
                        top: `${STICKY_TOP}px`,
                        paddingBottom:
                            index === principles.length - 1 ? 0 : "62vh",
                    }}
                >
                    <span className="font-mono text-sm tabular-nums tracking-label text-blue">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-8 max-w-[17ch] text-balance text-display font-medium">
                        <ProgressText>{principle.title}</ProgressText>
                    </h3>
                    <p className="mt-8 max-w-[44ch] text-pretty text-xl leading-relaxed text-muted-foreground">
                        <ProgressText>{principle.body}</ProgressText>
                    </p>
                </li>
            ))}
        </ol>
    );
}

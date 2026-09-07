"use client";

import { Fragment, useEffect, useRef } from "react";

interface Principle {
    title: string;
    body: string;
}

interface Props {
    principles: readonly Principle[];
}

const PIN_TOP = "clamp(6rem, 20vh, 14rem)";
const ITEM_GAP = "min(38vh, 26rem)";
const FADE_OVER = 220;
const BODY_LEAD = 70;

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
                        (window.innerHeight * 0.92 -
                            element.getBoundingClientRect().top) /
                            (window.innerHeight * 0.28)
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
            // The outgoing item is gone by the time its successor reaches its
            // bottom edge, so the two never overlap; the body lets go first.
            items.forEach((item, index) => {
                const next = items[index + 1];
                const body = item.querySelector("p");
                if (!next) {
                    item.style.opacity = "1";
                    if (body) body.style.opacity = "1";
                    return;
                }
                // The item box carries the gap to its successor as padding,
                // so the edge that matters is the bottom of the text.
                const edge = (body ?? item).getBoundingClientRect().bottom;
                const room = next.getBoundingClientRect().top - edge;
                const clamp = (value: number) =>
                    Math.max(0, Math.min(1, value));
                item.style.opacity = String(clamp(room / FADE_OVER));
                if (body) {
                    body.style.opacity = String(
                        clamp((room - BODY_LEAD) / FADE_OVER)
                    );
                }
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
                        top: PIN_TOP,
                        paddingBottom:
                            index === principles.length - 1 ? 0 : ITEM_GAP,
                    }}
                >
                    <span className="font-mono text-xs tabular-nums tracking-label text-blue">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 max-w-[24ch] text-balance text-2xl font-medium tracking-ui sm:text-3xl">
                        <ProgressText>{principle.title}</ProgressText>
                    </h3>
                    <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                        <ProgressText>{principle.body}</ProgressText>
                    </p>
                </li>
            ))}
        </ol>
    );
}

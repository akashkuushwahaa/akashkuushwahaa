"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Props {
    skills: readonly string[];
    className?: string;
}

const TONES = [
    "text-brand",
    "text-violet",
    "text-green",
    "text-blue",
    "text-foreground/70",
] as const;

const WALL = 200;
const DROP_INTERVAL = 110;

// Real rigid-body physics: the capsules fall in, collide, settle into a pile and
// can be picked up and thrown. The labels stay ordinary DOM elements and are
// only transformed to follow their body each frame, so they keep the site's
// fonts and colours and the underlying list is still real text.
export function SkillPhysics({ skills, className }: Props) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            // Lay them out in a static row instead of dropping them.
            pillRefs.current.forEach((pill) => {
                if (pill) {
                    pill.style.position = "static";
                    pill.style.opacity = "1";
                }
            });
            scene.dataset.static = "true";
            return;
        }

        let disposed = false;
        let cleanup: (() => void) | undefined;

        // Loaded on demand so the engine never reaches a page that has no pile.
        import("matter-js").then((Matter) => {
            if (disposed) {
                return;
            }

            const {
                Engine,
                Runner,
                World,
                Bodies,
                Body,
                Mouse,
                MouseConstraint,
                Composite,
                Events,
            } = Matter;

            const engine = Engine.create();
            engine.gravity.y = 1;

            const runner = Runner.create();
            let width = scene.clientWidth;
            let height = scene.clientHeight;

            const makeWalls = () => [
                Bodies.rectangle(
                    width / 2,
                    height + WALL / 2,
                    width * 3,
                    WALL,
                    { isStatic: true }
                ),
                Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, {
                    isStatic: true,
                }),
                Bodies.rectangle(
                    width + WALL / 2,
                    height / 2,
                    WALL,
                    height * 4,
                    { isStatic: true }
                ),
            ];

            let walls = makeWalls();
            World.add(engine.world, walls);

            const pills = pillRefs.current.filter(Boolean) as HTMLSpanElement[];
            const bodies: Matter.Body[] = [];
            const timers: number[] = [];

            pills.forEach((pill, index) => {
                const box = pill.getBoundingClientRect();
                const w = box.width || 120;
                const h = box.height || 40;

                const body = Bodies.rectangle(
                    width * (0.15 + (0.7 * ((index * 37) % 100)) / 100),
                    -h - index * 40,
                    w,
                    h,
                    {
                        chamfer: { radius: h / 2 },
                        restitution: 0.35,
                        friction: 0.35,
                        frictionAir: 0.012,
                        density: 0.0016,
                    }
                );

                Body.setAngle(
                    body,
                    (((index * 53) % 60) - 30) * (Math.PI / 180)
                );
                bodies.push(body);

                timers.push(
                    window.setTimeout(() => {
                        if (!disposed) {
                            World.add(engine.world, body);
                            pill.style.opacity = "1";
                        }
                    }, index * DROP_INTERVAL)
                );
            });

            const mouse = Mouse.create(scene);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse,
                constraint: { stiffness: 0.18, render: { visible: false } },
            });
            World.add(engine.world, mouseConstraint);

            // Matter binds wheel and touch handlers that swallow page scrolling.
            // Dragging is worth having; hijacking the scroll is not.
            const m = mouse as unknown as Record<string, EventListener>;
            scene.removeEventListener("wheel", m.mousewheel);
            scene.removeEventListener("DOMMouseScroll", m.mousewheel);
            scene.removeEventListener("touchstart", m.touchstart);
            scene.removeEventListener("touchmove", m.touchmove);
            scene.removeEventListener("touchend", m.touchend);

            const sync = () => {
                bodies.forEach((body, index) => {
                    const pill = pills[index];
                    if (!pill) return;
                    const { x, y } = body.position;
                    pill.style.transform = `translate(${x - pill.offsetWidth / 2}px, ${y - pill.offsetHeight / 2}px) rotate(${body.angle}rad)`;
                });
            };

            Events.on(engine, "afterUpdate", sync);

            // Anything flung past the walls is recycled from the top.
            const reset = () => {
                bodies.forEach((body) => {
                    if (
                        body.position.y > height + 400 ||
                        Math.abs(body.position.x) > width + 400
                    ) {
                        Body.setPosition(body, { x: width / 2, y: -100 });
                        Body.setVelocity(body, { x: 0, y: 0 });
                    }
                });
            };
            Events.on(engine, "afterUpdate", reset);

            const onResize = () => {
                width = scene.clientWidth;
                height = scene.clientHeight;
                Composite.remove(engine.world, walls);
                walls = makeWalls();
                World.add(engine.world, walls);
            };
            window.addEventListener("resize", onResize);

            // Only simulate while the pile is on screen.
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        Runner.run(runner, engine);
                    } else {
                        Runner.stop(runner);
                    }
                },
                { threshold: 0.05 }
            );
            observer.observe(scene);

            cleanup = () => {
                timers.forEach(window.clearTimeout);
                observer.disconnect();
                window.removeEventListener("resize", onResize);
                Events.off(engine, "afterUpdate", sync);
                Events.off(engine, "afterUpdate", reset);
                Runner.stop(runner);
                World.clear(engine.world, false);
                Engine.clear(engine);
            };
        });

        return () => {
            disposed = true;
            cleanup?.();
        };
    }, [skills]);

    return (
        <div
            ref={sceneRef}
            className={cn(
                "skill-scene relative touch-pan-y overflow-hidden",
                className
            )}
        >
            <ul className="sr-only">
                {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>
            <div aria-hidden className="absolute inset-0">
                {skills.map((skill, index) => (
                    <span
                        key={skill}
                        ref={(node) => {
                            pillRefs.current[index] = node;
                        }}
                        className={cn(
                            "absolute left-0 top-0 cursor-grab select-none whitespace-nowrap rounded-full bg-muted px-7 py-4 text-lg opacity-0 will-change-transform active:cursor-grabbing",
                            TONES[index % TONES.length]
                        )}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

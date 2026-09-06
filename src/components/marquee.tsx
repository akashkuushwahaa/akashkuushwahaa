import { cn } from "@/lib/utils";

interface MarqueeProps {
    items: readonly string[];
    duration?: string;
    className?: string;
}

export function Marquee({ items, duration = "40s", className }: MarqueeProps) {
    return (
        <div
            className={cn("marquee relative py-3", className)}
            style={{ "--ticker-duration": duration } as React.CSSProperties}
        >
            <div className="marquee-mask overflow-hidden">
                <div className="marquee-track flex w-max animate-ticker">
                    {[0, 1].map((pass) => (
                        <div
                            key={pass}
                            className="marquee-group flex shrink-0 items-center"
                            aria-hidden={pass === 1}
                        >
                            {items.map((item) => (
                                <span
                                    key={item}
                                    className="marquee-item flex items-center"
                                >
                                    <span className="marquee-label whitespace-nowrap px-6 text-base text-muted-foreground sm:px-10 sm:text-lg">
                                        {item}
                                    </span>
                                    <span
                                        aria-hidden
                                        className="marquee-separator shrink-0 text-xl text-brand"
                                    >
                                        &lowast;
                                    </span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

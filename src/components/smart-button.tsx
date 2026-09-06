import { cn } from "@/lib/utils";
import Link from "next/link";

type Tone = "brand" | "violet" | "neutral";

interface Props {
    href: string;
    children: React.ReactNode;
    tone?: Tone;
    external?: boolean;
    className?: string;
}

const FILL: Record<Tone, string> = {
    brand: "bg-brand-pop",
    violet: "bg-violet-pop",
    neutral: "bg-foreground",
};

const INK: Record<Tone, string> = {
    brand: "group-hover:text-brand-pop-ink",
    violet: "group-hover:text-violet-pop-ink",
    neutral: "group-hover:text-background",
};

// The fill slides up from under the label rather than cross-fading, so the
// button reads as one object moving instead of two colours swapping.
export function SmartButton({
    href,
    children,
    tone = "neutral",
    external,
    className,
}: Props) {
    return (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={cn(
                "group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-border px-5 py-2.5 text-sm transition-colors duration-medium hover:border-transparent",
                className
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "absolute inset-0 -z-10 translate-y-full transition-transform duration-medium ease-out-expo group-hover:translate-y-0 motion-reduce:transition-none",
                    FILL[tone]
                )}
            />
            <span
                className={cn("transition-colors duration-medium", INK[tone])}
            >
                {children}
            </span>
            <span
                aria-hidden
                className={cn(
                    "transition-[transform,color] duration-medium ease-out-expo group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0",
                    INK[tone]
                )}
            >
                &rarr;
            </span>
        </Link>
    );
}

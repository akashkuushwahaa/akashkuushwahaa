import { cn } from "@/lib/utils";

interface MetricProps {
    label: string;
    from: string;
    to: string;
    className?: string;
}

export function Metric({ label, from, to, className }: MetricProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-y-1 border-t border-border pt-2 font-mono",
                className
            )}
        >
            <span className="text-[10px] uppercase tracking-normal text-muted-foreground">
                {label}
            </span>
            <span className="flex items-baseline gap-x-2 text-xs tabular-nums">
                <span className="text-muted-foreground">{from}</span>
                <span aria-hidden className="text-muted-foreground">
                    &rarr;
                </span>
                <span className="font-medium text-foreground">{to}</span>
            </span>
        </div>
    );
}

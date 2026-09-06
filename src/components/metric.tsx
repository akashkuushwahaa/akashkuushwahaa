import { cn } from "@/lib/utils";

interface MetricProps {
    label: string;
    from: string;
    to: string;
    className?: string;
}

// The before/after ledger. It appears only where a number was actually
// measured — on every card it would be decoration, on two it is a claim.
export function Metric({ label, from, to, className }: MetricProps) {
    return (
        <div className={cn("rounded-2xl border border-border p-6", className)}>
            <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                {label}
            </p>
            <p className="mt-3 flex flex-wrap items-baseline gap-3 font-mono text-2xl tabular-nums">
                <span className="text-muted-foreground">{from}</span>
                <span aria-hidden className="text-muted-foreground">
                    &rarr;
                </span>
                <span className="text-brand">{to}</span>
            </p>
        </div>
    );
}

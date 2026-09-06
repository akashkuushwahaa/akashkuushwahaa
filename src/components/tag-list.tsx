import { cn } from "@/lib/utils";

interface Props {
    tags: readonly string[];
    className?: string;
}

export function TagList({ tags, className }: Props) {
    if (tags.length === 0) {
        return null;
    }

    return (
        <ul
            className={cn(
                "flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-label text-muted-foreground",
                className
            )}
        >
            {tags.map((tag, id) => (
                <li key={tag} className="flex gap-x-2">
                    {id > 0 && <span aria-hidden>&mdash;</span>}
                    {tag}
                </li>
            ))}
        </ul>
    );
}

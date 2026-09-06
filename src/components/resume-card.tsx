import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

interface ResumeCardProps {
    logoUrl: string;
    altText: string;
    title: string;
    subtitle?: string;
    href?: string | null;
    badges?: readonly string[];
    period: string;
    description?: string;
}

export function ResumeCard({
    logoUrl,
    altText,
    title,
    subtitle,
    href,
    badges,
    period,
    description,
}: ResumeCardProps) {
    const heading = (
        <span className="inline-flex items-center gap-1.5 text-lg font-medium tracking-ui">
            {title}
            {href && (
                <ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-transform duration-medium ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none" />
            )}
        </span>
    );

    return (
        <article className="py-6 sm:py-8">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="flex min-w-0 items-start gap-4">
                    <Avatar className="size-10 shrink-0 border border-border bg-background">
                        {logoUrl && (
                            <AvatarImage
                                src={logoUrl}
                                alt={altText}
                                className="object-contain"
                            />
                        )}
                        <AvatarFallback className="bg-muted text-xs">
                            {altText[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {href ? (
                                <Link
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/link transition-colors duration-base hover:text-brand"
                                >
                                    {heading}
                                </Link>
                            ) : (
                                <h3>{heading}</h3>
                            )}
                            {badges?.map((badge) => (
                                <span
                                    key={badge}
                                    className="font-mono text-[9px] uppercase tracking-label text-brand"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                        {subtitle && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                        {description && (
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <p className="pl-14 font-mono text-[10px] uppercase tracking-label text-muted-foreground sm:pl-0 sm:text-right">
                    {period}
                </p>
            </div>
        </article>
    );
}

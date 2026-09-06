import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

interface ExperienceCardProps {
    logoUrl: string;
    altText: string;
    title: string;
    subtitle?: string;
    href?: string | null;
    badges?: readonly string[];
    period: string;
    description?: string;
    bullets?: readonly string[];
}

export function ExperienceCard({
    logoUrl,
    altText,
    title,
    subtitle,
    href,
    badges,
    period,
    description,
    bullets,
}: ExperienceCardProps) {
    const hasDetails = Boolean(description || bullets?.length);

    return (
        <article className="py-6 sm:py-8">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="flex min-w-0 items-start gap-4">
                    <Avatar className="size-10 shrink-0 border border-border bg-background">
                        <AvatarImage
                            src={logoUrl}
                            alt={altText}
                            className="object-contain"
                        />
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
                                    className="group/title inline-flex items-center gap-1.5 text-lg font-medium tracking-ui transition-colors duration-base hover:text-brand"
                                >
                                    {title}
                                    <ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-transform duration-medium ease-out-expo group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 motion-reduce:transition-none" />
                                </Link>
                            ) : (
                                <h3 className="text-lg font-medium tracking-ui">
                                    {title}
                                </h3>
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
                    </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <p className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                        {period}
                    </p>
                </div>
            </div>

            {hasDetails && (
                <div className="pl-0 sm:pl-14">
                    <div className="max-w-3xl pt-6 text-sm leading-relaxed text-muted-foreground">
                        {description && <p>{description}</p>}
                        {bullets && bullets.length > 0 && (
                            <ul className="mt-5 space-y-3">
                                {bullets.map((bullet) => (
                                    <li
                                        key={bullet}
                                        className="grid grid-cols-[auto_1fr] gap-3"
                                    >
                                        <span
                                            aria-hidden
                                            className="mt-[0.7em] size-1 rounded-full bg-brand-solid"
                                        />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { Doc } from "@/data/content";
import { DATA } from "@/data/resume";
import Link from "next/link";

interface Props {
    doc: Doc;
    backHref: string;
    backLabel: string;
}

export function CaseStudy({ doc, backHref, backLabel }: Props) {
    const { title, summary, tags, repo, live, role, company, period } =
        doc.metadata;
    const eyebrow = [company, period, role].filter(Boolean).join(" · ");

    return (
        <main id="main" className="flex min-h-[100dvh] flex-col">
            <Link
                href={backHref}
                className="font-mono text-[11px] uppercase text-muted-foreground hover:text-foreground"
            >
                &larr; {backLabel}
            </Link>

            <header className="mt-6 flex flex-col gap-y-3">
                <h1 className="text-3xl font-semibold tracking-display sm:text-4xl">
                    {title}
                </h1>
                <p className="text-pretty text-sm text-muted-foreground">
                    {summary}
                </p>
                {eyebrow && (
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {eyebrow}
                    </span>
                )}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="px-1 py-0 text-[10px]"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                {(repo || live) && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {live && (
                            <Link href={live} target="_blank">
                                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                                    <Icons.globe className="size-3" />
                                    Live
                                </Badge>
                            </Link>
                        )}
                        {repo && (
                            <Link href={repo} target="_blank">
                                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                                    <Icons.github className="size-3" />
                                    Source
                                </Badge>
                            </Link>
                        )}
                    </div>
                )}
            </header>

            <article
                className="prose prose-sm mt-10 max-w-full text-pretty font-sans prose-headings:font-semibold prose-headings:tracking-ui prose-a:text-foreground prose-a:underline-offset-4 prose-pre:text-xs dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: doc.source }}
            />

            <footer className="mt-16 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">
                    Questions about how this was built?{" "}
                    <Link
                        href={`mailto:${DATA.contact.email}`}
                        className="text-foreground underline underline-offset-4"
                    >
                        Email me
                    </Link>
                    .
                </p>
            </footer>
        </main>
    );
}

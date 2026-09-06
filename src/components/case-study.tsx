import { Metric } from "@/components/metric";
import { AnimatedText } from "@/components/animated-text";
import { ProjectVisual } from "@/components/project-visual";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SmartButton } from "@/components/smart-button";
import { TableOfContents } from "@/components/table-of-contents";
import { TagList } from "@/components/tag-list";
import type { Doc } from "@/data/content";
import { DATA } from "@/data/resume";
import Link from "next/link";

interface Props {
    doc: Doc;
    backHref: string;
    backLabel: string;
    metric?: { label: string; from: string; to: string } | null;
    next?: { href: string; title: string };
}

function Fact({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-y-2">
            <dt className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm">{children}</dd>
        </div>
    );
}

export function CaseStudy({ doc, backHref, backLabel, metric, next }: Props) {
    const { title, summary, tags, repo, live, role, company, period } =
        doc.metadata;

    return (
        <main id="main" className="mx-auto max-w-content">
            <div className="pt-10">
                <Link
                    href={backHref}
                    className="font-mono text-[10px] uppercase tracking-label text-muted-foreground hover:text-foreground"
                >
                    &larr; {backLabel}
                </Link>
            </div>

            <ScrollReveal className="mt-10">
                <ProjectVisual slug={doc.slug} interactive />
            </ScrollReveal>

            <ScrollReveal className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-20">
                <div className="flex flex-col gap-4">
                    <h1 className="text-display font-semibold">
                        <AnimatedText>{title}</AnimatedText>
                    </h1>
                    <p className="text-pretty text-lg text-muted-foreground">
                        {summary}
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    {metric && (
                        <Metric
                            label={metric.label}
                            from={metric.from}
                            to={metric.to}
                        />
                    )}
                    <div className="flex flex-wrap gap-2">
                        {live && (
                            <SmartButton href={live} tone="brand" external>
                                Live
                            </SmartButton>
                        )}
                        {repo && (
                            <SmartButton href={repo} external>
                                Source
                            </SmartButton>
                        )}
                    </div>
                </div>
            </ScrollReveal>

            <ScrollReveal className="mt-16 pt-10">
                <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {company && <Fact label="Context">{company}</Fact>}
                    {role && <Fact label="Role">{role}</Fact>}
                    {period && <Fact label="Period">{period}</Fact>}
                    {tags && tags.length > 0 && (
                        <div className="col-span-2 flex flex-col gap-y-2 lg:col-span-1">
                            <dt className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                                Stack
                            </dt>
                            <dd>
                                <TagList tags={tags} />
                            </dd>
                        </div>
                    )}
                </dl>
            </ScrollReveal>

            <div className="mt-20 gap-16 lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:items-start">
                <div className="hidden lg:block">
                    <TableOfContents headings={doc.headings} />
                </div>
                <article
                    className="prose prose-sm max-w-2xl text-pretty font-sans prose-headings:font-semibold prose-headings:tracking-ui prose-a:text-foreground prose-a:underline-offset-4 prose-pre:text-xs dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: doc.source }}
                />
            </div>

            <ScrollReveal className="mt-24 pb-24 pt-10">
                {next ? (
                    <Link
                        href={next.href}
                        className="group flex flex-col gap-2"
                    >
                        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                            Next
                        </span>
                        <span className="text-display-sm font-semibold transition-colors duration-base group-hover:text-brand">
                            {next.title}
                        </span>
                    </Link>
                ) : (
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                            Contact
                        </span>
                        <SmartButton
                            href={`mailto:${DATA.contact.email}`}
                            tone="brand"
                            className="self-start"
                        >
                            {DATA.cta.action}
                        </SmartButton>
                    </div>
                )}
            </ScrollReveal>
        </main>
    );
}

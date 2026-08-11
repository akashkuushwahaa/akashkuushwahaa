import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { getCaseStudies } from "@/data/projects";
import Link from "next/link";

export const metadata = {
    title: "Projects",
    description:
        "Write-ups of what I built, the decisions that mattered, and what the numbers did.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function ProjectsPage() {
    const studies = await getCaseStudies();

    return (
        <main id="main" className="flex min-h-[100dvh] flex-col">
            <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 className="text-3xl font-semibold tracking-display sm:text-4xl">
                    Projects
                </h1>
                <p className="mt-3 max-w-[600px] text-sm text-muted-foreground">
                    Each write-up covers the problem, the decisions that
                    mattered, what the numbers did, and what I would change.
                </p>
            </BlurFade>

            <div className="mt-10 flex flex-col">
                {studies.map((study, id) => (
                    <BlurFade
                        delay={BLUR_FADE_DELAY * 2 + id * 0.05}
                        key={study.slug}
                    >
                        <Link
                            href={`/projects/${study.slug}`}
                            className="group flex flex-col gap-y-2 border-t border-border py-6"
                        >
                            <div className="flex items-baseline justify-between gap-x-4">
                                <h2 className="text-lg font-medium tracking-ui group-hover:underline group-hover:underline-offset-4">
                                    {study.metadata.title}
                                </h2>
                                {study.metadata.role && (
                                    <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">
                                        {study.metadata.role}
                                    </span>
                                )}
                            </div>
                            <p className="text-pretty text-sm text-muted-foreground">
                                {study.metadata.summary}
                            </p>
                            {study.metadata.tags && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {study.metadata.tags.map((tag) => (
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
                        </Link>
                    </BlurFade>
                ))}
            </div>
        </main>
    );
}

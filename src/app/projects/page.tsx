import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/animated-text";
import { SmartButton } from "@/components/smart-button";
import { WorkCard } from "@/components/work-card";
import { getCaseStudies } from "@/data/projects";
import { DATA } from "@/data/resume";

export const metadata = {
    title: "Work",
    description:
        "Write-ups of what I built, the decisions that mattered, and what the numbers did.",
};

// Outcomes live in DATA so the cards here and on the home page make the same
// claim; the slug is what ties them together.
const OUTCOMES = new Map(
    DATA.projects.map((project) => [project.slug, project.outcome])
);

export default async function ProjectsPage() {
    const studies = await getCaseStudies();

    return (
        <main id="main" className="mx-auto max-w-content">
            <ScrollReveal className="flex flex-col gap-4 pb-24 pt-10">
                <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                    Selected work
                </span>
                <h1 className="text-display font-semibold">
                    <AnimatedText>Work</AnimatedText>
                </h1>
                <p className="max-w-[52ch] text-pretty text-lg text-muted-foreground">
                    Each write-up covers the problem, the decisions that
                    mattered, what the numbers did, and what I would change.
                </p>
            </ScrollReveal>

            <div className="flex flex-col gap-24 pb-32">
                {studies.map((study, index) => (
                    <ScrollReveal key={study.slug}>
                        <WorkCard
                            index={index + 1}
                            slug={study.slug}
                            href={`/projects/${study.slug}`}
                            title={study.metadata.title}
                            outcome={
                                OUTCOMES.get(study.slug) ??
                                study.metadata.summary
                            }
                            tags={study.metadata.tags ?? []}
                        />
                    </ScrollReveal>
                ))}
            </div>

            <ScrollReveal className="flex flex-col gap-5 pb-24 pt-16">
                <h2 className="max-w-[20ch] text-display-sm font-semibold">
                    {DATA.cta.title}
                </h2>
                <div>
                    <SmartButton
                        href={`mailto:${DATA.contact.email}`}
                        tone="brand"
                    >
                        {DATA.cta.action}
                    </SmartButton>
                </div>
            </ScrollReveal>
        </main>
    );
}

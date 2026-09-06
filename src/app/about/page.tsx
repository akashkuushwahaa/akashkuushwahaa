import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedText } from "@/components/animated-text";
import { SkillPhysics } from "@/components/skill-physics";
import { SmartButton } from "@/components/smart-button";
import { getAbout } from "@/data/projects";
import { DATA } from "@/data/resume";
import { notFound } from "next/navigation";

export const metadata = {
    title: "About",
    description: DATA.summary.split("\n")[0],
};

const GREETING = `Hi, my name is ${DATA.name.split(" ")[0]}.`;

export default async function AboutPage() {
    const doc = await getAbout();

    if (!doc) {
        notFound();
    }

    return (
        <main id="main">
            <section className="relative -mx-6 min-h-[calc(100svh-9rem)] overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-[38%] z-10 px-6 text-center">
                    <h1 className="text-display font-medium text-muted-foreground">
                        <AnimatedText afterTransition stagger={90}>
                            {GREETING}
                        </AnimatedText>
                    </h1>
                </div>
                <SkillPhysics
                    skills={DATA.skillPile}
                    className="absolute inset-0"
                />
            </section>

            <div className="mx-auto max-w-content">
                <ScrollReveal className="grid gap-10 pt-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
                    <div className="flex flex-col gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
                            About
                        </span>
                        <h2 className="text-display-sm font-semibold">
                            {DATA.name}
                        </h2>
                        <ul className="mt-2 flex flex-col gap-y-1.5 border-l border-border pl-4">
                            {DATA.credentials.map((line) => (
                                <li
                                    key={line}
                                    className="text-sm text-muted-foreground"
                                >
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <article
                        className="prose prose-sm max-w-full text-pretty font-sans text-base prose-headings:font-semibold prose-headings:tracking-ui prose-a:text-foreground prose-a:underline-offset-4 dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: doc.source }}
                    />
                </ScrollReveal>

                <ScrollReveal className="mt-24 flex flex-col gap-5 pb-24 pt-16">
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
            </div>
        </main>
    );
}

import { ExperienceCard } from "@/components/experience-card";
import { AnimatedText } from "@/components/animated-text";
import { HoverTilt } from "@/components/hover-tilt";
import { Marquee } from "@/components/marquee";
import { PrinciplesStack } from "@/components/principles-stack";
import { ResumeCard } from "@/components/resume-card";
import { ParticleText } from "@/components/particle-text";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WorkCard } from "@/components/work-card";
import { DATA } from "@/data/resume";
import Link from "next/link";

export default function Page() {
    return (
        <main id="main" className="mx-auto max-w-content">
            <section
                id="hero"
                className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-center pb-20 pt-12 sm:pt-24"
            >
                <div className="relative z-10 flex flex-col gap-8 sm:gap-10">
                    <p className="text-xs font-semibold uppercase leading-relaxed tracking-label">
                        <span className="text-violet">{DATA.hero.role}</span>
                        <span aria-hidden className="text-muted-foreground">
                            {" · "}
                        </span>
                        <span className="text-brand">{DATA.hero.focus}</span>
                    </p>
                    <h1 className="hero-heading max-w-[22ch] text-pretty font-medium">
                        <AnimatedText
                            accent={{
                                word: DATA.hero.headlineAccent,
                                content: (
                                    <ParticleText>
                                        {DATA.hero.headlineAccent}
                                    </ParticleText>
                                ),
                            }}
                        >
                            {DATA.hero.headlineBefore +
                                DATA.hero.headlineAccent +
                                DATA.hero.headlineAfter}
                        </AnimatedText>
                    </h1>
                    <p className="max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground sm:text-2xl sm:leading-relaxed">
                        <AnimatedText delay={120}>{DATA.hero.sub}</AnimatedText>
                    </p>
                </div>
            </section>

            <section
                id="credentials"
                aria-label="Experience at a glance"
                className="pb-24 sm:pb-40"
            >
                <ScrollReveal className="py-5">
                    <Marquee items={DATA.credentials} duration="32s" />
                </ScrollReveal>
            </section>

            <section id="projects" className="pb-32">
                <ScrollReveal className="mb-10 flex flex-col gap-3 sm:mb-14">
                    <h2 className="text-sm font-medium">Selected work</h2>
                    <p className="text-base text-muted-foreground">
                        Projects, decisions, and results
                    </p>
                </ScrollReveal>
                <div className="flex flex-col gap-24">
                    {DATA.projects.map((project, index) => (
                        <ScrollReveal key={project.slug}>
                            <WorkCard
                                index={index + 1}
                                slug={project.slug}
                                href={project.href}
                                title={project.title}
                                outcome={project.outcome}
                                tags={project.technologies}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            <section id="principles" className="pb-32">
                <ScrollReveal className="mb-16 flex flex-col gap-3">
                    <h2 className="text-sm font-medium">How I work</h2>
                    <p className="text-base text-muted-foreground">
                        Principles I build by
                    </p>
                </ScrollReveal>
                <PrinciplesStack principles={DATA.principles} />
            </section>

            <section id="about" className="pb-32">
                <ScrollReveal className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <HoverTilt className="profile-panel profile-panel-violet">
                        <span className="text-xs font-medium uppercase tracking-label">
                            About
                        </span>
                        <h2 className="mt-6 text-display-sm font-medium">
                            <AnimatedText>{DATA.name}</AnimatedText>
                        </h2>
                        <p className="mb-12 mt-6 text-lg leading-relaxed">
                            <AnimatedText delay={80}>
                                {DATA.summary.split("\n")[0]}
                            </AnimatedText>
                        </p>
                        <Link href="/about" className="profile-panel-link">
                            More about me <span aria-hidden>&#8599;</span>
                        </Link>
                    </HoverTilt>
                    <HoverTilt className="profile-panel profile-panel-yellow">
                        <span className="text-xs font-medium uppercase tracking-label">
                            Background
                        </span>
                        <h2 className="mt-6 text-display-sm font-medium">
                            <AnimatedText>
                                Experience &amp; education
                            </AnimatedText>
                        </h2>
                        <p className="mb-12 mt-6 text-lg leading-relaxed">
                            {DATA.work[0].title} at CultureX.{" "}
                            {DATA.education[0].degree}.
                        </p>
                        <Link href="/resume" className="profile-panel-link">
                            View resume <span aria-hidden>&#8599;</span>
                        </Link>
                    </HoverTilt>
                </ScrollReveal>
            </section>

            <section
                id="work"
                aria-labelledby="experience-heading"
                className="pb-20"
            >
                <ScrollReveal className="mb-10 flex flex-col gap-3">
                    <h2
                        id="experience-heading"
                        className="font-mono text-[10px] uppercase tracking-label text-muted-foreground"
                    >
                        Experience
                    </h2>
                </ScrollReveal>
                <div className="flex flex-col">
                    {DATA.work.map((work) => (
                        <ScrollReveal key={work.company}>
                            <ExperienceCard
                                logoUrl={work.logoUrl}
                                altText={work.company}
                                title={work.company}
                                subtitle={work.title}
                                href={work.href}
                                badges={work.badges}
                                period={`${work.start} - ${work.end ?? "Present"}`}
                                description={work.description}
                                bullets={work.bullets}
                            />
                            {work.caseStudy && (
                                <Link
                                    href={work.caseStudy}
                                    className="ml-16 mt-1 inline-block font-mono text-[10px] uppercase tracking-label text-muted-foreground underline underline-offset-4 hover:text-foreground"
                                >
                                    Read the full write-up &rarr;
                                </Link>
                            )}
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            <section
                id="education"
                aria-labelledby="education-heading"
                className="pb-32"
            >
                <ScrollReveal className="mb-10 flex flex-col gap-3">
                    <h2
                        id="education-heading"
                        className="font-mono text-[10px] uppercase tracking-label text-muted-foreground"
                    >
                        Education
                    </h2>
                </ScrollReveal>
                <div className="flex flex-col">
                    {DATA.education.map((education) => (
                        <ScrollReveal key={education.school}>
                            <ResumeCard
                                href={education.href}
                                logoUrl={education.logoUrl}
                                altText={education.school}
                                title={education.school}
                                subtitle={education.degree}
                                period={`${education.start} - ${education.end}`}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            <section id="contact">
                <ScrollReveal className="flex flex-col items-start gap-9 pt-12 sm:pt-16">
                    <h2 className="whitespace-pre-line text-pretty text-2xl font-medium leading-tight tracking-ui">
                        <AnimatedText>
                            {DATA.cta.title.replace(", ", ",\n")}
                        </AnimatedText>
                    </h2>
                    <Link
                        href={`mailto:${DATA.contact.email}`}
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-7 py-3 text-base font-medium text-background transition-opacity duration-base hover:opacity-85"
                    >
                        {DATA.cta.action}
                    </Link>
                </ScrollReveal>
            </section>
        </main>
    );
}

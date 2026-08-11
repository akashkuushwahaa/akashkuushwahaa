import { ExperienceCard } from "@/components/experience-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
    return (
        <main id="main" className="flex min-h-[100dvh] flex-col space-y-10">
            <section id="hero">
                <div className="mx-auto w-full max-w-2xl space-y-8">
                    <div className="flex justify-between gap-2">
                        <div className="flex flex-1 flex-col space-y-1.5">
                            <BlurFadeText
                                delay={BLUR_FADE_DELAY}
                                className="text-3xl font-semibold tracking-display sm:text-5xl xl:text-6xl/none"
                                yOffset={8}
                                text={DATA.name}
                            />
                            <BlurFadeText
                                className="max-w-[600px] md:text-xl"
                                delay={BLUR_FADE_DELAY}
                                text={DATA.description}
                            />
                            <BlurFade delay={BLUR_FADE_DELAY * 2}>
                                <p className="pt-1 font-mono text-[11px] uppercase text-muted-foreground">
                                    <Link
                                        href={DATA.locationLink}
                                        className="hover:text-foreground"
                                    >
                                        {DATA.location}
                                    </Link>
                                    <span aria-hidden> · </span>
                                    <span>Open to work</span>
                                    <span aria-hidden> · </span>
                                    <Link
                                        href={DATA.resumeUrl}
                                        className="underline underline-offset-4 hover:text-foreground"
                                    >
                                        Résumé
                                    </Link>
                                </p>
                            </BlurFade>
                        </div>
                        <BlurFade delay={BLUR_FADE_DELAY}>
                            <Avatar className="size-28 border">
                                <AvatarFallback className="bg-transparent font-mono text-2xl font-medium tracking-ui">
                                    {DATA.initials}
                                </AvatarFallback>
                            </Avatar>
                        </BlurFade>
                    </div>
                </div>
            </section>

            <section id="about">
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                    <h2 className="text-2xl font-semibold leading-tight tracking-heading">
                        About
                    </h2>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                    <Markdown className="prose prose-sm mt-2 max-w-full text-pretty font-sans text-sm text-muted-foreground prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 dark:prose-invert">
                        {DATA.summary}
                    </Markdown>
                </BlurFade>
            </section>

            <section id="skills">
                <div className="flex min-h-0 flex-col gap-y-3">
                    <BlurFade delay={BLUR_FADE_DELAY * 5}>
                        <h2 className="text-2xl font-semibold leading-tight tracking-heading">
                            Skills
                        </h2>
                    </BlurFade>
                    <div className="flex flex-col gap-y-4">
                        {Object.entries(DATA.skills).map(
                            ([category, skills], categoryIdx) => (
                                <BlurFade
                                    key={category}
                                    delay={
                                        BLUR_FADE_DELAY * 6 + categoryIdx * 0.1
                                    }
                                >
                                    <div className="flex flex-col gap-y-2">
                                        <span className="font-mono text-[10px] uppercase text-muted-foreground">
                                            {category}
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {skills.map((skill) => (
                                                <Badge key={skill}>
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </BlurFade>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section id="work">
                <div className="flex min-h-0 flex-col gap-y-3">
                    <BlurFade delay={BLUR_FADE_DELAY * 7}>
                        <h2 className="text-2xl font-semibold leading-tight tracking-heading">
                            Work Experience
                        </h2>
                    </BlurFade>
                    {DATA.work.map((work, id) => (
                        <BlurFade
                            key={work.company}
                            delay={BLUR_FADE_DELAY * 8 + id * 0.05}
                        >
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
                                defaultExpanded={id === 0}
                            />
                            {work.caseStudy && (
                                <Link
                                    href={work.caseStudy}
                                    className="ml-16 mt-1 inline-block font-mono text-[10px] uppercase text-muted-foreground underline underline-offset-4 hover:text-foreground"
                                >
                                    Read the full write-up &rarr;
                                </Link>
                            )}
                        </BlurFade>
                    ))}
                </div>
            </section>

            <section id="education">
                <div className="flex min-h-0 flex-col gap-y-3">
                    <BlurFade delay={BLUR_FADE_DELAY * 9}>
                        <h2 className="text-2xl font-semibold leading-tight tracking-heading">
                            Education
                        </h2>
                    </BlurFade>
                    {DATA.education.map((education, id) => (
                        <BlurFade
                            key={education.school}
                            delay={BLUR_FADE_DELAY * 10 + id * 0.05}
                        >
                            <ResumeCard
                                href={education.href}
                                logoUrl={education.logoUrl}
                                altText={education.school}
                                title={education.school}
                                subtitle={education.degree}
                                period={`${education.start} - ${education.end}`}
                            />
                        </BlurFade>
                    ))}
                </div>
            </section>

            <section id="projects">
                <div className="w-full space-y-12 py-12">
                    <BlurFade delay={BLUR_FADE_DELAY * 11}>
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
                                    Projects
                                </div>
                                <h2 className="text-3xl font-semibold leading-tight tracking-display sm:text-5xl">
                                    Things I measured, then shipped
                                </h2>
                                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Each one has a write-up: the problem, the
                                    decisions that mattered, what the numbers
                                    did, and what I would change.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                    <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
                        {DATA.projects.map((project, id) => (
                            <BlurFade
                                key={project.title}
                                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                            >
                                <ProjectCard
                                    href={project.href}
                                    title={project.title}
                                    description={project.description}
                                    dates={project.dates}
                                    tags={project.technologies}
                                    metric={project.metric}
                                    links={project.links}
                                />
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact">
                <div className="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 16}>
                        <div className="space-y-3">
                            <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
                                Contact
                            </div>
                            <h2 className="text-3xl font-semibold leading-tight tracking-display sm:text-5xl">
                                Open to work
                            </h2>
                            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                I am looking for engineering work on products
                                that put a model in front of real users. Send me{" "}
                                <Link
                                    href={`mailto:${DATA.contact.email}`}
                                    className="text-foreground underline underline-offset-4"
                                >
                                    an email
                                </Link>{" "}
                                and I will reply.
                            </p>
                        </div>
                    </BlurFade>
                </div>
            </section>
        </main>
    );
}

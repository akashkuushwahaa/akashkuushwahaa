import { ProjectMedia } from "@/components/project-media";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import jobPilotShot from "../../public/job-pilot.png";
import assistantShot from "../../public/job-application-assistant.png";

interface Props {
    slug: string;
    className?: string;
    // Case studies get the real screen recording behind a click; cards keep the
    // static visual so the home page never pulls a video it may not need.
    interactive?: boolean;
}

const MEDIA: Record<string, { src: string; label: string }> = {
    "code-review-agent": {
        src: "/code-review-demo.mp4",
        label: "Code Review Agent demo",
    },
};

// Where a real screenshot of the shipped product exists it replaces the
// illustration below. Static imports carry the intrinsic size, so the frame
// reserves the right box before the file loads.
const SHOTS: Record<
    string,
    { src: StaticImageData; alt: string; label: string }
> = {
    "job-pilot": {
        src: jobPilotShot,
        alt: "The Job Pilot landing page, with a dashboard preview showing jobs found, average match rate, and companies researched",
        label: "jobpilot-sigma-rose.vercel.app",
    },
    "job-application-assistant": {
        src: assistantShot,
        alt: "The Job Application Workspace: a form taking a company, role, resume upload, and pasted job posting, above an analyse button",
        label: "job application workspace · streamlit",
    },
};

function Chrome({
    label,
    bleed,
    children,
}: {
    label: string;
    bleed?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="project-window mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-card shadow-work transition-transform duration-slow ease-out-expo group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none">
            <div className="flex items-center gap-2 px-3 py-2">
                <span className="flex gap-1.5" aria-hidden>
                    <span className="size-2 rounded-full bg-muted-foreground/40" />
                    <span className="size-2 rounded-full bg-muted-foreground/40" />
                    <span className="size-2 rounded-full bg-muted-foreground/40" />
                </span>
                <span className="ml-2 truncate font-mono text-[10px] sm:text-xs uppercase tracking-label text-muted-foreground">
                    {label}
                </span>
            </div>
            <div className={bleed ? undefined : "p-4 sm:p-8 lg:p-10"}>
                {children}
            </div>
        </div>
    );
}

function Prompt({ children }: { children: React.ReactNode }) {
    return (
        <p className="flex gap-2">
            <span aria-hidden className="select-none text-brand">
                $
            </span>
            <span className="min-w-0">{children}</span>
        </p>
    );
}

function Finding({
    at,
    code,
    note,
}: {
    at: string;
    code: string;
    note: string;
}) {
    return (
        <div className="mt-3">
            <p className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-brand-pop px-1.5 font-mono text-[10px] uppercase tracking-label text-brand-pop-ink">
                    High
                </span>
                <span className="text-muted-foreground">{at}</span>
            </p>
            <p className="mt-1 flex gap-2 overflow-x-auto">
                <span
                    aria-hidden
                    className="select-none text-muted-foreground/50"
                >
                    &#9474;
                </span>
                <span className="whitespace-pre text-brand">{code}</span>
            </p>
            <p className="flex gap-2 text-muted-foreground">
                <span
                    aria-hidden
                    className="select-none text-muted-foreground/50"
                >
                    &#9492;
                </span>
                <span>{note}</span>
            </p>
        </div>
    );
}

function CodeReview() {
    const stages = [
        ["extract diff", "4 files"],
        ["retrieve context", "chroma · 11 chunks"],
        ["analyse", "gpt-4o"],
    ] as const;

    return (
        <Chrome label="~/code-review-agent — github actions">
            <div className="font-mono text-xs leading-relaxed sm:text-sm">
                <Prompt>
                    gh workflow run code-review.yml --ref feat/checkout
                </Prompt>

                <div className="mt-3 flex flex-col gap-0.5">
                    {stages.map(([stage, detail]) => (
                        <p
                            key={stage}
                            className="flex gap-2 text-muted-foreground"
                        >
                            <span
                                aria-hidden
                                className="select-none text-green"
                            >
                                &#10003;
                            </span>
                            <span className="flex-1">{stage}</span>
                            <span>{detail}</span>
                        </p>
                    ))}
                </div>

                <Finding
                    at="src/db/client.py:12"
                    code={'password = "s3cr3t-prod-key"'}
                    note="secret in source — rotate it, it is already in the git history"
                />
                <Finding
                    at="src/auth/session.py:41"
                    code={'execute(f"select * from users where id = {uid}")'}
                    note="sql injection — pass uid as a query parameter"
                />

                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-label text-muted-foreground sm:text-xs">
                    <span>4 files scanned</span>
                    <span>2 findings</span>
                    <span>0 style comments</span>
                    <span className="text-brand">posted to #248</span>
                </p>
            </div>
        </Chrome>
    );
}

function Shot({
    src,
    alt,
    label,
    priority,
}: {
    src: StaticImageData;
    alt: string;
    label: string;
    priority?: boolean;
}) {
    return (
        <Chrome label={label} bleed>
            <Image
                src={src}
                alt={alt}
                priority={priority}
                sizes="(min-width: 1024px) 896px, 100vw"
                placeholder="blur"
                className="block w-full"
            />
        </Chrome>
    );
}

function SubscriptionApi() {
    return (
        <Chrome label="~/subscription-tracker — zsh">
            <div className="font-mono text-xs leading-relaxed sm:text-sm">
                <Prompt>
                    <span className="whitespace-pre-wrap">
                        curl -X POST /api/v1/subscriptions -H
                        &quot;Authorization: Bearer $TOKEN&quot; -d
                        @renewal.json
                    </span>
                </Prompt>

                <p className="mt-3">
                    <span className="text-green">201</span>
                    <span className="text-muted-foreground"> Created</span>
                </p>
                <div className="mt-1 overflow-x-auto whitespace-pre text-muted-foreground">
                    {`{
  "id": "sub_8fa21",
  "renews": "2026-04-01",
  "reminder": "scheduled"
}`}
                </div>

                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-label text-muted-foreground sm:text-xs">
                    <span>
                        x-ratelimit-remaining{" "}
                        <span className="text-foreground">96 / 100</span>
                    </span>
                    <span>
                        bot-check <span className="text-green">passed</span>
                    </span>
                </p>
            </div>
        </Chrome>
    );
}

const VISUALS: Record<string, () => React.JSX.Element> = {
    "code-review-agent": CodeReview,
    "subscription-tracker": SubscriptionApi,
};

// Stands in for the product screenshots an image-led layout expects. Each one
// depicts what the tool actually emits, so the visual carries information
// rather than decorating the card.
export function ProjectVisual({ slug, className, interactive }: Props) {
    const Visual = VISUALS[slug];
    const shot = SHOTS[slug];

    if (!Visual && !shot) {
        return null;
    }

    const media = interactive ? MEDIA[slug] : undefined;

    return (
        <div
            data-project={slug}
            className={cn(
                "project-stage relative grid items-center overflow-hidden rounded-xl p-5 py-12 sm:p-12 lg:p-16",
                // A screenshot sets its own height; only the illustrations need
                // the box held open.
                !shot && "sm:aspect-[16/10]",
                className
            )}
        >
            <span className="absolute left-5 top-4 font-mono text-[11px] sm:text-sm uppercase tracking-label text-muted-foreground sm:left-8 sm:top-6">
                {shot ? "Shipped product" : "Illustrative workflow"}
            </span>
            {shot ? (
                <Shot {...shot} priority={interactive} />
            ) : media ? (
                <ProjectMedia
                    src={media.src}
                    label={media.label}
                    poster={<Visual />}
                />
            ) : (
                <Visual />
            )}
        </div>
    );
}

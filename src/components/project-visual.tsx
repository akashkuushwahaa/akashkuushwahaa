import { ProjectMedia } from "@/components/project-media";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { Children, type CSSProperties } from "react";
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

// The macOS title bar shared by every window on the site, so a screenshot and
// a terminal read as two windows from the same desktop.
function WindowBar({ title }: { title: string }) {
    return (
        <div className="terminal-bar relative flex items-center px-3.5 py-2.5">
            <span className="flex gap-2" aria-hidden>
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="t-dim absolute inset-x-20 truncate text-center font-mono text-[11px] sm:text-xs">
                {title}
            </span>
        </div>
    );
}

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
            <WindowBar title={label} />
            <div className={bleed ? undefined : "p-4 sm:p-8 lg:p-10"}>
                {children}
            </div>
        </div>
    );
}

// A terminal window drawn the way one actually looks: dark ground, macOS
// traffic lights, a session title, and output in an ANSI-style palette that
// stays the same in both site themes because it is depicting a screenshot.
function Terminal({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="terminal project-window mx-auto w-full max-w-4xl overflow-hidden rounded-lg shadow-work transition-transform duration-slow ease-out-expo group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none">
            <WindowBar title={title} />
            <div className="p-4 font-mono text-[11px] leading-[1.7] sm:p-6 sm:text-[13px]">
                {Children.map(children, (child, index) => (
                    <div
                        className="terminal-line"
                        style={{ "--n": index } as CSSProperties}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
}

// The robbyrussell zsh prompt, colour for colour.
function Prompt({
    dir,
    branch,
    dirty,
    children,
}: {
    dir: string;
    branch: string;
    dirty?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <p className="whitespace-pre-wrap">
            <span aria-hidden className="t-green select-none">
                ➜{"  "}
            </span>
            <span className="t-cyan">{dir}</span>{" "}
            <span className="t-blue">git:(</span>
            <span className="t-red">{branch}</span>
            <span className="t-blue">)</span>
            {dirty && <span className="t-yellow"> ✗</span>}{" "}
            {children ?? <span aria-hidden className="terminal-cursor" />}
        </p>
    );
}

function Blank() {
    return <p aria-hidden>&nbsp;</p>;
}

function Stage({
    label,
    detail,
    time,
}: {
    label: string;
    detail: string;
    time: string;
}) {
    return (
        <p className="flex gap-3">
            <span aria-hidden className="t-green select-none">
                ✔
            </span>
            <span className="min-w-[13ch] shrink-0 sm:min-w-[18ch]">
                {label}
            </span>
            <span className="t-dim min-w-0 flex-1 truncate">{detail}</span>
            <span className="t-dim hidden shrink-0 sm:inline">{time}</span>
        </p>
    );
}

function Finding({
    file,
    line,
    kind,
    code,
    note,
}: {
    file: string;
    line: number;
    kind: string;
    code: string;
    note: string;
}) {
    return (
        <>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 pl-3 sm:pl-5">
                <span className="t-cyan">
                    {file}
                    <span className="t-dim">:{line}</span>
                </span>
                <span className="t-badge">HIGH</span>
                <span className="t-yellow">{kind}</span>
            </p>
            <p className="flex gap-3 pl-3 sm:pl-5">
                <span
                    aria-hidden
                    className="t-dim select-none whitespace-nowrap tabular-nums"
                >
                    {line} │
                </span>
                <span className="whitespace-pre-wrap break-all">{code}</span>
            </p>
            <p className="t-dim flex gap-3 pl-3 sm:pl-5">
                <span aria-hidden className="select-none whitespace-pre">
                    {" ".repeat(String(line).length)} └
                </span>
                <span>{note}</span>
            </p>
        </>
    );
}

function CodeReview() {
    const at = { dir: "code-review-agent", branch: "feat/checkout" };
    return (
        <Terminal title="code-review-agent — python · 104×30">
            <Prompt {...at} dirty>
                python -m agent.review --pr 248
            </Prompt>
            <Stage
                label="extract diff"
                detail="4 files · +212 −38"
                time="0.2s"
            />
            <Stage
                label="retrieve context"
                detail="chroma · 11 chunks across 6 files"
                time="0.9s"
            />
            <Stage label="analyse" detail="gpt-4o · 2 findings" time="3.8s" />
            <Blank />
            <Finding
                file="src/db/client.py"
                line={12}
                kind="hardcoded secret"
                code={'password = "s3cr3t-prod-key"'}
                note="rotate it — the value is already in git history"
            />
            <Blank />
            <Finding
                file="src/auth/session.py"
                line={41}
                kind="sql injection"
                code={'execute(f"select * from users where id = {uid}")'}
                note="pass uid as a bound query parameter"
            />
            <Blank />
            <p className="flex flex-wrap gap-x-3">
                <span className="t-green">✔ posted 2 review comments</span>
                <span className="t-dim">on #248 · 0 style comments · 5.1s</span>
            </p>
            <Prompt {...at} dirty />
        </Terminal>
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

function Request({
    method,
    path,
    status,
    time,
    note,
}: {
    method: string;
    path: string;
    status: number;
    time: string;
    note?: string;
}) {
    return (
        <p className="flex flex-wrap gap-x-3">
            <span className="t-magenta w-[4ch]">{method}</span>
            <span>{path}</span>
            <span className={status < 400 ? "t-green" : "t-red"}>{status}</span>
            <span className="t-dim">{time}</span>
            {note && <span className="t-dim">· {note}</span>}
        </p>
    );
}

function SubscriptionApi() {
    const at = { dir: "subscription-tracker", branch: "main" };
    return (
        <Terminal title="subscription-tracker — node · 104×30">
            <Prompt {...at}>npm run dev</Prompt>
            <p className="t-dim">[nodemon] starting `node app.js`</p>
            <p>
                <span className="t-green">✔</span> MongoDB connected{" "}
                <span className="t-dim">(development)</span>
            </p>
            <p>
                <span className="t-green">✔</span> API listening on{" "}
                <span className="t-cyan">http://localhost:5500</span>
            </p>
            <p>
                <span className="t-green">✔</span> renewal reminders scheduled{" "}
                <span className="t-dim">cron 0 9 * * *</span>
            </p>
            <Blank />
            <Request
                method="POST"
                path="/api/v1/auth/sign-in"
                status={200}
                time="84.2 ms"
            />
            <Request
                method="POST"
                path="/api/v1/subscriptions"
                status={201}
                time="42.3 ms"
                note="arcjet allow · rate 96/100"
            />
            <Request
                method="GET"
                path="/api/v1/subscriptions/sub_8fa21"
                status={200}
                time="7.9 ms"
            />
            <Request
                method="POST"
                path="/api/v1/subscriptions"
                status={429}
                time="1.1 ms"
                note="arcjet deny · rate limit"
            />
            <Request
                method="GET"
                path="/api/v1/users/6f1a"
                status={403}
                time="2.4 ms"
                note="role: user ≠ admin"
            />
            <Blank />
            <p className="t-dim">
                [cron] renewal sweep · 3 subscriptions renew in 7 days · 3
                reminders sent
            </p>
            <p>
                <span aria-hidden className="terminal-cursor" />
            </p>
        </Terminal>
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

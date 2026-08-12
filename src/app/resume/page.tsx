import BlurFade from "@/components/magicui/blur-fade";
import { buttonVariants } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Resume",
    description: `The one-page resume for ${DATA.name} — ${DATA.description}.`,
};

const BLUR_FADE_DELAY = 0.04;
const DOWNLOAD_NAME = "Akash-Kushwaha-Resume.pdf";

export default function ResumePage() {
    return (
        <main
            id="main"
            className="relative left-1/2 flex min-h-[100dvh] w-[92vw] max-w-[900px] -translate-x-1/2 flex-col pb-24"
        >
            <BlurFade delay={BLUR_FADE_DELAY}>
                <Link
                    href="/"
                    className="font-mono text-[11px] uppercase text-muted-foreground hover:text-foreground"
                >
                    &larr; Back to home
                </Link>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-display sm:text-4xl">
                            Resume
                        </h1>
                        <p className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">
                            One page · PDF
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={DATA.resumeFile}
                            download={DOWNLOAD_NAME}
                            className={cn(
                                buttonVariants({ size: "sm" }),
                                "gap-2"
                            )}
                        >
                            <DownloadIcon className="size-3.5" />
                            Download PDF
                        </a>
                        <a
                            href={DATA.resumeFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "sm",
                                }),
                                "gap-2"
                            )}
                        >
                            <ExternalLinkIcon className="size-3.5" />
                            Open in new tab
                        </a>
                    </div>
                </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <object
                    data={`${DATA.resumeFile}#view=FitH`}
                    type="application/pdf"
                    aria-label={`Resume of ${DATA.name}`}
                    className="mt-8 hidden h-[75vh] min-h-[480px] w-full rounded-lg border border-border bg-muted sm:block"
                >
                    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                        <p className="text-sm text-muted-foreground">
                            This browser will not display a PDF inline. Open it
                            in a new tab or download it instead.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <a
                                href={DATA.resumeFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    buttonVariants({ size: "sm" }),
                                    "gap-2"
                                )}
                            >
                                <ExternalLinkIcon className="size-3.5" />
                                Open in new tab
                            </a>
                            <a
                                href={DATA.resumeFile}
                                download={DOWNLOAD_NAME}
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                    }),
                                    "gap-2"
                                )}
                            >
                                <DownloadIcon className="size-3.5" />
                                Download PDF
                            </a>
                        </div>
                    </div>
                </object>

                <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-border px-6 py-12 text-center sm:hidden">
                    <p className="text-sm text-muted-foreground">
                        Phone browsers do not render PDFs inline. Open the
                        resume in a new tab, or download it.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <a
                            href={DATA.resumeFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({ size: "sm" }),
                                "gap-2"
                            )}
                        >
                            <ExternalLinkIcon className="size-3.5" />
                            Open in new tab
                        </a>
                        <a
                            href={DATA.resumeFile}
                            download={DOWNLOAD_NAME}
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "sm",
                                }),
                                "gap-2"
                            )}
                        >
                            <DownloadIcon className="size-3.5" />
                            Download PDF
                        </a>
                    </div>
                </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 3}>
                <p className="mt-6 text-sm text-muted-foreground">
                    Prefer the long version? The{" "}
                    <Link
                        href="/projects"
                        className="text-foreground underline underline-offset-4"
                    >
                        project write-ups
                    </Link>{" "}
                    cover the same work in detail.
                </p>
            </BlurFade>
        </main>
    );
}

import { DATA } from "@/data/resume";
import { AnimatedText } from "@/components/animated-text";
import Link from "next/link";

export function SiteFooter() {
    const socials = Object.entries(DATA.contact.social).filter(
        ([, social]) => social.navbar && social.url.startsWith("http")
    );

    return (
        <footer className="relative overflow-hidden pb-28 sm:pb-20">
            <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 1100 150"
                className="pointer-events-none block w-full select-none"
            >
                <text
                    x="550"
                    y="130"
                    textAnchor="middle"
                    textLength="1090"
                    lengthAdjust="spacingAndGlyphs"
                    fontSize="145"
                    fontWeight="600"
                    letterSpacing="-6"
                    wordSpacing="12"
                    className="fill-foreground/[0.07] font-sans"
                >
                    {DATA.name}
                </text>
            </svg>
            <div className="px-6">
                <div className="mx-auto max-w-content">
                    <p className="mt-6 max-w-[52ch] text-pretty text-xl leading-relaxed text-muted-foreground sm:mt-8 sm:text-2xl">
                        <AnimatedText>{DATA.description}</AnimatedText>
                    </p>
                    <ul className="mt-8 flex flex-wrap items-center gap-3 sm:mt-12">
                        <li className="min-w-0 max-w-full">
                            <Link
                                href={`mailto:${DATA.contact.email}`}
                                className="inline-flex min-h-11 max-w-full items-center rounded-full bg-card px-4 py-3 text-sm font-medium transition-colors duration-base hover:bg-muted sm:px-5"
                            >
                                <span className="break-all">
                                    {DATA.contact.email}
                                </span>
                            </Link>
                        </li>
                        {socials.map(([name, social]) => (
                            <li key={name}>
                                <Link
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-11 items-center rounded-full bg-card px-5 py-3 text-sm font-medium transition-colors duration-base hover:bg-muted"
                                >
                                    {social.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 pt-8 text-sm text-muted-foreground sm:mt-12 sm:pt-12">
                        <p>
                            &copy; {new Date().getFullYear()} {DATA.name}. All
                            rights reserved.
                        </p>
                        <p>{DATA.location}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

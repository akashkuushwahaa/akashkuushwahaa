"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LINKS = [
    { href: "/projects", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/resume", label: "Resume" },
];

export function SiteNav() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDetailsElement>(null);
    const currentPage =
        LINKS.find((link) => pathname.startsWith(link.href))?.label ?? "Home";

    useEffect(() => {
        if (menuRef.current) menuRef.current.open = false;
    }, [pathname]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && menuRef.current?.open) {
                menuRef.current.open = false;
                menuRef.current.querySelector("summary")?.focus();
            }
        };
        const onPointer = (event: PointerEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                menuRef.current.open = false;
            }
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
        };
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="site-header pointer-events-none fixed inset-x-0 top-5 z-50 px-4">
            {/* At the top of the page the bar runs the full measure and is
                invisible; on scroll it contracts into a floating pill. Both
                states are the same flex row, so max-width carries the motion. */}
            <nav
                aria-label="Main"
                className={cn(
                    "pointer-events-auto mx-auto hidden items-center justify-between gap-4 rounded-full border py-1.5 transition-[max-width,padding,background-color,border-color,backdrop-filter] duration-slow ease-out-expo motion-reduce:transition-none sm:flex",
                    scrolled
                        ? "max-w-[600px] border-border/50 bg-card/95 pl-6 pr-1.5 backdrop-blur-xl"
                        : "max-w-4xl border-transparent bg-transparent pl-2 pr-1.5"
                )}
            >
                <Link
                    href="/"
                    className="shrink-0 text-sm font-medium tracking-ui"
                >
                    <span
                        key={scrolled ? "short" : "full"}
                        className="inline-block animate-label-in whitespace-nowrap"
                    >
                        {scrolled
                            ? DATA.initials.split("").join(" ")
                            : DATA.name}
                    </span>
                </Link>

                <div className="hidden items-center gap-6 sm:flex">
                    {LINKS.map((link) => {
                        const active = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "nav-link py-2 text-sm transition-colors duration-base",
                                    active
                                        ? "text-brand"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="nav-link-window">
                                    <span
                                        className="nav-link-label"
                                        data-label={link.label}
                                    >
                                        {link.label}
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Link
                        href={`mailto:${DATA.contact.email}`}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm text-background"
                    >
                        Contact
                        <span
                            aria-hidden
                            className="transition-transform duration-medium ease-out-expo group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                        >
                            &rarr;
                        </span>
                    </Link>
                    <ModeToggle />
                </div>
            </nav>
            <details
                ref={menuRef}
                className="mobile-nav pointer-events-auto relative rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl sm:hidden"
            >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-sm">
                    <span className="font-medium">{DATA.name}</span>
                    <span className="flex items-center gap-3 text-muted-foreground">
                        {currentPage}
                        <ChevronUp
                            className="mobile-nav-chevron size-4"
                            aria-hidden
                        />
                    </span>
                    <span className="sr-only">Toggle navigation</span>
                </summary>
                <nav aria-label="Mobile" className="mobile-nav-panel">
                    {[{ href: "/", label: "Home" }, ...LINKS].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={
                                link.label === currentPage ? "page" : undefined
                            }
                            onClick={() => {
                                if (menuRef.current)
                                    menuRef.current.open = false;
                            }}
                            className={cn(
                                "flex min-h-12 items-center justify-between rounded-lg px-3 text-lg",
                                link.label === currentPage
                                    ? "text-brand"
                                    : "text-foreground hover:bg-muted"
                            )}
                        >
                            {link.label}
                            <span aria-hidden>&#8599;</span>
                        </Link>
                    ))}
                    <div className="mt-3 flex items-center justify-between pt-3">
                        <Link
                            href={`mailto:${DATA.contact.email}`}
                            className="rounded-full bg-foreground px-5 py-3 text-sm text-background"
                        >
                            Contact &rarr;
                        </Link>
                        <ModeToggle />
                    </div>
                </nav>
            </details>
        </header>
    );
}

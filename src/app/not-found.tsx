import Link from "next/link";

export const metadata = {
    title: "Not found",
};

export default function NotFound() {
    return (
        <main
            id="main"
            className="mx-auto flex max-w-2xl flex-col items-start gap-y-4 py-24"
        >
            <span className="font-mono text-[10px] uppercase tracking-label text-brand">
                404
            </span>
            <h1 className="text-display font-semibold">No route matched</h1>
            <p className="max-w-[440px] text-pretty text-base text-muted-foreground">
                Either the link is stale, or I moved something without leaving a
                redirect behind. The second one is more likely.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                <Link
                    href="/"
                    className="text-sm text-brand underline underline-offset-4"
                >
                    Home
                </Link>
                <Link
                    href="/projects"
                    className="text-sm text-brand underline underline-offset-4"
                >
                    Projects
                </Link>
            </div>
        </main>
    );
}

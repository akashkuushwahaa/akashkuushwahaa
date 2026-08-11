import { CaseStudy } from "@/components/case-study";
import { getCaseStudies, getCaseStudy } from "@/data/projects";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const studies = await getCaseStudies();
    return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const study = await getCaseStudy(slug);

    if (!study) {
        return {};
    }

    const { title, summary } = study.metadata;

    return {
        title,
        description: summary,
        openGraph: {
            title,
            description: summary,
            type: "article",
            url: `${DATA.url}/projects/${slug}`,
        },
        twitter: { card: "summary_large_image", title, description: summary },
    };
}

export default async function ProjectCaseStudy(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const study = await getCaseStudy(slug);

    if (!study) {
        notFound();
    }

    return (
        <>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CreativeWork",
                        name: study.metadata.title,
                        description: study.metadata.summary,
                        url: `${DATA.url}/projects/${slug}`,
                        author: { "@type": "Person", name: DATA.name },
                    }),
                }}
            />
            <CaseStudy
                doc={study}
                backHref="/projects"
                backLabel="All projects"
            />
        </>
    );
}

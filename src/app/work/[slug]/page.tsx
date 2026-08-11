import { CaseStudy } from "@/components/case-study";
import { getWorkStudies, getWorkStudy } from "@/data/projects";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const studies = await getWorkStudies();
    return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const study = await getWorkStudy(slug);

    if (!study) {
        return {};
    }

    const { title, summary, company } = study.metadata;
    const pageTitle = company ? `${title} at ${company}` : title;

    return {
        title: pageTitle,
        description: summary,
        openGraph: {
            title: pageTitle,
            description: summary,
            type: "article",
            url: `${DATA.url}/work/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description: summary,
        },
    };
}

export default async function WorkCaseStudy(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const study = await getWorkStudy(slug);

    if (!study) {
        notFound();
    }

    return <CaseStudy doc={study} backHref="/#work" backLabel="Back to home" />;
}

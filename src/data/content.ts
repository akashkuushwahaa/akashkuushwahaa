import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type DocMetadata = {
    title: string;
    slug: string;
    summary: string;
    tags?: string[];
    repo?: string;
    live?: string;
    role?: string;
    company?: string;
    period?: string;
    featured?: boolean;
    order?: number;
};

export type Doc = {
    slug: string;
    metadata: DocMetadata;
    source: string;
};

export async function markdownToHTML(markdown: string) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypePrettyCode, {
            theme: { light: "min-light", dark: "min-dark" },
            keepBackground: false,
        })
        .use(rehypeStringify)
        .process(markdown);

    return file.toString();
}

export async function getDoc(dir: string, slug: string): Promise<Doc | null> {
    const filePath = path.join(process.cwd(), "content", dir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const { content, data } = matter(fs.readFileSync(filePath, "utf-8"));

    return {
        slug,
        metadata: { ...data, slug } as DocMetadata,
        source: await markdownToHTML(stripLeadingHeading(content)),
    };
}

export async function getDocs(dir: string): Promise<Doc[]> {
    const dirPath = path.join(process.cwd(), "content", dir);

    const docs = await Promise.all(
        fs
            .readdirSync(dirPath)
            .filter((file) => path.extname(file) === ".md")
            .map((file) => getDoc(dir, path.basename(file, ".md")))
    );

    return docs
        .filter((doc): doc is Doc => doc !== null)
        .sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
}

// The page renders the title from frontmatter, so drop the duplicate H1 that
// every content file opens with.
function stripLeadingHeading(content: string) {
    const trimmed = content.replace(/^\s+/, "");
    return trimmed.startsWith("# ")
        ? trimmed.slice(trimmed.indexOf("\n") + 1)
        : trimmed;
}

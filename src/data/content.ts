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

export type Heading = {
    id: string;
    text: string;
};

export type Doc = {
    slug: string;
    metadata: DocMetadata;
    source: string;
    headings: Heading[];
};

type MarkdownNode = {
    type: string;
    lang?: string | null;
    value?: string;
    children?: MarkdownNode[];
    data?: Record<string, unknown>;
};

type HastNode =
    | { type: "text"; value: string }
    | {
          type: "element";
          tagName: string;
          properties: Record<string, unknown>;
          children: HastNode[];
      };

const element = (
    tagName: string,
    className: string[],
    children: HastNode[]
): HastNode => ({
    type: "element",
    tagName,
    properties: { className },
    children,
});

// Backticks in a stage's text become <code>, the way they do in prose.
function inline(source: string): HastNode[] {
    return source
        .split("`")
        .filter((part) => part !== "")
        .map((part, index) =>
            index % 2 === 1
                ? element("code", [], [{ type: "text", value: part }])
                : { type: "text", value: part }
        );
}

// A ```pipeline fence is one stage per line, `name | what happens | aside`,
// rendered as the stepped ledger in globals.css rather than as a code block.
// remark-rehype honours the hName/hChildren data, and rehype-pretty-code
// never sees a <pre>.
function remarkPipeline() {
    const stages = (source: string): HastNode[] =>
        source
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => {
                const [name = "", detail = "", note = ""] = line
                    .split("|")
                    .map((part) => part.trim());
                const body = inline(detail);
                if (note) {
                    body.push(element("span", ["pipeline-note"], inline(note)));
                }
                return element(
                    "li",
                    index === 0
                        ? ["pipeline-step", "pipeline-entry"]
                        : ["pipeline-step"],
                    [
                        element(
                            "span",
                            ["pipeline-name"],
                            [{ type: "text", value: name }]
                        ),
                        element("span", ["pipeline-detail"], body),
                    ]
                );
            });

    const walk = (node: MarkdownNode) => {
        for (const child of node.children ?? []) {
            if (child.type === "code" && child.lang === "pipeline") {
                // The code handler would wrap the list in <pre>; an unknown
                // type takes the default handler, which builds from the data.
                child.type = "pipeline";
                child.data = {
                    hName: "ol",
                    hProperties: { className: ["pipeline", "not-prose"] },
                    hChildren: stages(child.value ?? ""),
                };
            } else {
                walk(child);
            }
        }
    };

    return (tree: MarkdownNode) => walk(tree);
}

export async function markdownToHTML(markdown: string) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkPipeline)
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

    const source = await markdownToHTML(stripLeadingHeading(content));

    return {
        slug,
        metadata: { ...data, slug } as DocMetadata,
        source,
        headings: extractHeadings(source),
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

// Read the ids back off the rendered HTML rather than re-slugging the markdown,
// so the table of contents can never drift from what rehype-slug emitted.
function extractHeadings(html: string): Heading[] {
    const headings: Heading[] = [];
    const pattern = /<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/g;

    for (const match of html.matchAll(pattern)) {
        headings.push({
            id: match[1],
            text: match[2].replace(/<[^>]*>/g, "").trim(),
        });
    }

    return headings;
}

// The page renders the title from frontmatter, so drop the duplicate H1 that
// every content file opens with.
function stripLeadingHeading(content: string) {
    const trimmed = content.replace(/^\s+/, "");
    return trimmed.startsWith("# ")
        ? trimmed.slice(trimmed.indexOf("\n") + 1)
        : trimmed;
}

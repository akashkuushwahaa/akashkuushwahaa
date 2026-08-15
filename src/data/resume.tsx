import { Icons } from "@/components/icons";
import { FolderIcon, HomeIcon } from "lucide-react";

export const DATA = {
    name: "Akash Kushwaha",
    initials: "AK",
    url: "https://akashkuushwahaa.vercel.app",
    location: "Ahmedabad, India",
    locationLink: "https://www.google.com/maps/place/ahmedabad",
    description: "Full-stack engineer • LLM tooling in TypeScript and Python",
    summary:
        "I build full-stack web applications and LLM-powered tools, mostly in TypeScript and Python.\n\nThe work I care about sits where a product meets a model. It is easy to get a language model to produce something that looks correct. Getting it to produce something correct enough to put in front of a user, repeatedly, is a different problem, and it turns out to be an engineering problem more than a prompting one: retrieval, evaluation, guardrails, and knowing when to keep a human in the loop.\n\nThat is what the [Code Review Agent](/projects/code-review-agent) taught me. It started at 0.82 F1 on a labeled set and reached 0.914. Nothing about the prompt changed; the retrieval did. I only knew that because I had built the labeled set first.\n\nBefore that I spent three months as an SDE intern at [CultureX](https://www.culturex.ai), shipping full-stack dashboard features on a weekly release cycle — the Next.js API routes behind them and the React interfaces on top. I am finishing a B.Tech in Computer Science & Engineering (AI & ML) at SAL Institute of Technology, expected 2027, and I am currently open to work.",
    avatarUrl: "",
    resumeUrl: "/resume",
    resumeFile: "/resume.pdf",
    skills: {
        Languages: ["TypeScript", "Python", "JavaScript", "Java", "SQL"],
        "LLM Engineering": [
            "OpenAI API",
            "RAG",
            "Chroma",
            "Stagehand",
            "Evaluation sets",
            "Guardrails",
        ],
        Frontend: [
            "React",
            "Next.js",
            "Tailwind CSS",
            "Zustand",
            "Zod",
            "Core Web Vitals",
        ],
        Backend: [
            "Node.js",
            "Express",
            "Next.js API Routes",
            "Server Actions",
            "FastAPI",
            "REST APIs",
            "JWT",
        ],
        Data: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Chroma"],
        Tooling: [
            "Git",
            "GitHub Actions",
            "Docker",
            "AWS",
            "Linux",
            "Streamlit",
            "Arcjet",
            "Claude Code",
        ],
    } as Record<string, string[]>,
    navbar: [
        { href: "/", icon: HomeIcon, label: "Home" },
        { href: "/projects", icon: FolderIcon, label: "Projects" },
    ],
    contact: {
        email: "akashkuushwahaa@gmail.com",
        social: {
            GitHub: {
                name: "GitHub",
                url: "https://github.com/akashkuushwahaa",
                icon: Icons.github,
                navbar: true,
            },
            LinkedIn: {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/akashkuushwahaa/",
                icon: Icons.linkedin,
                navbar: true,
            },
            email: {
                name: "Send Email",
                url: "mailto:akashkuushwahaa@gmail.com",
                icon: Icons.email,
                navbar: true,
            },
        },
    },

    work: [
        {
            company: "CultureX Entertainment Private Limited",
            href: "https://www.culturex.ai",
            badges: [],
            location: "Ahmedabad, India",
            title: "Software Development Engineer Intern",
            logoUrl: "/culturex.png",
            start: "Sep 2025",
            end: "Nov 2025",
            caseStudy: "/work/culturex",
            description:
                "Full-stack work on a production dashboard, shipping on a weekly release cycle in an Agile team. I owned features end to end: the server-side data flow and the interface that consumed it.",
            bullets: [
                "Built the Shopify Coupons Listing module end to end, from the Next.js API routes to reusable React and Tailwind components, factoring the repeated table, filter, and empty-state patterns into shared pieces — cutting development time for new features by 30%.",
                "Implemented Link Tracker across the stack, writing the server-side data flows with Next.js API routes and Server Actions plus the dashboard UI that consumed them, so engagement data appeared in real time alongside the rest of the metrics.",
                "Moved global state into Zustand and enforced type safety with Zod schemas at the API boundary, reducing runtime UI errors by 25%.",
                "Restructured components and added analytics instrumentation to locate slow render paths, improving Core Web Vitals.",
                "Shipped weekly with pull request reviews in both directions — the review culture was the fastest feedback loop I have had on how I structure components.",
            ],
        },
    ] as Array<{
        company: string;
        href: string;
        badges?: string[];
        location?: string;
        title: string;
        logoUrl: string;
        start: string;
        end?: string | null;
        caseStudy?: string;
        description?: string;
        bullets?: string[];
    }>,
    education: [
        {
            school: "SAL Institute of Technology and Engineering Research",
            href: "https://sal.edu.in/",
            degree: "B.Tech in Computer Science & Engineering (AI & ML)",
            logoUrl: "",
            start: "2023",
            end: "2027 (expected)",
        },
    ],
    projects: [
        {
            slug: "code-review-agent",
            title: "Code Review Agent",
            href: "/projects/code-review-agent",
            dates: "Solo build",
            featured: true,
            description:
                "A pull-request reviewer scoped to security. It reads every diff, flags hardcoded secrets and SQL or command injection, and posts line-anchored comments through GitHub Actions.",
            metric: {
                label: "F1 on labeled set",
                from: "0.82",
                to: "0.914",
            },
            technologies: [
                "Python",
                "OpenAI",
                "Chroma (RAG)",
                "FastAPI",
                "Next.js",
                "SQLite",
                "Docker",
                "GitHub Actions",
            ],
            links: [
                {
                    type: "Case study",
                    href: "/projects/code-review-agent",
                    icon: <Icons.globe className="size-3" />,
                },
                {
                    type: "Source",
                    href: "https://github.com/akashkuushwahaa/code-review-agent",
                    icon: <Icons.github className="size-3" />,
                },
            ],
        },
        {
            slug: "job-pilot",
            title: "Job Pilot",
            href: "/projects/job-pilot",
            dates: "Solo build",
            featured: true,
            description:
                "An agentic job-search platform. It sources live postings, researches each company with a headless browser, scores the match against your parsed resume, and generates a role-specific resume PDF.",
            metric: null,
            technologies: [
                "Next.js",
                "TypeScript",
                "OpenAI",
                "Stagehand",
                "Browserbase",
                "Adzuna API",
                "PostgreSQL",
                "Zod",
            ],
            links: [
                {
                    type: "Live",
                    href: "https://jobpilot-sigma-rose.vercel.app/",
                    icon: <Icons.globe className="size-3" />,
                },
                {
                    type: "Source",
                    href: "https://github.com/akashkuushwahaa/job-pilot",
                    icon: <Icons.github className="size-3" />,
                },
            ],
        },
        {
            slug: "subscription-tracker",
            title: "Enterprise Subscription Management API",
            href: "/projects/subscription-tracker",
            dates: "Solo build",
            featured: true,
            description:
                "A REST API covering the full subscription lifecycle: JWT auth, role-scoped routes, edge rate limiting and bot detection, and renewal reminders that run on a schedule rather than on request traffic.",
            metric: null,
            technologies: ["Node.js", "Express.js", "MongoDB", "Arcjet"],
            links: [
                {
                    type: "Case study",
                    href: "/projects/subscription-tracker",
                    icon: <Icons.globe className="size-3" />,
                },
                {
                    type: "Source",
                    href: "https://github.com/akashkuushwahaa/subscription-tracker",
                    icon: <Icons.github className="size-3" />,
                },
            ],
        },
        {
            slug: "job-application-assistant",
            title: "Job Application Assistant",
            href: "/projects/job-application-assistant",
            dates: "Solo build",
            featured: false,
            description:
                "A four-stage LLM pipeline that matches a resume to a job post, names the gaps, drafts the cover letter, and rewrites the resume — with every claim bound to facts in the parsed resume.",
            metric: {
                label: "Time per tailored application",
                from: "~25 min",
                to: "under 1 min",
            },
            technologies: ["Python", "OpenAI API", "Streamlit", "pdfplumber"],
            links: [
                {
                    type: "Case study",
                    href: "/projects/job-application-assistant",
                    icon: <Icons.globe className="size-3" />,
                },
                {
                    type: "Source",
                    href: "https://github.com/akashkuushwahaa/job-application-assistant",
                    icon: <Icons.github className="size-3" />,
                },
            ],
        },
    ] as Array<{
        slug: string;
        title: string;
        href: string;
        dates: string;
        featured: boolean;
        description: string;
        metric: { label: string; from: string; to: string } | null;
        technologies: string[];
        links: { type: string; href: string; icon: React.ReactNode }[];
    }>,
};

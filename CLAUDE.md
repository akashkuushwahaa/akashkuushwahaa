# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What this repo is

Two things in one place:

1. **`README.md`** — the GitHub profile README. The `codetime` workflow in
   `.github/workflows/` rewrites the block between the
   `<!--START_SECTION:codetime-->` markers. Do not hand-edit inside those
   markers.
2. **The portfolio site** — a Next.js app in `src/`, with all written content in
   `content/`.

## Commands

- **Dev**: `npm run dev` (Next.js with Turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- No test suite configured.

## Architecture

**Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 3,
shadcn/ui, MagicUI, Framer Motion.

**Two content sources, and they do different jobs.**

- `src/data/resume.tsx` — the `DATA` object. Everything the home page renders
  short-form: name, summary, skills, work, education, project cards, contact,
  dock links. Edit this to change the home page.
- `content/` — the long-form markdown. `content/projects/*.md` and
  `content/work/*.md` are full write-ups with frontmatter, loaded by
  `src/data/content.ts` (gray-matter for frontmatter, unified/remark/rehype to
  HTML, shiki for highlighting). Each file becomes a page.

A project therefore appears twice: as a card (from `DATA.projects`) and as a
case study (from `content/projects/<slug>.md`). Keep the `slug` in `DATA`
matching the markdown filename, or the card links nowhere.

**Routes**

| Route | Source |
|---|---|
| `/` | `src/data/resume.tsx` |
| `/projects` | `content/projects/*.md` frontmatter |
| `/projects/[slug]` | `content/projects/<slug>.md` |
| `/work/[slug]` | `content/work/<slug>.md` |
| `/resume` | embeds `public/resume.pdf`, compiled from `resume/main.tex` |

All are statically generated at build time.

**Markdown conventions.** Every content file opens with an H1 that repeats its
frontmatter `title`; the loader strips that leading H1 so the page does not
render it twice. Architecture diagrams are indented code blocks of box-drawing
characters — `globals.css` tightens `pre > code` line-height so the `│` runs
connect. Do not restore the global line-number counters that shipped with the
upstream template; they number those diagrams.

**Animations.** `BlurFade` and `BlurFadeText` (`src/components/magicui/`)
sequence section reveals off a `BLUR_FADE_DELAY = 0.04` constant. Both honor
`prefers-reduced-motion` by collapsing the transition to zero duration. Do not
swap the element type on reduced motion — that changes the tree between server
and client render and blanks the page.

**Theming.** Class-based dark mode via `next-themes`, defaulting to dark. Colors
are HSL CSS variables in `src/app/globals.css`. See `DESIGN.md`.

## Code style

- **Imports**: `@/*` path alias.
- **Formatting**: double quotes, 4-space indent, semicolons, ES5 trailing
  commas (`.prettierrc`).
- **TypeScript**: strict; explicit types on props and interfaces.
- **Naming**: PascalCase components, camelCase functions, SCREAMING_SNAKE_CASE
  constants.
- **Components**: `"use client"` only where hooks or browser APIs are used.
- **Styling**: Tailwind classes plus `cn()` from `@/lib/utils`.
- No comments unless the reason for the code is genuinely non-obvious.

## shadcn/ui and MagicUI

- shadcn components in `src/components/ui/` (style "new-york", base "neutral").
- MagicUI components in `src/components/magicui/`.
- Add new shadcn components with `npx shadcn@latest add <component>`.

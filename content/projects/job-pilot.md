---
title: Job Pilot
slug: job-pilot
summary: An agentic job-search platform that sources postings, researches companies, scores fit, and generates a tailored resume.
tags: [Next.js, TypeScript, OpenAI, Stagehand, PostgreSQL, Zod]
repo: https://github.com/akashkuushwahaa/job-pilot
live: https://jobpilot-sigma-rose.vercel.app/
featured: true
role: Solo build
order: 2
---

# Job Pilot

A job-search platform built as an agent pipeline. It pulls live postings,
researches each company with a headless browser, scores the match against your
parsed resume, and generates a role-specific resume PDF for the ones worth
applying to.

## The problem

Job boards optimize for volume. You get a hundred postings, no signal about
which company is actually hiring versus perpetually reposting, and the only way
to apply well is to rewrite your resume for each one, which nobody does. So
everyone sends the same generic PDF into the same void.

The search itself is the easy half. What makes the problem worth automating is
that the two expensive steps, finding out what a company is really like and
tailoring the application, are both things an agent can do.

## How it works

    Adzuna API ──► sourcing
                      │
                      ▼
              Stagehand agent ──► company research (headless browser)
                      │
                      ▼
    resume.pdf ──► profile extraction ──► matching and scoring
                                                │
                                                ▼
                                    tailored resume PDF out

Four stages, each independently inspectable. Postgres holds postings, profiles,
and scores.

## Decisions that mattered

**A browser agent for research, not an API.** Company signal lives on careers
pages, engineering blogs, and job posts written in prose, none of which have an
endpoint. Stagehand drives a real headless browser, so the research stage reads
what a candidate would read. It is slower, and it is the reason the output is
worth anything.

**Structured extraction at every boundary.** LLM output crossing into the
database is validated with Zod schemas first. A model that returns a
plausible-looking object with one field renamed will corrupt a table quietly.
Parsing at the boundary turns that into a loud failure at the point it happened.

**Resume in, resume out.** The uploaded PDF is parsed into structured profile
data, which serves double duty: it is what the matcher scores against, and it is
the source the generator rewrites from. Because generation is constrained to
extracted facts, the tailored resume cannot invent experience.

**A dedupe index in the schema, not in application code.** The same posting is
syndicated across boards constantly. A unique index in a versioned migration
makes duplicates impossible at the storage layer, rather than filtering them on
read, which would have been the easier and wronger choice.

## Results

Live at jobpilot-sigma-rose.vercel.app. End to end, an uploaded resume produces
scored, researched, deduplicated matches with a tailored PDF per role, which is
the full loop a person would otherwise run by hand for every application.

## What I would change

The pipeline is synchronous, so a slow research stage blocks the run. It should
be a job queue with per-stage retries and partial results, so a posting whose
company research times out still surfaces with a match score. I would also
expose the scoring rubric in the UI. Right now the model explains its reasoning,
but the weights behind the number are not visible to the user.

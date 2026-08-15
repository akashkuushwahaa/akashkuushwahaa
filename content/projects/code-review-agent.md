---
title: Code Review Agent
slug: code-review-agent
summary: A security-scoped PR reviewer that runs in GitHub Actions and posts line-anchored findings.
tags: [Python, OpenAI, Chroma (RAG), FastAPI, Next.js, SQLite, Docker, GitHub Actions]
repo: https://github.com/akashkuushwahaa/code-review-agent
featured: true
role: Solo build
order: 1
---

# Code Review Agent

A pull-request reviewer scoped to security. It reads every diff pushed to a
repository, flags hardcoded secrets and SQL or command injection, and posts its
findings as line-anchored comments on the PR through GitHub Actions.

## The problem

Generic "AI code review" bots have a credibility problem: they comment on
everything, most of it is style noise, and within two weeks the team mutes them.
That failure is usually about scope rather than model quality. A reviewer that
flags forty things per PR gets ignored regardless of whether three of them were
real.

So I narrowed the job to one question, whether the diff introduces a security
hole, and then made precision measurable instead of assumed.

## How it works

    PR opened
       │
       ▼
    GitHub Actions ──► diff extraction
                            │
                            ▼
                    Chroma retrieval ──► cross-file context
                            │
                            ▼
                       LLM analysis
                            │
                            ▼
       SQLite ◄──── dedupe ────► line-anchored PR comments
       (findings)
                            │
                            ▼
              FastAPI ──► Next.js dashboard

## Decisions that mattered

**Build the eval before tuning anything.** I hand-labeled a 20-case set of
vulnerable and clean diffs, then scored precision and recall against it. Small,
but it converted "this feels better" into a number, which is the only reason
the next decision was possible to make honestly.

**A/B the retrieval, not the prompt.** The obvious lever was prompt wording. The
one that worked was context. A diff alone doesn't tell you whether a string
reaching a query is user controlled, because that lives in another file. Indexing the
repository into a Chroma vector store and retrieving related definitions
alongside the diff took **F1 from 0.82 to 0.914** on the same labeled set.

**Persist findings and dedupe across runs.** Every push re-triggers the
pipeline, and a reviewer that repeats yesterday's comment on today's push is a
reviewer people turn off. Findings go to SQLite keyed for cross-run
deduplication, so a given issue is reported once.

**Containerize the whole thing.** Agent, FastAPI service, and Next.js dashboard
come up together under Docker Compose. `docker compose up` is the entire setup
path.

## Results

| | Before | After |
|---|---|---|
| F1 on labeled set | 0.82 | **0.914** |
| Repeat findings across pushes | every run | deduplicated |
| Setup | manual, 3 services | one Compose command |

## What I'd change

Twenty cases is enough to detect a real improvement and not enough to trust a
small one. The next version needs a set an order of magnitude larger, ideally
mined from public CVE-fixing commits rather than written by hand. I'd also add
per-rule breakdowns, since aggregate F1 hides which vulnerability class the
retrieval upgrade actually helped.

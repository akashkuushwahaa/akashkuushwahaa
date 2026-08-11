---
title: Job Application Assistant
slug: job-application-assistant
summary: A four-stage LLM pipeline that matches a resume to a job post and drafts the application, cutting 25 minutes to under one.
tags: [Python, OpenAI API, Streamlit, pdfplumber]
repo: https://github.com/akashkuushwahaa/job-application-assistant
role: Solo build
order: 4
---

# Job Application Assistant

An agent that reads your resume and a job post, tells you how well they match,
drafts the cover letter, and rewrites the resume for the role. Per-application
effort drops from about 25 minutes to under a minute.

## The problem

Tailoring an application is high-value, low-interest work. Everyone knows a
targeted resume outperforms a generic one, and almost nobody does it past the
third application, because the marginal effort is large and the feedback loop is
weeks long.

The obvious risk in automating it is worse than wasted time. A model that writes
a nice cover letter will happily claim you know Kubernetes.

## How it works

    resume.pdf ──► pdfplumber ──► structured text
                                       │
                                       ▼
    job post ──────────────────► 1. match analysis
                                       │
                                       ▼
                                 2. gap identification
                                       │
                                       ▼
                                 3. cover letter draft
                                       │
                                       ▼
                                 4. resume rewrite
                                       │
                                       ▼
                                 human review ──► send

## Decisions that mattered

**Four stages instead of one prompt.** A single call asked to analyze, compare,
and write produces confident mush. Splitting it gives each stage one job and
makes its output inspectable. When the cover letter is wrong, you can see
whether the match analysis was wrong first.

**Guardrails that bind output to the resume.** Generated text is constrained to
facts present in the parsed resume, so the assistant can reframe and
re-emphasize what is there but cannot add what is not. Without that constraint
the tool would be actively harmful, because the person who gets caught out by an
invented claim in an interview is the applicant.

**A human-in-the-loop step that cannot be skipped.** Nothing sends. The pipeline
ends at a review screen, because the person applying is the one accountable for
what the application claims.

**Streamlit for the interface.** The value is in the pipeline, not the UI. A
framework that got a working interface up in an afternoon meant the time went
into prompt design and guardrails instead.

## Results

| | Before | After |
|---|---|---|
| Time per tailored application | ~25 min | **under 1 min** |
| Claims not grounded in the resume | possible | blocked by guardrails |

## What I would change

There is no evaluation set. I know the output reads well. I do not have a number
for how often the match score is right, and after building a labeled eval for
the Code Review Agent I would not build a scoring feature without one again.
That is the first thing I would add.

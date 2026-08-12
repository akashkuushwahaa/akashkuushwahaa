---
title: Software Development Engineer Intern
slug: culturex
company: CultureX Entertainment Private Limited
period: Sep 2025 — Nov 2025
summary: Shipped full-stack dashboard features on a weekly release cycle — the Next.js API routes behind them and the React interfaces on top.
tags: [Next.js, React.js, Server Actions, Tailwind CSS, Zustand, Zod, REST APIs]
order: 1
---

# CultureX: SDE Intern

**Sep 2025 to Nov 2025.** Full-stack work on a production dashboard, shipping on
a weekly release cycle in an Agile team. I owned features end to end: the
server-side data flow and the interface that consumed it.

## What I worked on

**Shopify Coupons Listing module, end to end.** Next.js API routes on the server,
React and Tailwind on the client. What made it worth doing twice over was
noticing that the same table, filter, and empty-state patterns were being
rewritten for every surface. Factoring them into reusable components **cut
development time for new features by 30%**, measured against subsequent feature
work.

**Link Tracker, across the stack.** I wrote the server-side data flows with
Next.js API routes and Server Actions, then the dashboard UI that consumed them,
so engagement data showed up in real time next to the rest of the metrics rather
than in a separate tool. Owning both halves changed the work: the response shape
became a decision instead of a constraint. When the view needed a different
aggregate, I moved the aggregation to the server rather than assembling it in a
component.

**Global state with Zustand and Zod.** State was spread across component trees
and prop chains, and the failures it caused were the annoying kind: undefined
reaching a render, a shape changing under a consumer. Moving global state into
Zustand and validating responses with Zod schemas at the boundary **reduced
runtime UI errors by 25%**. Zod is what did most of that work. A malformed
response now fails loudly at the fetch instead of quietly three components later.

**Core Web Vitals.** Restructured components and added analytics instrumentation
to find slow render paths, which is the step people skip. You cannot fix a
render you have not located.

## How the team worked

Weekly releases, pull request reviews in both directions, Agile ceremonies. The
review culture was the most useful part of the internship. Having someone ask
why a component was structured a particular way, every week, is a faster
feedback loop than any amount of solo building.

## What I took from it

Production has constraints that side projects do not. Other people read your
code, releases are dated, and a regression costs someone their afternoon. It
changed how I write components, mostly in the direction of writing more obvious
ones.

Working both sides of a feature also changed where I put logic. When you only
own the client, you compensate for whatever the endpoint gives you. When you own
both, the question becomes which layer the work belongs in, and the answer is
usually the server.

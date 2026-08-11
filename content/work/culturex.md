---
title: Software Development Engineer Intern
slug: culturex
company: CultureX Entertainment Private Limited
period: Sep 2025 — Nov 2025
summary: Shipped React features and REST integrations into a production dashboard on a weekly release cycle.
tags: [React.js, Tailwind CSS, Zustand, Zod, REST APIs]
order: 1
---

# CultureX: SDE Intern

**Sep 2025 to Nov 2025.** Frontend work on a production dashboard, shipping on a
weekly release cycle in an Agile team.

## What I worked on

**Shopify Coupons Listing module.** Built in React and Tailwind. What made it
worth doing twice over was noticing that the same table, filter, and
empty-state patterns were being rewritten for every surface. Factoring them into
reusable components **cut frontend development time for new features by 30%**,
measured against subsequent feature work.

**Link Tracker integration.** Wired link-tracking into the core dashboards,
consuming REST APIs so engagement data showed up in real time next to the rest
of the metrics rather than in a separate tool.

**Global state with Zustand and Zod.** State was spread across component trees
and prop chains, and the failures it caused were the annoying kind: undefined
reaching a render, a shape changing under a consumer. Moving global state into
Zustand and validating API responses with Zod schemas at the boundary
**reduced runtime UI errors by 25%**. Zod is what did most of that work. A
malformed response now fails loudly at the fetch instead of quietly three
components later.

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

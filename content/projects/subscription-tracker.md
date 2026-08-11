---
title: Enterprise Subscription Management API
slug: subscription-tracker
summary: A RESTful subscription service with JWT auth, role-based route protection, and automated renewal reminders.
tags: [Node.js, Express.js, MongoDB, Arcjet]
repo: https://github.com/akashkuushwahaa/subscription-tracker
featured: true
role: Solo build
order: 3
---

# Enterprise Subscription Management API

A REST API for managing subscriptions end to end: authentication, role-scoped
access, the full lifecycle of a subscription, and the scheduled work that has to
happen around renewals.

## The problem

Subscription billing is the part of a product where bugs cost money in both
directions. Charge late and you lose revenue. Charge someone who cancelled and
you lose the customer. It is also the part most likely to be attacked, because
the endpoints are public by necessity and the objects behind them are financial.

I wanted to build the boring version properly: correct authorization, real
lifecycle states, and the operational pieces that tutorials skip.

## How it works

    client ──► Arcjet (rate limit + bot detection)
                   │
                   ▼
              JWT middleware ──► role check
                   │
                   ▼
            subscription routes ──► MongoDB
                   ▲
                   │
            node-cron ──► renewal reminder emails

## Decisions that mattered

**Authorization as middleware, not as if-statements.** JWT verification and the
role check are route-level middleware, so protection is declared where the route
is declared. Scattering permission checks into handlers is how endpoints end up
unprotected: someone adds a route, forgets the check, and nothing tells them.

**Defend the public surface at the edge.** Auth endpoints are exposed by
definition, which makes them the credential-stuffing target. Arcjet handles rate
limiting and bot detection in front of the application, so abuse is rejected
before it reaches business logic or the database.

**Renewals are scheduled jobs, not request-time work.** A reminder that only
fires when someone happens to hit an endpoint will miss exactly the users who
stopped opening the app, which is most of the people you need to remind.
node-cron runs the renewal sweep on a schedule, independent of traffic.

**Model the lifecycle explicitly.** Active, cancelled, expired, and renewing are
distinct states with defined transitions rather than a pile of booleans, which
keeps "is this subscription billable right now" a single unambiguous question.

## Results

A subscription service handling the full lifecycle with authenticated,
role-scoped access, hardened public endpoints, and renewal notifications that
run whether or not anyone is using the app.

## What I would change

There is no idempotency key on the mutation endpoints. A retried renewal request
during a network blip could double-process, and in a billing system that is the
failure that actually matters. I would add idempotency keys and an append-only
subscription event log, so state is derived from history rather than overwritten
in place.

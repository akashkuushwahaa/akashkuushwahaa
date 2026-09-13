---
title: Code Review Agent
slug: code-review-agent
summary: An advisory pull-request reviewer built from narrow, measured lenses, with a verifier that must quote its evidence, one-click fixes, and a memory of what the team rejected.
tags: [Python, OpenAI, tree-sitter, FastAPI, Next.js, SQLite, Docker, GitHub App]
repo: https://github.com/akashkuushwahaa/code-review-agent
featured: true
role: Solo build
order: 1
---

# Code Review Agent

A pull-request reviewer that never blocks a merge and never commits code. It
reviews through *lenses*, one narrow concern each with its own prompt and its
own labeled eval set, checks every finding with a second opinion that has to
quote the evidence, and posts what survives as line-anchored comments with a
confidence tier, a summary of the whole PR, and a one-click fix where the fix
is mechanical. It runs as a CLI, a pre-push hook, a GitHub Action, or a GitHub
App with a webhook service and a dashboard.

The first version was security-only and lived in GitHub Actions. This page
describes the second.

## The problem

Generic "AI code review" bots have a credibility problem: they comment on
everything, most of it is style noise, and within two weeks the team mutes
them. Reading what developers actually say about these tools turned that hunch
into a list. Precision beats coverage. Stop repeating a suggestion the team
already rejected. A diff alone is not enough context. Rank by severity, cap
the volume, say how sure you are. Show status fast. Never replace the human
reviewer.

Every decision below traces back to one of those.

## How it works

```pipeline
trigger | A pull request opens, or `review.py --local` runs before one exists
listen | Reactions, replies and commands on the comments posted before | rejected findings join the repository's memory
fetch | The diffs, the full file at the head commit, `.review.yml`
context | The rest of the repository, chunked by function with `ast` and tree-sitter, embedded, the top three by cosine
lenses | security · correctness · dependencies · performance · infra | tests and maintainability opt in
merge | Findings from different lenses on the same or an adjacent line become one
policy | Ignore markers, suppressions, learned suppressions, severity order, the comment budget
verify | A second opinion quotes the added lines that prove each finding, or withdraws it
confidence | A tier from the lens's measured precision and the verdict; `min_confidence` holds the rest back
summary | One call over the whole PR: what changed, where to look first, description vs diff, breaking changes
post | Inline comments, suggestion blocks, a summary comment edited in place, the check-run
store | SQLite, read by FastAPI and the Next.js dashboard, with the cost on every row
```

Every step after the lenses is plain Python in one orchestrator file.

## Decisions that mattered

**Lenses, not one big prompt.** A general-purpose prompt cannot be measured
per concern, so its precision quietly collapses. Each lens has its own prompt,
categories and labeled set, and ships on by default only after it scores 0.80
precision or better over three runs. Seven were built and five are on by
default. The tests lens measured 0.76 and ships off, with its numbers
published. The maintainability lens passed at 0.91 and ships off by design,
as suggestions for the author rather than issues for the reviewer.

**Cases before prompts.** Every set was labeled before its prompt was written,
a second reader checked the labels from the diffs alone, and each lens got at
most three prompt iterations. Nothing in a prompt names a fixture. That rule
is what makes a precision number mean something.

**Change what the model sees.** The first version proved it: same cases, same
prompt, security precision went from 0.74 with the diff alone to 0.80 with the
full file and 0.84 with related code retrieved from the rest of the repository
(F1 0.82 to 0.914). The second version rebuilt that retrieval. Files are
chunked by function, class or method, with `ast` for Python and tree-sitter
for JavaScript, TypeScript, Go and Java, embedded with whichever provider is
answering, and searched in an in-process numpy store. Dropping chromadb took
the dependency footprint from 155 MB to 38.5 MB.

**A second opinion that must quote the evidence.** Every finding about to be
posted goes to a verifier that sees what the lens saw and has to quote,
verbatim, the added lines that prove the claim, or withdraw it. On the
security set that took precision from 0.87 to 1.00 at recall 0.99, and the one
false positive that had survived three phases of context work, an argument
list handed to `subprocess` flagged as command injection, is withdrawn every
run. It costs about twice as much per pass, and it fails open: an outage means
an unverified finding, never a silent review.

**Publish confidence, cap the volume.** Every finding carries a tier derived
from its lens's measured precision and the verifier's verdict, shown in the
comment, the check-run, the terminal and SARIF. Findings post high to medium
to low, stop at `max_comments`, and carry a fingerprint built from the flagged
code rather than its line number, so a finding survives a rebase and is never
posted twice.

**Listen.** A thumbs-down on a comment suppresses that finding for the
repository. Three similar rejections suppress look-alikes, found by embedding
similarity. Three, not one: a single thumbs-down on a true finding must not
silence a category. Replies addressed to the bot are commands, `explain`,
`ignore` and `re-review`, honoured only from users with write access.

**Propose, never commit.** When a fix is mechanical (a literal read from the
environment, bound parameters, an argument list instead of a shell string) the
lens attaches a replacement. It reaches the comment as a GitHub suggestion
block only after the verifier approves it, confidence is high, and every
replaced line is one the diff added. On ten mechanical cases, 100% of the
proposed replacements parsed and passed the case's test, with a replacement
proposed on 59% of findings.

**Plain Python over a graph.** A LangGraph version of the pipeline was built
and compared. One branch, no loops, and the graph hid the data flow, so it was
not adopted. It lives on an experiment branch, and it did catch one merge bug.

## Results

| | Measured |
|---|---|
| Security lens alone (gpt-4o, 3 runs) | precision 0.87, recall 1.00 |
| Security lens + verifier (production) | precision **1.00**, recall 0.99 |
| Context arms: diff → full file → retrieval | precision 0.74 → 0.80 → 0.84 |
| Correctness · dependencies · performance · infra | precision 0.83 · 1.00 · 0.94 · 0.85 |
| PR summary on ten labeled PRs | mismatch precision 1.00, breaking changes 1.00 / 1.00 |
| Suggested fixes on ten mechanical cases | 100% parse and pass, proposed on 59% |
| Retrieval dependencies | 155 MB → 38.5 MB |
| Test suite | 537 tests, no network, no keys |

Lens numbers were measured on `gpt-4o`; the PR summary and fix numbers on
NVIDIA's Nemotron, after the OpenAI credit ran out. The eval log says which is
which and never compares across.

## What I'd change

The tests lens is the honest failure. It reliably catches a test that cannot
fail (1.00) and misses "a behaviour change with no test change" (0.33), and
the fix is more cases, not a fourth prompt iteration. The Anthropic adapter is
unit-tested and unmeasured. Reactions arrive by a sweep every minute rather
than a webhook, and a finding nobody touched before merge is never marked as
ignored, because the PR-closed event is not handled yet. Local mode has no
repository identity, so it neither collects feedback nor applies memory. And
the dashboard has no authentication, which is fine for one operator on a
private port and wrong for anything else.

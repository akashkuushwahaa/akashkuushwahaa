# Design system

The visual system is Vercel's Geist: achromatic, typographically compressed,
shadow-bordered. It is inherited from the template this site is built on (see
[Attribution](#attribution)). This file records the system as implemented here
and the two places the implementation departs from it.

## Atmosphere

Near-black `#0a0a0a` canvas, `#fafafa` text, nothing decorative. Depth comes
from layered shadows rather than fills, and separation comes from spacing rather
than color. The palette has no accent hue at all except the badge blue, which is
functional: it marks a technology tag, never a mood.

The site defaults to dark and offers a toggle in the dock. Both themes are
defined as HSL variables on `:root` and `.dark` in `src/app/globals.css`.

## Typography

| Role | Face | Size | Weight | Tracking |
|---|---|---|---|---|
| Hero | Geist Sans | 48–60px | 600 | `tracking-display` (-2.4px) |
| Section heading | Geist Sans | 24–48px | 600 | `tracking-heading` (-2.4px) |
| Card title | Geist Sans | 16px | 500 | `tracking-ui` (-0.32px) |
| Body | Geist Sans | 14px | 400 | normal |
| Technical label | Geist Mono | 10–11px | 400 | uppercase |

Three weights, strict roles: 400 reads, 500 interacts, 600 announces. Tracking
is always negative or zero on Geist Sans, and relaxes as size drops. Hierarchy
comes from size and tracking, not from weight.

**Geist Mono is the site's second voice.** It carries anything that is a
measurement or a coordinate: the status line under the name, skill category
labels, project roles, section eyebrows, the metric ledger. If a piece of text
is a fact rather than a sentence, it is set in mono, uppercase, at 10–11px. This
is the one rule to keep consistent — it is what ties the home page to the case
studies.

## The metric ledger

The signature element. Two of the four projects have a real before/after number
that was measured rather than asserted, and those numbers are the most
interesting thing on the page:

```
F1 ON LABELED SET
0.82  →  0.914
```

`src/components/metric.tsx` renders it: a mono uppercase label, then the old
value in muted, an arrow, and the new value in foreground. It sits above a
hairline rule at the bottom of a project card.

It appears **only where a number was actually measured**. A ledger on every card
would make it decoration; on two cards it makes a claim. Projects without an
eval do not get one, and that absence is honest — the Job Application Assistant
write-up says so in its own words.

## Components

**Cards.** No CSS border. A multi-layer shadow does the work:
`shadow-card` (border ring + 2px lift + 8px ambient + inner `#fafafa` ring), and
`shadow-card-hover` intensifies each layer on hover. Radius 8px. Project cards
carry a full-card overlay link (`after:absolute after:inset-0`) so the whole
card is the target, with the footer badge links raised above it on `z-10`.

**Badges.** Pill radius, 12px or smaller. `default` is the inverted
foreground/background pair, used for skills and actions. `secondary` is the
badge blue (`#ebf5ff` on `#0068d6`), used for technology tags.

**Dock.** Fixed bottom navigation with a masked backdrop blur, holding home,
projects, socials, and the theme toggle.

**Prose.** Case studies render through `@tailwindcss/typography`. Two overrides
in `globals.css`: inline code drops the plugin's literal backticks and takes a
bordered tint instead, and block code runs at 1.35 line-height.

## Layout

- 8px base unit; the scale jumps 16px → 32px with nothing between.
- Single column, `max-w-2xl`, centered, `px-6` with `py-12 sm:py-24`.
- Project grid: 1 column, 2 at `sm`.
- Vertical rhythm between home sections: `space-y-10`, with 48px inside the
  full-bleed Projects and Contact blocks.

## Deviations from the template

Two, both driven by the content:

1. **Line numbers are off for block code.** The upstream template numbered every
   line of every code block. Every case study here opens with an ASCII pipeline
   diagram rather than source, and numbering the rows of a diagram is noise.
   Line numbers remain available per-block via `data-line-numbers`.
2. **Shiki's dark theme is class-scoped, not media-scoped.** The template keyed
   its syntax colors to `prefers-color-scheme`, which meant code blocks ignored
   the site's own theme toggle. They now key to `.dark`.

## Quality floor

Responsive to 360px. Visible keyboard focus on interactive elements. A skip link
ahead of the content. `prefers-reduced-motion` collapses every entrance
animation to zero duration rather than removing the animated element.

## Attribution

The scaffold, the Vercel/Geist design direction, and the MagicUI components come
from [surajkuushwaha/surajkuushwaha](https://github.com/surajkuushwaha/surajkuushwaha)
(MIT), itself derived from Dillion Verma's portfolio template. See `NOTICE`.

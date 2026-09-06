# Design system

Two 12-step ramps, one semantic alias map, and a fine neutral grain layer over an
even achromatic canvas. The structure is modelled on
[mariajoaoabrantes.work](https://www.mariajoaoabrantes.work/); the typeface and
the metric ledger are inherited from the template this site is built on (see
[Attribution](#attribution)).

## Tokens

`src/app/globals.css` defines the whole system in three blocks.

**The ramps.** `--n-1` through `--n-12` (neutral) and `--y-1` through `--y-12`
(yellow), declared once for light on `:root` and once for dark on `.dark`. Step
roles follow Radix and are identical in both themes:

| Steps | Role |
|---|---|
| 1–2 | Page backgrounds |
| 3–5 | Component fills, hover, active |
| 6–8 | Borders, then focus ring |
| 9–10 | Solid fills |
| 11–12 | Low-contrast then high-contrast text |

The neutral ramp is perfectly achromatic — R=G=B at every step. Dark runs 8% to
87% lightness, light runs 99% to 12%.

**The alias map.** Because step 11 means "readable body text" in both themes,
the semantic layer is written **once**, in a third `:root` block, and never
duplicated per theme:

```css
--background: var(--n-1);
--foreground: var(--n-12);
--muted-foreground: var(--n-11);
--border: var(--n-6);
```

This is the one rule that keeps the file honest. If you find yourself declaring
the same semantic token twice with different values, the ramps are wrong, not
the alias.

**Motion and shape.** `--duration-fast|base|medium|slow`, `--ease-out-expo`
(`cubic-bezier(0.16, 1, 0.3, 1)`, the workhorse), `--ease-in-out-strong`,
`--ease-spring`. Radius base is 12px, with 20/28/40px available as
`rounded-xl|2xl|3xl`.

## The accents

Two hues, each a full 12-step ramp: yellow at ~51° and violet at ~258°. They
are split by role, and the split matters.

- **`text-brand` / `text-violet`** → step 11. The only step safe for text. Step 9
  fails AA on a light background (1.8:1), so never set body text in it.
- **`bg-brand-solid` / `bg-violet-solid`** → step 9. Fills and markers.
- **`bg-brand-subtle` + `text-brand-foreground`** → steps 3 and 12. A tinted
  ground with its own ink.
- **`bg-brand-pop` + `text-brand-pop-ink`** — the one pair that does **not** flip
  with the theme. A solid fill needs a pale ground with dark ink in both light
  and dark, which a flipping alias cannot express. Used for button fills, the
  work-card cursor and the severity chip.

The eyebrow pairs them: role in violet, focus in yellow. Elsewhere an accent
marks a claim — the outcome line, the principle numerals, the active nav link,
the active table-of-contents item, the "after" half of a metric.

**Accents are never decorative.** Technology tags were briefly set as solid
yellow pills; on a page with four cards that turned the accent into wallpaper
and the rule into a lie. They are now `TagList`: mono, uppercase, muted,
em-dash separated.

## Atmosphere

`GrainCanvas` is fixed at `inset-0`, behind a `relative z-10` content wrapper.
The canvas uses the flat `--background` color: charcoal in dark mode and an
off-white in light mode, without a radial tint or glow.

`.grain` adds desaturated `feTurbulence` noise in a repeating 180px tile, at
1.5% opacity in light mode and 1.8% in dark mode. The fixed tile size keeps
the texture fine and consistent across viewport sizes. It is composited
normally, remaining barely visible over the neutral base.

## Typography

Geist Sans and Geist Mono, with a fluid display scale:

| Class | Size | Leading | Tracking |
|---|---|---|---|
| `text-display-lg` | clamp(56px, 3.536vw + 42.74px, 88px) | 0.9 | -0.05em |
| `text-display` | clamp(40px, 2.21vw + 31.71px, 60px) | 1 | -0.04em |
| `text-display-sm` | clamp(28px, 1.326vw + 23.03px, 40px) | 1.1 | -0.03em |

Three weights, strict roles: 400 reads, 500 interacts, 600 announces. Tracking
is always negative on Geist Sans and relaxes as size drops.

**Geist Mono is the site's second voice.** It carries anything that is a
measurement or a coordinate: section eyebrows, the status line, card dates, the
principle numerals, the metric ledger. If a piece of text is a fact rather than
a sentence, it is set in mono, uppercase, 10–11px, at `tracking-label`
(`0.14em`). This is what ties the home page to the case studies.

## The metric ledger

The signature element. Two of the four projects have a real before/after number
that was measured rather than asserted:

```
F1 ON LABELED SET
0.82  →  0.914
```

`src/components/metric.tsx` renders it: a mono uppercase label, the old value in
muted, an arrow, the new value in foreground, above a hairline rule.

It appears **only where a number was actually measured**. A ledger on every card
would make it decoration; on two cards it makes a claim.

## Components

**Work cards.** Image-led, after the reference site: a full-width visual, then
technology tags and a combined title and outcome caption. A full-card overlay
link makes the whole thing the target. On a fine pointer, the dash and outcome
fade in while the visual shows the mouse-tracking "View case study" pill.
Keyboard focus also reveals the outcome; touch and coarse pointers always show
it. The caption reserves its space to avoid layout shifts, and reduced motion
removes the fade. Mouse movement is handled on the article and mapped back into
the visual's box.

**Project visuals.** `project-visual.tsx` renders a per-project mock of what the
tool actually emits — a flagged diff and review comment, a match score, an API
response, a pipeline. An image-led layout needs images; these carry information
instead of decorating. Where a real recording exists, `project-media.tsx` puts
it behind a click on the case study only, with the mock as the poster and
`preload="none"`, so the home page never pulls a video it may not need.

**Buttons.** `smart-button.tsx`. The fill slides up from under the label instead
of cross-fading, so the button reads as one object moving. Three tones; the
arrow nudges right on hover and holds still under reduced motion.

**Principles stack.** Every item pins at the same offset, so the next one rides
up and covers the one before it while the outgoing item fades as its successor
closes on the pin line. That cross-fade in place is what makes the numeral read
as counting up rather than as four separate cards. Under reduced motion the
sticky positioning is dropped entirely (`.principle-item` in `globals.css`),
because without the fade the mechanism reads as content vanishing. Titles and
body text brighten character by character as they cross the reading area;
reduced motion keeps every character fully visible.

**Skill pile.** `src/components/skill-physics.tsx` runs a real matter-js
simulation on the About page: capsules drop in on a stagger, collide, settle,
and can be grabbed and thrown. The labels stay ordinary DOM elements and are
only transformed to follow their body each frame, so they keep the site's fonts
and colours and the list underneath stays real text for a screen reader. Matter
binds wheel and touch handlers that swallow page scrolling; those are unbound
after construction, so dragging is pointer-only and the page still scrolls.
The engine is imported on demand and only runs while the pile is on screen.

**Page transition.** A solid black panel rises from below in 400ms, holds while
the new route mounts, then continues above the viewport in 500ms. Web Animations
coordinates both phases. Internal clicks are captured before Next's Link
handler; modified clicks, new tabs, downloads, files, external origins, hashes,
and same-path links keep their native behavior. An eight-second guard releases
a stalled navigation. The curtain is portalled above the navigation.

**Loading screen.** The same blank black curtain runs on initial document load.
There is no name or separate fading overlay. It mounts only on the client and
is skipped for reduced motion, including preference changes during playback.

**Particle text.** One word of the headline is sampled into a canvas particle
field. The real text remains visible until the canvas is ready and is the
fallback for reduced motion or unavailable JavaScript. The canvas resizes with
its inline-block host, refreshes its ink on theme changes, and pauses offscreen.

**Reveals.** `animated-text.tsx` lifts words through individual clipping masks
with a capped stagger. Hero, About, project headings, profile
panels, contact, and footer description use it. `scroll-reveal.tsx` handles
larger groups. Both wait for the curtain's reveal event. Text is visible before
JavaScript initializes and remains static under reduced motion.

The About greeting waits until the curtain is completely offscreen, then reveals
its words at 90ms intervals so the entrance is visible rather than playing behind
the curtain.

**Marquee.** `src/components/marquee.tsx` renders the item list twice and
translates the track `0 → -50%`, so the loop is seamless. `.marquee-mask`
dissolves both edges. Hover pauses the motion; there is no separate pause
button. The second pass is `aria-hidden`. Reduced motion
shows one complete, wrapped list with no mask or animation.

**Badges.** Pill radius. `default` is the inverted foreground/background pair.
`secondary` is the yellow pair, used for technology tags.

**Nav.** `src/components/site-nav.tsx` is transparent at rest on desktop and
contracts into a 600px floating pill after scrolling. Links roll vertically on
hover. On mobile a fixed bottom bar opens upward using native `details`, with
all routes, contact, and theme controls. Escape, outside clicks, and navigation
close it. Native disclosure and links remain usable without JavaScript.

**Footer.** `src/components/site-footer.tsx` closes with a faint, single-line
name spanning the viewport. The SVG wordmark is decorative; the copyright
retains the accessible name. Description and email/social text pills align to
the page measure. The home contact area uses a two-line heading and a solid
light email button, with no supporting paragraph. Mobile reserves space for
the fixed bottom navigation.

**Home composition.** The hero uses a 48–88px medium-weight headline with a
wider measure, keeping the particle word. Project previews use tinted 16:10
stages on desktop, labeled as illustrative workflows. Technology tags sit above
a single caption combining the project title and a green outcome. Experience
details remain visible, and Education has its own labeled section. Horizontal
divider lines are omitted throughout the portfolio. About and resume links use
violet and yellow panels with dark ink.
On mobile, principles become a normal list so sticky text cannot overlap.

**Table of contents.** `src/components/table-of-contents.tsx`, sticky at
`top-28` on the case studies, `lg` and up only. It reads its ids back off the
rendered HTML (see `extractHeadings` in `src/data/content.ts`) rather than
re-slugging the markdown, so it cannot drift from what `rehype-slug` emitted.
Active state is whichever heading sits closest above a 140px reading line —
scroll position, not intersection, so the highlight matches what you are
actually reading.

**Prose.** Case studies render through `@tailwindcss/typography`, with its
palette bound to the site tokens. Two overrides in `globals.css`: inline code
drops the plugin's literal backticks for a bordered tint, and block code runs at
1.35 line-height.

## Layout

The container lives on the page, not on `<body>`. The root layout supplies only
`px-6 pb-24 pt-28` (the top padding clears the fixed nav) and each route picks
its own measure:

Every route now uses `max-w-content` (1120px), matching the reference site's
measure; the article column inside a case study stays capped at `max-w-2xl` so
the line length remains readable.

- Home sections are `pb-16` blocks, each opening with a mono eyebrow.
- Section order leads with proof: hero → selected work → how I work → about →
  stack → experience → education → contact.
- Project grid: 1 column, 2 at `sm`.
- Case studies are a two-column grid at `lg`: a 180px sticky table of contents
  on the **left**, then the article.
- Anchored headings carry `scroll-margin-top: 7rem` so a table-of-contents jump
  does not land underneath the fixed nav.

## Deviations from the template

1. **Line numbers are off for block code.** Every case study opens with an ASCII
   pipeline diagram rather than source, and numbering the rows of a diagram is
   noise. Line numbers remain available per-block via `data-line-numbers`.
2. **Shiki's dark theme is class-scoped, not media-scoped.** The template keyed
   syntax colors to `prefers-color-scheme`, so code blocks ignored the site's own
   toggle. They now key to `.dark`.

## Quality floor

Responsive to 360px. Visible keyboard focus on interactive elements. A skip link
ahead of the content. `prefers-reduced-motion` collapses every entrance
animation to zero duration, stops the marquee, drops the nav label animation and
disables smooth scrolling, rather than removing the animated element. Text set in `--y-11` or `--n-11` and above clears WCAG AA
against its own background in both themes.

## Attribution

The scaffold, the Geist typeface pairing, and the MagicUI components come from
[surajkuushwaha/surajkuushwaha](https://github.com/surajkuushwaha/surajkuushwaha)
(MIT), itself derived from Dillion Verma's portfolio template. The token
architecture — 12-step ramps, role-stable steps, a single alias map, and the
fixed grain canvas — follows the approach used on
[mariajoaoabrantes.work](https://www.mariajoaoabrantes.work/). See `NOTICE`.

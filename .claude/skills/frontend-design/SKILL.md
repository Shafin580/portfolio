---
name: frontend-design
description: Aesthetic direction for building distinctive, production-grade interfaces without generic "AI slop" design — composition, typography, motion, depth, and what to avoid. Use when building a new page, section, hero, or component where visual quality matters, or when asked to make something look better, more polished, or more distinctive.
---

# Frontend Design

Guidance for producing interfaces with a clear point of view, working within this
portfolio's existing design language rather than inventing a new one each time.

**Boundary:** `frontend` owns the mechanics (which primitive, which token utility, which
hook), `ui-ux-quality` owns the thresholds (4.5:1, 44px, 150–300ms), `ui-auditor` owns
compliance sweeps, and `seo` outranks everything here on anything that reaches metadata,
JSON-LD, or an OG card. This skill owns *taste* — the decisions none of those can make
for you.

## Context first

Ask before designing, and write the answer down: **who is this for, on what device, and
what do they need to believe by the time they leave?** Every rule below bends to that
answer. A design system with no audience behind it produces the same centred hero and
three feature cards every time.

For this site the answer is usually stable: a hiring manager or prospective client, often
on a phone, who needs to believe within one screen that the work is real. That is why the
evidence rule below is not decoration advice — it is the whole brief.

Two constraints that hold regardless:

- **Mobile-first, genuinely.** Not "it reflows at 375px" — the mobile view is the design, and the desktop view is the variation. Heavy motion and large images cost real users real access.
- **Evidence carries the page.** Specific numbers, real screenshots, named clients. Decoration supports the evidence; it does not replace it. If the decoration pushes the substance below the fold, the decoration is wrong. Everything quotable on this site traces back to `lib/portfolio-data.ts`, and nothing there is invented.

## Existing design language — work with it

The palette is committed in `app/globals.css` as `oklch()` tokens under `:root`, with a
full `.dark` counterpart selected by `@custom-variant dark (&:is(.dark *))` and driven by
`next-themes`. Two things about this system are load-bearing:

- **`--radius: 0.5rem`** is the project's corner language, and `--radius-sm/md/lg/xl` are all `calc()`ed from it. Change the token if the whole site should be rounder; never round one component by hand.
- **Tokens are raw `oklch()` values, not HSL triplets.** Consume them as `var(--border)` directly. Wrapping one in `hsl()` silently renders nothing — `.hero-grid` is the scar from learning that.

There is **no theme-preset system here** — light and dark are the only two axes. That
makes dark mode cheaper to get right and gives you no excuse for skipping it.

**Do not invent a new palette per component.** Extend a ramp, or add a semantic role to
both `:root` and `.dark` plus its `@theme inline` alias — the `frontend` skill has that
workflow.

**Dark mode is designed, not inherited.** Every surface, border, and shadow needs a dark
decision. A shadow that reads as depth on white reads as a smudge on near-black; depth in
dark mode comes from lighter surfaces (`--card` above `--background`), not darker shadows.

## Typography

One family: **Inter**, loaded through `next/font/google` in `app/layout.tsx` with
`display: "swap"`. Add a face there or not at all — a `@font-face` in CSS bypasses Next's
preloading and subsetting, and a second family on a one-page portfolio is almost always
the wrong answer.

- Use the type scale. Arbitrary `text-[13px]` values are how a scale dies.
- **Contrast in weight and size does more work than adding another typeface.** With a single family that is not a limitation, it is the whole toolkit — use it.
- Cap prose at 65–75 characters. See `ui-ux-quality`.

## Composition

- **Generous negative space beats density.** Whitespace is not wasted space; it is what makes the important thing look important.
- **Break the three-equal-columns reflex.** It is the single clearest tell of a layout nobody made a decision about.
- **Vary rhythm.** Full-bleed statement, then a tight grid, then a wide quote. A page where every section is the same height and shape reads as a list, not an argument — a real risk on a single-page portfolio, where every section is structurally a card grid unless someone intervenes.
- Asymmetry is available and underused. An offset block, an off-centre image, a column that breaks the grid — one per page is a signature; one per section is noise.
- Respect one max-width across sections. Mixing container widths reads as broken.

## Motion

**There is no `framer-motion` here.** Motion is CSS: `tw-animate-css` is imported at the
top of `app/globals.css`, the hand-written keyframes at the bottom of that file (hero
entrance, `float`, `pulse-slow`) drive the set pieces, and scroll reveals run through
`[data-animate]` + `.in-view`, toggled by an `IntersectionObserver` inside
`components/animated-section.tsx`.

Those keyframes are load-bearing — a codemod or a `shadcn add` that overwrites the bottom
of `globals.css` silently kills the page's entrance.

- **One well-orchestrated reveal beats scattered micro-interactions.** `AnimatedSection` with a `delay` is the orchestration primitive; use it rather than hand-rolling a timer.
- 150–300ms for UI transitions. Slower reads as sluggish.
- Animate `transform` and `opacity` only — never `width`/`height`/`top`.
- Hover states must not shift layout: colour, shadow, and border changes, not scale transforms on cards.
- **`prefers-reduced-motion` is already honoured** in a media block in `app/globals.css` — keep new animation inside that contract rather than adding motion that escapes it.

## Backgrounds and depth

Prefer layered tints from existing tokens over flat fills: `bg-muted` for a section wash,
`bg-card` for a raised surface, opacity modifiers (`bg-primary/5`) for a tint. These adapt
across both themes; a hand-mixed background does not.

Avoid: purple-gradient-on-white, generic blob shapes, stock abstract meshes, and the
glassmorphism panel that appears whenever nobody decided what the background should be.

The one sanctioned exception is `components/project-media.tsx`, whose gradient placeholder
stands in for a missing project screenshot. That is a deliberate fallback, not a licence to
gradient elsewhere.

## What to avoid

- **Emoji used as icons.** Use `lucide-react`, or the hand-drawn marks in `components/brand-icons.tsx` for GitHub/LinkedIn (lucide v1 dropped brand glyphs).
- **Cookie-cutter SaaS layout:** centred hero, three feature cards, alternating image-left/image-right all the way down, testimonial carousel, pricing table, CTA. Recognisable at a glance as a template nobody edited.
- **Adding a typeface to signal effort.**
- **Decorative imagery that pushes the substance below the fold.**
- **Arbitrary values** (`p-[13px]`, `bg-[#...]`) instead of scale and token values.
- **Rounding, shadowing, or gradient-ing a component to make it "pop"** when the real problem is hierarchy.
- **Inventing a fact to fill a layout.** If a stat row has four slots and only three verified numbers, the row has three slots.

## Before you call it done

- [ ] Every colour is a token — no hex, no `bg-[#...]`, no stock palette classes, no `oklch()` token wrapped in `hsl()`
- [ ] It works in **both themes**, checked with the theme toggle and not just assumed
- [ ] Contrast ≥ 4.5:1 for body text, checked in light and dark
- [ ] Responsive at 375 / 768 / 1024 / 1440; no horizontal scroll on mobile
- [ ] Touch targets ≥ 44×44px; visible focus states
- [ ] Hover states cause no layout shift
- [ ] New motion sits inside the existing `prefers-reduced-motion` block
- [ ] The keyframes at the bottom of `app/globals.css` are intact
- [ ] Images via `next/image` with meaningful `alt`
- [ ] Any content shown came from `lib/portfolio-data.ts`, not from a component literal
- [ ] Nothing on this page is here only because the template had one

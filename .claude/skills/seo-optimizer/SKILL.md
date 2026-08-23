---
name: seo-optimizer
description: On-page and technical SEO for this Next.js App Router portfolio — metadata objects, headings, URLs, images, structured data, Core Web Vitals targets, and internal linking, with a pre-publish checklist. Use when writing page metadata, optimizing content for search, adding structured data, or auditing on-page SEO.
---

# SEO Optimizer

On-page and technical SEO, written against this repo's actual primitives.

**Boundary — read this first.** The **`seo` skill (`.claude/skills/seo/SKILL.md`) is the
authority** on this site's JSON-LD graph shape, the metadata inheritance contract, and the
satori/OG-card constraints. Where this file and that one disagree, that one wins. This skill
adds the parts it does not state: the numeric Core Web Vitals bar, heading hierarchy, image
rules, and the pre-publish sweep. `frontend` owns component conventions, `ui-ux-quality`
owns the visual thresholds, and `geo-fundamentals` covers the same site from the
"get quoted by an answer engine" angle.

## 1. Metadata

**There is no `buildPageMetadata()` helper here.** Metadata is written as a plain `Metadata`
object: a static `export const metadata` in `app/layout.tsx`, and an async
`generateMetadata()` in `app/projects/[slug]/page.tsx` that derives everything from the
project's `caseStudy`. The canonical origin comes from `SITE_URL` in `lib/site.ts` — never
hardcode a domain, and use `absoluteUrl()` when a schema field needs a fully-qualified URL.

- **Titles** — under ~60 characters *including* the ` | Shafin Ahmed` template suffix set in the root layout. Primary term near the front. Unique per page.
- **Descriptions** — 150–160 characters. Written to earn a click, not to repeat the title.
- **Content comes from `lib/portfolio-data.ts`.** A title, description, or keyword list assembled from a component literal instead of the data file is how the page and its structured data drift apart.

**The sharp edge, restated from the `seo` skill because it costs the most when forgotten:**
a page-level `openGraph` object **replaces** the parent's rather than merging with it. Set
`locale`, `siteName`, and `type` again on any page that declares its own `openGraph`, or
they silently vanish from that page only.

There is no `robots` override helper and no staging gate. Every route is indexable. A page
that must be `noindex` sets it on its own metadata object.

## 2. Headings

Exactly one `<h1>` per page. No skipped levels. Headings carry meaning — users scan them and
AI engines use them as retrieval anchors.

```
h1  Oporajita — Case Study
  h2  The problem
  h2  What was built
    h3  Features
  h2  Outcomes
  h2  Frequently asked questions
```

Question-shaped `h2`/`h3` match conversational queries and win snippets. The case-study FAQ
accordion is already this shape — the same array builds the `FAQPage` node, so the visible
question and the structured one can never disagree.

## 3. URLs and routes

Short, lowercase, hyphenated, descriptive.

**There is no `LINKS` route registry here** — routes come from the filesystem, and the only
dynamic segment is `/projects/<slug>`, whose slugs are the `slug` fields in
`lib/portfolio-data.ts`. `dynamicParams = false`, so an unknown slug 404s rather than
rendering.

Adding a case study is **one** edit: give a project a non-null `caseStudy`. `app/sitemap.ts`,
`generateStaticParams`, the prev/next nav, the OG image route, and both `llms.txt` routes all
derive from `caseStudyProjects`. Nothing needs registering by hand — and nothing should be.

## 4. Images

```tsx
import Image from "next/image";

<Image
  src="/img/oporajita.png"
  alt="Oporajita dashboard showing the grievance intake queue"
  width={1200}
  height={630}
  loading="lazy"
/>;
```

- Always `next/image`, never a raw `<img>`. `next.config.ts` enables AVIF/WebP — the screenshots in `public/img` are multi-megabyte PNGs and serving them raw costs LCP.
- `alt` describes content and purpose. Decorative images get `alt=""`. A filename is not alt text.
- `priority` on the LCP image **only** — putting it everywhere defeats it.
- Explicit dimensions, or `fill` with a sized parent, to prevent layout shift.
- A project with `image: null` renders the gradient placeholder in `components/project-media.tsx` — that is the sanctioned fallback, not a missing asset to paper over with a stock photo.
- OG cards are generated, not stored: `lib/og-card.tsx` is the single `ImageResponse` renderer behind `app/opengraph-image.tsx`, `app/twitter-image.tsx`, and `app/projects/[slug]/opengraph-image.tsx`. **630px is a hard ceiling and satori does not reflow** — over-long copy is cut off with no error. See the `seo` skill for the clamp and chip-cap rules.

## 5. Structured data

Builders live in `lib/structured-data.ts`:

| Builder | Emits |
| --- | --- |
| `buildStructuredData()` | Homepage `@graph` — `Person`, `Organization`, `WebSite`, `ProfilePage`, `ItemList`, `FAQPage` |
| `buildProjectStructuredData()` | Per-case-study graph — `CreativeWork`, `WebPage`, `BreadcrumbList` |

Both render as a plain `<script type="application/ld+json">` from a **server** component.
**Do not move either to `next/script`** — it only injects after hydration and is invisible to
crawlers. Extend the builders rather than inlining a schema object in a page; the `@id`
anchors only stay consistent if every node comes from there.

Structured data must match what the page visibly renders. A `url` on a project is gated on
the liveness ping from `lib/link-status.ts` for exactly this reason — claiming a live site
that is down is a mismatch a crawler can catch.

Never fabricate values. Dates, client names, statistics, and `sameAs` targets in schema are
representations of fact. `lib/portfolio-data.ts` states the rule in its own header, and an
empty array is the correct output when there is nothing citable.

## 6. Core Web Vitals

| Metric | Target | Levers in this repo |
| --- | --- | --- |
| LCP | **< 2.5s** | `priority` on the hero image only; AVIF/WebP via `next.config.ts`; no `dynamic()` above the fold |
| CLS | **< 0.1** | sized images; reserve space for anything async so the layout does not jump |
| INP | **< 200ms** | keep client bundles small — most of this site is server-rendered, so a new `"use client"` boundary is the thing to justify |

`pnpm analyze` runs a bundle-analyzer build when you need to see where the client weight went.

## 7. Internal linking

Descriptive anchor text, never "click here" or "read more". The prev/next nav at the foot of
each case study and the homepage project grid are the internal link graph — both derive from
`caseStudyProjects`, so a new case study joins the graph automatically.

## 8. Freshness and dates

`caseStudy.updatedDate` drives `article:modified_time`, schema `dateModified`, **and** the
sitemap's `lastmod`. It is a real ISO date and **never `new Date()`** — a `lastmod` that
changes on every build is one crawlers learn to ignore. Update it when the case study's
content actually changes, not when the file is touched.

## 9. E-E-A-T

Credibility rests on specific, attributed, dated facts. Vague claims are worth nothing to
either ranking or AI citation. The `sources` and `entities` arrays on a case study exist to
make the claim traceable — every `url` in them was checked to resolve before it was written
down, because a `sameAs` pointing at a dead host is worse than no `sameAs` at all. If a
figure is not in the source material, ask; do not fill the gap.

## Pre-publish checklist

- [ ] Title < 60 chars including the template suffix; description 150–160
- [ ] Any page-level `openGraph` re-declares `locale`, `siteName`, and `type`
- [ ] `alternates.canonical` set, derived from `SITE_URL` / `absoluteUrl()`
- [ ] Single `<h1>`; no skipped heading levels
- [ ] All images via `next/image` with meaningful `alt`; `priority` on the LCP image only
- [ ] Structured data comes from `lib/structured-data.ts`, renders server-side, and matches the visible page
- [ ] Every new `sources` / `entities` URL resolves
- [ ] `updatedDate` is a real date, not `new Date()`
- [ ] OG card checked for overflow — satori will not warn you
- [ ] `npx tsc --noEmit`, `pnpm lint`, `pnpm build` clean

## Verification

```bash
npx tsc --noEmit && pnpm lint
pnpm build                       # proves sitemap.xml, robots.txt, and every OG route generate
pnpm start & curl -s localhost:8080/sitemap.xml
curl -s localhost:8080/llms.txt
```

`pnpm start` serves on port **8080**, not 3000. Rich Results Test and Search Console need a
deployed URL — hand those back as manual steps.

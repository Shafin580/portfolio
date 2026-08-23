---
name: geo-fundamentals
description: Generative Engine Optimization — getting content cited by AI answer engines (ChatGPT, Claude, Perplexity, Gemini). Use when optimizing for AI citation, writing or auditing llms.txt, structuring content for extraction, configuring AI crawler access, or checking AI-citation readiness.
allowed-tools: Read, Glob, Grep
---

# GEO Fundamentals

Optimization for AI-powered answer engines. Distinct from SEO: the goal is being **cited**,
not ranked.

**Boundary:** the **`seo` skill is the authority** on this repo's JSON-LD graph shape, the
metadata contract, and the OG-card constraints — where this file and that one disagree,
that one wins. `seo-optimizer` owns metadata mechanics, canonicals, Core Web Vitals, and the
crawl surface. This skill owns what makes content quotable once it has been crawled.

The primitives all three share, in **this** repo:

| Concern | File |
| --- | --- |
| JSON-LD builders | `lib/structured-data.ts` (`buildStructuredData`, `buildProjectStructuredData`) |
| Canonical origin | `lib/site.ts` (`SITE_URL`, `absoluteUrl`) |
| Crawler policy | `app/robots.ts` (`AI_CRAWLERS`) |
| Site-wide brief | `app/llms.txt/route.ts` |
| Per-case-study brief | `app/projects/[slug]/llms.txt/route.ts` |
| Content source of truth | `lib/portfolio-data.ts` |

## 1. SEO vs GEO

| Aspect | SEO | GEO |
| --- | --- | --- |
| Goal | Rank #1 | Get cited in the answer |
| Platform | Google, Bing | ChatGPT, Claude, Perplexity, Gemini |
| Metric | Position, CTR | Citation rate, share of voice |
| Focus | Keywords | Entities, extractable facts, data |

## 2. Engine landscape

| Engine | Citation style | Opportunity |
| --- | --- | --- |
| Perplexity | Numbered `[1][2]` | Highest citation rate |
| ChatGPT | Inline / footnotes | Search + browsing |
| Claude | Contextual | Long-form, well-structured content |
| Gemini | Sources section | Strong SEO crossover |

## 3. Retrieval factors

Approximate weight in how AI engines select what to cite:

| Factor | Weight |
| --- | --- |
| Semantic relevance | ~40% |
| Keyword match | ~20% |
| Authority signals | ~15% |
| Source diversity | ~15% |
| Freshness | ~10% |

## 4. What gets cited

| Element | Why it works |
| --- | --- |
| Original statistics | Unique and attributable — nothing else to cite |
| Clear definitions | Trivially extractable |
| Comparison tables | Structured, quotable |
| Step-by-step guides | Actionable, self-contained |
| FAQ sections | Question-shaped, matches query form |
| Expert quotes | Authority transfer |

**Find the assets this site actually holds** before optimizing anything: the numbers,
client names, delivery details, and outcomes that exist nowhere else. On this site those
live in `caseStudy.stats`, `caseStudy.takeaways`, and `caseStudy.sources` — a discrete
labelled number is quotable in a way the same figure buried mid-sentence is not. Make them
explicit, specific, and dated. A page with no unique fact on it cannot be made citable by
formatting.

**Nothing here is invented.** `lib/portfolio-data.ts` states that rule in its own header,
and it is the one GEO tactic on this list that is also a trust requirement.

## 5. Content checklist

- [ ] Question-shaped headings (`h2`/`h3`)
- [ ] Summary or TL;DR near the top
- [ ] Original data with a stated source
- [ ] Short paragraphs (2–4 sentences)
- [ ] Clear, standalone definitions
- [ ] FAQ block of 3–5 question/answer pairs
- [ ] "Last updated" date visible
- [ ] Named author or organisation attribution

## 6. Technical checklist

- [ ] `datePublished` **and** `dateModified` on every case study, from `caseStudy.publishedDate` / `caseStudy.updatedDate` — never `new Date()`
- [ ] A `FAQPage` node wherever question content renders, built from the same array the accordion renders
- [ ] `Person` + `Organization` establishing the entity — emitted by `buildStructuredData()` from the homepage
- [ ] Server-rendered HTML — AI crawlers do not reliably execute JS
- [ ] Fast load (< 2.5s LCP)
- [ ] Both `llms.txt` routes current — they are generated from `lib/portfolio-data.ts`, so this is automatic unless a route stops deriving

All schema comes from `lib/structured-data.ts` and renders as a plain
`<script type="application/ld+json">` inside a **server** component. Two ways it silently
stops being seen: moving it to `next/script` (which only injects after hydration) or
mounting it inside a `"use client"` tree. Neither errors — the markup just vanishes from
what a crawler receives.

## 7. AI crawler access

| Crawler | Engine |
| --- | --- |
| `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` | OpenAI / ChatGPT |
| `ClaudeBot`, `Claude-Web` | Claude |
| `PerplexityBot` | Perplexity |
| `Google-Extended` | Gemini training/grounding |
| `CCBot` | Common Crawl (feeds many models) |

`app/robots.ts` lists 19 of these explicitly in `AI_CRAWLERS` and allows each by name in
addition to the `*` wildcard. Naming them is not redundant — several honour only a rule
matching their own token. Blocking a crawler forfeits citations from that engine; treat it
as a deliberate trade, not a default.

There is **no `SHOULD_INDEX` gate in this repo** — every deploy is indexable. Add one before
publishing a preview host.

## 8. llms.txt

This site serves llms.txt from **two route handlers**, not a static file:
`app/llms.txt/route.ts` (site-wide brief) and `app/projects/[slug]/llms.txt/route.ts` (the
full case study as plain text, linked from the page via `alternates.types`). Both are
generated from `lib/portfolio-data.ts`, which is what keeps them from going stale — extend
the generator, never hand-write an entry. Between them they should carry:

- One-paragraph description of the organisation
- Key facts (location, focus, contact)
- Product or service list with specifics
- Annotated links to key pages
- A note on where structured data lives
- Attribution/citation request
- A "Last updated" date

Still an emerging convention with uneven adoption — cheap to maintain, so worth keeping
accurate rather than aspirational.

## 9. Auditing this repo

No script needed. Work through it with Grep/Read:

1. `grep -rn "buildStructuredData\|buildProjectStructuredData" app` — which routes emit a graph, and which do not?
2. `grep -rn "new Date()" lib/portfolio-data.ts app/sitemap.ts` — must return nothing. A `lastmod` or `dateModified` that moves every build is one crawlers learn to ignore.
3. `grep -rn "application/ld+json" app components` — every hit must sit in a server component, and none in `next/script`.
4. `grep -rn "use client" $(grep -rl "application/ld+json" app components)` — any schema stranded client-side?
5. Check the two `llms.txt` routes still derive from `lib/portfolio-data.ts` rather than carrying hand-written copy that can drift.
6. Check `AI_CRAWLERS` in `app/robots.ts` still lists the intended user-agents.
7. Confirm every `stats` / `sources` / `entities` entry in a `caseStudy` is traceable to something verifiable — an empty array is the correct output when there is nothing citable.
8. Scan page copy for paragraphs longer than ~4 sentences and headings that are not question-shaped.

## 10. Anti-patterns

| Don't | Do |
| --- | --- |
| Publish undated content | Add `datePublished`/`dateModified` |
| "Studies show…" | Name the source |
| Invent statistics to look authoritative | Use real data, or say nothing |
| Wall-of-text paragraphs | 2–4 sentences, then break |
| Client-render the key facts | Server-render them |
| Stuff keywords for density | Improve structure — extraction beats repetition |

Fabricating figures is a trust and compliance problem, not a growth tactic. If a fact is not
in the source material, ask — do not fill the gap.

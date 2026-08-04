---
name: seo
description: SEO, AEO (answer engines), GEO (generative engines), and OG-image conventions for this portfolio. Read BEFORE touching any `generateMetadata`, `lib/structured-data.ts`, JSON-LD, `app/sitemap.ts`, `app/robots.ts`, any `llms.txt` route, `lib/og-card.tsx`, or any `opengraph-image`/`twitter-image` file — and before adding a page, a project, or content that will be crawled. Covers the metadata contract, the schema.org graph shape, the citation and entity rules, and the satori constraints that silently truncate an OG card.
---

# SEO / AEO / GEO conventions

Three audiences read this site and they are not the same:

| | Who | What wins |
|---|---|---|
| **SEO** | classic crawlers ranking a page | correct, complete, non-duplicated metadata; markup that matches what a human sees |
| **AEO** | answer engines extracting a quotable answer | standalone sentences, Q&A pairs, scannable takeaways |
| **GEO** | generative engines deciding whether to cite you | cited sources, resolvable entities, discrete statistics |

Work that satisfies only the first is incomplete.

---

## Invariants — violating one is a defect, not a preference

1. **JSON-LD is a plain `<script type="application/ld+json">`.** Never `next/script`:
   it injects after hydration, and crawlers that do not run JS see nothing.
   `dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }}` on build-time data is the
   correct and only pattern here.
2. **Canonical origin comes from `lib/site.ts`** (`SITE_URL`, `absoluteUrl()`). Never
   hardcode a domain, never build one by string concatenation elsewhere.
3. **Content lives in `lib/portfolio-data.ts`.** Metadata, JSON-LD, `llms.txt`, the OG
   cards, and the rendered page all read from it. Anything typed directly into a component
   is a fact that will drift from its structured-data twin.
4. **Dead links never appear in schema or in `llms.txt`.** Everything outbound goes through
   `checkLinks()` in `lib/link-status.ts` first. Its failure classification is deliberate:
   only DNS failure, connection refused, and 4xx-5xx count as dead; timeouts **fail open**.
5. **`export const revalidate` must match `LINK_CHECK_REVALIDATE`.** Next requires a
   literal, so the two are kept in sync by hand — on the page *and* on every route handler
   that calls `checkLinks`.
6. **Markup must match the visible page.** A `BreadcrumbList` with no rendered trail, or a
   `FAQPage` whose questions differ from the accordion, is structured-data spam. Both are
   generated from the same array as the rendered element for exactly this reason.
7. **Never invent a fact to fill a field.** No estimated statistic, no plausible-sounding
   date, no `sameAs` URL that was not checked. An empty array renders nothing; a fabricated
   value is a lie with schema.org markup on it.

---

## Metadata contract

### The trap that matters most

**A child `openGraph` object REPLACES the parent's — it does not merge.** Set `openGraph`
in a page's `generateMetadata` and everything `app/layout.tsx` put there is gone for that
route, silently. `locale` is the one that goes missing most often. Restate everything the
page still needs.

The same applies to `twitter`. It does **not** apply to `robots`, `keywords`,
`formatDetection`, or `metadataBase`, which are inherited normally.

### Required on any new indexable page

```ts
export async function generateMetadata(...): Promise<Metadata> {
  return {
    title,                                   // template from layout appends "| Shafin Ahmed"
    description,                             // unique per page; never reuse the site default
    keywords: [...],                         // ~8-12, specific; stuffing is a quality signal
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
    publisher: profile.name,
    alternates: {
      canonical: path,                       // root-relative; metadataBase makes it absolute
      types: { "text/plain": `${path}/llms.txt` },   // when a plain-text twin exists
    },
    openGraph: {
      type, title, description, url: absoluteUrl(path), siteName,
      locale: "en_US",                       // restate — see the trap above
      // `type: "article"` obliges these:
      publishedTime, modifiedTime, authors, section, tags,
      // NO `images` — the file convention supplies it. Setting it here overrides
      // the generated card and loses the per-item alt.
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
```

### Sitemap

`lastModified` comes from the **content**, never `new Date()`. A `lastmod` that changes on
every build claims the whole site changed every time CI ran, and crawlers learn to ignore
it. Case studies report `caseStudy.updatedDate`; the root reports the newest of them.

### Robots

`app/robots.ts` allows every named AI crawler explicitly as well as by wildcard. Naming
them is not redundant — several only honour a rule matching their own token. Do not remove
a name to "clean up" the list, and add new ones as they appear.

---

## JSON-LD graph rules

`lib/structured-data.ts` exports two builders. Their node-by-node shape is documented in
[references/json-ld-graph.md](references/json-ld-graph.md) — read it before changing either.

- **One linked `@graph`, not a pile of blobs.** The `@id` cross-references are what let a
  crawler resolve "the person", "this page", and "this project" into one entity set.
- **`@id`s are stable and derived, never ad-hoc.** `PERSON_ID`, `WEBSITE_ID`, `projectId()`,
  `entityId()`. The same organisation appearing on two case studies must produce the same
  `@id` on both, or it is two entities as far as a crawler is concerned.
- **Prefer a node reference over a repeated inline object.** `sponsor: { "@id": ... }`
  beats `sponsor: { "@type": "Organization", name: "..." }` — the second is an anonymous
  node that resolves to nothing.
- **`@type` carries real information.** `project.schemaType` distinguishes an application
  from a marketing site; do not collapse everything back to `CreativeWork`.
- **Conditional spread, not null values.** `...(x ? { k: v } : {})`. A key with `undefined`
  serialises to nothing useful and clutters the graph.

---

## AEO rules

- **Answers must stand alone.** A takeaway or FAQ answer is quoted without its surrounding
  page, so it never opens with "It", "This project", or "The above". Name the subject.
- **One array feeds both surfaces.** `study.faqs` renders the accordion *and* builds the
  `FAQPage` node. Never hand-write a second copy in either place.
- **FAQ copy is drawn only from facts already on the page.** If an answer needs a fact that
  is not stated elsewhere in the same entry, either add that fact properly or drop the
  question.
- **Takeaways lead.** They render before the long prose, because the first substantive
  block is what gets extracted.
- **`speakable`** points at `[data-speakable]` attributes on the overview and takeaways.
  Adding the selector without adding the attribute produces a spec pointing at nothing.

---

## GEO rules

The lever here is credibility, not keyword coverage.

- **Cite sources.** Every case study carries `sources[]`, rendered as a visible References
  list and emitted as `citation`. Links are `rel="noopener noreferrer"` and deliberately
  **not** `nofollow` — they are genuine citations.
- **Resolve entities.** Organisations named on the page become `Organization` nodes with
  `sameAs` pointing at their official site, so "The Asia Foundation" resolves to the actual
  one. **Check the URL resolves before writing it down.** A `sameAs` pointing at a dead
  host is worse than no `sameAs`. (Note: a `403` from a WAF means the host is alive and
  refusing curl — that is fine. `000` means it does not resolve — that is not.)
- **Surface statistics discretely.** A number inside a paragraph is hard to lift cleanly;
  the same number as a labelled `Stat` is not. Only numbers already stated somewhere
  verifiable. **A project with nothing citable gets an empty array, not an invented figure**
  — Bullwip and Datafast have no public numbers, and that is the honest outcome.
- **Offer plain text.** `/llms.txt` indexes everything; `/projects/<slug>/llms.txt` carries
  a full case study. Both are generated from `lib/portfolio-data.ts`, so they cannot
  disagree with the HTML.

---

## OG image rules

`lib/og-card.tsx` is the **only** renderer. `app/opengraph-image.tsx` and
`app/projects/[slug]/opengraph-image.tsx` both call `renderOgCard()`; a third hand-rolled
`ImageResponse` is how the cards start looking different from each other.

Hard constraints, all learned the painful way:

- **630px is a ceiling and satori does not reflow.** An over-long body or a sixth chip
  pushes the pill row off the bottom of the card, silently, with no error. Hence the
  word-boundary clamp and the 5-chip cap in `renderOgCard`. Do not raise either without
  re-rendering the longest-content card and looking at it.
- **Plain `<img>` only.** `next/image` does not exist inside an `ImageResponse`. The
  `no-img-element` lint rule is disabled at that one line on purpose.
- **The font fetch must fail open.** `loadInter()` returns `null` on any error and the card
  falls back to the bundled font. Never let a Google Fonts hiccup fail the build.
- **`generateImageMetadata` for per-item `alt`.** A static `export const alt` puts the same
  string on every card in a dynamic route. The returned `id` must **not** be derived from
  `params` — the segment is unbound during page-data collection and the build fails with
  `id property is required`. Use a constant; `id` only has to be unique within the route.
- **Never set `openGraph.images` by hand** when a file-convention image exists — it
  overrides the generated card and throws away the alt.

---

## Verification

```bash
pnpm lint && pnpm build          # build log must list every expected prerendered route
./node_modules/.bin/next start -p <FREE_PORT>   # check the port is free first
```

Then:

- `curl -s $B/sitemap.xml` — every `<lastmod>` a real content date, **identical across two
  consecutive builds**.
- `curl -s $B/<path> | grep -oE '<meta property="og:[^>]*>'` — `og:locale` present,
  article fields present, per-page `og:image:alt`.
- Extract the JSON-LD and check: node types, `@id` cross-references resolve, `FAQPage`
  questions match the rendered accordion **verbatim**, `BreadcrumbList` matches the visible
  trail item-for-item.
- Paste the graph into the Schema.org validator and Google's Rich Results Test.
- Render the OG card for the **longest** title and client string; confirm nothing is cut.
- `curl -s $B/<path>/llms.txt` — `200`, `text/plain`, and no dead link advertised.

Run the `seo-reviewer` agent on the diff before calling any of this done.

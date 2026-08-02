# Portfolio: Tailwind v4 + shadcn upgrade, SEO/AEO/GEO, dynamic OG, live-link health checks

## Context

`shafinwebology.com` portfolio is a single-page Next.js 16 App Router site. Everything renders from `app/page.tsx` (843 lines) with data as inline consts. Four problems drove this work:

1. **Stack is a major version behind.** Tailwind 3.3.3 (latest 4.3.3), shadcn components predate the v4/React-19 rewrite, `tailwind-merge` 2.x cannot correctly merge v4 class names, and 30 of 47 `components/ui/*` files are unused dead weight dragging in `recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `react-day-picker` and ~15 orphaned Radix packages.
2. **SEO is configured but partly broken.** The JSON-LD `Person` schema is injected with `next/script strategy="afterInteractive"` — crawlers and LLM fetchers that do not execute JS never see it. `robots.ts` builds `${NEXT_PUBLIC_SITE_URL}/sitemap.xml` from a `.env` value that ends in `/`, producing a double-slashed sitemap URL. `metadataBase` and the OG image URL are hardcoded to `shafinwebology.com`, **which currently has no DNS A record and does not resolve** (verified: `dig +short shafinwebology.com` returns nothing; `curl` returns `Could not resolve host`).
3. **OG image is wrong.** `public/img/seo-image.png` is 1317×685 but declared 1280×720 in metadata, and neither is the 1200×630 standard. It is also hosted on the dead domain.
4. **Dead "Live" buttons.** Two project links no longer resolve — `betterbangladesh.io` and `merlinapp.co.uk` (both return no DNS record). The cards render a Live button that goes nowhere.

### Decisions taken (confirmed with user)

| Question | Decision |
|---|---|
| Canonical domain | `https://portfolio-shafin580s-projects.vercel.app` (verified 200 OK). Drop `shafinwebology.com` everywhere. |
| Dead project links | Ping at build, cache the result, hide the Live button when dead. |
| OG image | Dynamic `app/opengraph-image.tsx` via `ImageResponse` at 1200×630. |
| AEO/GEO scope | All four: expanded JSON-LD `@graph`, FAQ section + `FAQPage` schema, `llms.txt` + AI-crawler rules, semantic-HTML/heading audit. |
| AI crawlers | Allow all (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider, Applebot-Extended). |
| FAQ copy | Claude drafts from facts already on the page; user edits after. |

### Live-link ping results (measured this session)

| URL | Status |
|---|---|
| `https://calternatives.org` | 200 |
| `https://www.aritsltd.com/` | 200 |
| `https://sheraa.network/` | 200 |
| `https://weatherappshafindev.netlify.app/` | 200 |
| `https://keepershafindev.netlify.app/` | 200 |
| `https://shafin580.github.io/fenceJumper.github.io/` | 200 |
| `https://betterbangladesh.io/` | **DNS failure** |
| `https://merlinapp.co.uk/` | **DNS failure** |
| `https://shafinwebology.com/` | **DNS failure** |

---

## Phase 0 — Foundation: extract data, single source of truth

Four features (page render, JSON-LD graph, `llms.txt`, OG image) all need the same data. Extract it once first; everything else builds on it.

**New `lib/site.ts`**

```ts
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-shafin580s-projects.vercel.app"
).replace(/\/+$/, "");            // strip trailing slash — fixes the //sitemap.xml bug
```

**New `lib/portfolio-data.ts`** — move `experience` (L37), `projects` (L73-184), `skills` (L186), `navLinks` (L204) out of [app/page.tsx](app/page.tsx) verbatim. Add a `profile` const (name, title, email, location, GitHub/LinkedIn URLs, resume path) and a `faqs` array. Export a `Project` type so the ping helper and the JSON-LD builder share it.

**Update `.env`** — `NEXT_PUBLIC_SITE_URL=https://portfolio-shafin580s-projects.vercel.app` (no trailing slash; `lib/site.ts` normalizes anyway, belt and braces).

Nothing else changes in this phase. Checkpoint: `pnpm build` still succeeds, page renders identically.

---

## Phase 1 — Tailwind CSS v3 → v4

Ordered so the app is never in a half-migrated state. `tailwind-merge` must move in the same step as `tailwindcss` — v2 does not know the v4 class names and `cn()` will silently mis-merge.

### 1.1 Dependencies

```bash
pnpm remove tailwindcss autoprefixer tailwindcss-animate
pnpm add -D tailwindcss@4 @tailwindcss/postcss@4 tw-animate-css
pnpm add tailwind-merge@3
```

`autoprefixer` is dropped — Tailwind v4 handles vendor prefixing internally via Lightning CSS. `tailwindcss-animate` is replaced by `tw-animate-css`, its v4-native successor (this is what current shadcn ships).

### 1.2 `postcss.config.js` → `postcss.config.mjs`

```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

Delete the old `.js` file — leaving both causes PostCSS to pick one nondeterministically.

### 1.3 `tailwind.config.ts` → deleted, config moves into CSS

v4 has no JS config by default. Everything in [tailwind.config.ts](tailwind.config.ts) maps to CSS:

| v3 config | v4 equivalent |
|---|---|
| `content: [...]` | Automatic source detection — delete |
| `darkMode: ['class']` | `@custom-variant dark (&:is(.dark *));` |
| `theme.extend.colors` | `@theme inline { --color-*: var(--*) }` |
| `theme.extend.borderRadius` | `@theme inline { --radius-lg: ... }` |
| `theme.extend.backgroundImage` | plain CSS utilities or `@utility` |
| accordion keyframes/animation | provided by `tw-animate-css` |
| `plugins: [tailwindcss-animate]` | `@import "tw-animate-css";` |

Keep a stub `tailwind.config.ts` **only if** the shadcn CLI complains; current shadcn writes `"config": ""` in `components.json` for v4 projects.

### 1.4 Rewrite `app/globals.css`

Structure (top to bottom):

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root  { /* design tokens — see 1.5 */ }
.dark  { /* dark overrides */ }

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* … card, popover, primary, secondary, muted, accent, destructive,
       border, input, ring, chart-1..5 … */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { scroll-behavior: smooth; }
}

/* ── everything below is carried over verbatim ── */
```

**All ~80 lines of hand-written CSS must survive unchanged**: `.hero-grid`, the `hero-fade-up` / `hero-scale-in` / `hero-slide-up` keyframes, `.hero-animate-1..5`, `.hero-animate-photo`, `float` / `float-delayed` / `pulse-slow` keyframes and their `.animate-*` classes, the `prefers-reduced-motion` block, and the `[data-animate]` / `[data-delay]` scroll-reveal rules that [components/animated-section.tsx](components/animated-section.tsx) drives via `.in-view`. These are plain CSS — they need no `@layer` wrapper and no `@theme` entry. Do not let the codemod or the shadcn CLI overwrite them.

**Explicit trap:** [app/globals.css:76](app/globals.css#L76) is `background-image: radial-gradient(circle, hsl(var(--border)) 1px, ...)`. If tokens convert to `oklch()` (1.5), this becomes `hsl(oklch(...))` and silently renders nothing. It must become `var(--border)` directly.

### 1.5 Token format

Convert the HSL triplets to the shadcn v4 `oklch()` convention so future `shadcn add` output stays consistent with the existing tokens. Conversion must be **visually lossless** — convert each of the 25 light + 25 dark values individually, do not re-pick a palette. Verify a sample (`--primary: 221.2 83.2% 53.3%`, `--background`, `--muted-foreground`) renders identically before and after.

If conversion risk is judged too high mid-migration, the fallback is keeping HSL triplets and writing `--color-background: hsl(var(--background))` in `@theme inline` — functional, but diverges from upstream shadcn.

### 1.6 Renamed utilities

Codemod first (`npx @tailwindcss/upgrade`), then verify by hand — the codemod does not catch class names built through `cn()` conditionals. Grep counts across `app/` + `components/`:

| Change | Occurrences |
|---|---|
| `shadow` → `shadow-sm`, `shadow-sm` → `shadow-xs` | 29 + 2 |
| `rounded` → `rounded-sm`, `rounded-sm` → `rounded-xs` | 96 + 20 |
| `outline-none` → `outline-hidden` | 37 |
| `ring` → `ring-3` | 23 |
| `ring-offset-*` — behavior review | 18 |
| `blur-sm` → `blur-xs` | 1 |
| `space-x-*` / `space-y-*` — selector changed to `:not(:last-child)` | 24 |

Zero occurrences of `flex-shrink-0`, `flex-grow`, `bg-opacity-*`, `text-opacity-*`, `border-opacity-*`, `decoration-clone`, `overflow-ellipsis` — those renames are not needed here.

**Default border color changed** in v4 from `gray-200` to `currentColor`. The existing `* { @apply border-border }` masks this globally, so the risk is low — but any element using a bare `border` outside that reset will now inherit text colour.

Checkpoint: `pnpm build && pnpm lint`, then a visual diff of the page in light and dark mode. Highest-risk step in the whole plan.

---

## Phase 2 — shadcn/ui upgrade

### 2.1 Prune before upgrading

Only **17** of 47 `components/ui/*` files are imported anywhere: `avatar`, `badge`, `button`, `card`, `dialog`, `form`, `input`, `label`, `select`, `separator`, `sheet`, `sonner`, `tabs`, `textarea`, `toast`, `toggle`, `tooltip`.

Delete the other 30 and remove their now-orphaned dependencies: `recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `react-day-picker`, `date-fns`, `input-otp`, `react-resizable-panels`, plus every `@radix-ui/react-*` package no longer imported. Also drop `@next/swc-wasm-nodejs` (a stray 13.5.1 pin serving no purpose).

Re-adding a component later is one CLI command; carrying 30 unused files through a major migration is 30 files of avoidable breakage.

### 2.2 Re-add, do not hand-patch

```bash
pnpm dlx shadcn@latest init      # rewrites components.json for v4
pnpm dlx shadcn@latest add avatar badge button card dialog form input label \
  select separator sheet sonner tabs textarea toggle tooltip --overwrite
```

Current registry output is already Tailwind-v4 + React-19 native (`data-slot` attributes, `new-york` style, no `forwardRef`). Regenerating 16 files beats hand-migrating 47.

`components.json` changes: `"style": "default"` → `"new-york"` (default is retired), add `"iconLibrary": "lucide"`, set `"tailwind.config": ""`.

### 2.3 Known call-site breakage

- **`<a><Button>` nesting.** [app/page.tsx](app/page.tsx) wraps `<Button>` in `<a>` in at least six places — L253, L278, L369, L375, L665-669, L672-676. That renders `<a><button>`, which is invalid nesting and breaks keyboard/AT semantics. Fix with the shadcn idiom: `<Button asChild><a href="…">…</a></Button>`. This is required anyway once buttons change, and it is also a Phase 5 accessibility item.
- **Toast trio.** `hooks/use-toast.ts` + `components/ui/toast.tsx` + `components/ui/toaster.tsx` are deprecated upstream, and [app/layout.tsx:124](app/layout.tsx#L124) already renders sonner's `<Toaster>` instead. **Verified: `useToast` has zero importers outside its own file.** Delete all three plus `@radix-ui/react-toast`, and drop the `use-toast` line from `CLAUDE.md:32`.
- **Tooltip.** `app/page.tsx` wraps the whole tree in `<TooltipProvider>` ([L218](app/page.tsx#L218)-[L841](app/page.tsx#L841)) for a single `TooltipTrigger` at [L563](app/page.tsx#L563). Current shadcn's `Tooltip` self-provides — check whether the wrapper can be dropped entirely.
- **sonner v1 → v2.** `<Toaster richColors position="top-right" />` prop compatibility must be re-checked.
- **`buttonVariants`**, Sheet/Tabs sub-component APIs — diff regenerated files against call sites.

### 2.4 Radix consolidation

Optionally replace the 27 individual `@radix-ui/react-*` packages with the unified `radix-ui` (1.6.7) package. Lower risk to defer this to a follow-up — it touches every UI file's import line for no runtime gain.

Checkpoint: `pnpm build && pnpm lint`, manual pass over every interactive element (theme toggle, mobile Sheet nav, project Tabs, Tooltips, contact form submit + toast).

---

## Phase 3 — Peripheral dependency upgrades

Done **after** Tailwind and shadcn are green, one at a time, each with its own `pnpm build`.

| Package | From → To | Notes |
|---|---|---|
| `next` | 16.0.7 → 16.2.12 | Patch-level, low risk. Do first. |
| `next-themes` | 0.3.0 → 0.4.6 | Verify `ThemeProvider` props in [app/layout.tsx:122](app/layout.tsx#L122). |
| `lucide-react` | 0.446 → 1.28 | Major. Check all 14 icons imported in `app/page.tsx` still exist under the same names. |
| `zod` | 3.23 → 4.4 | Must move together with `@hookform/resolvers` (3.x → 5.x) — [components/contact-form.tsx](components/contact-form.tsx) uses `zodResolver`. Highest-risk item in this phase. |
| `react-hook-form` | 7.53 → 7.84 | Minor, ships with the zod step. |
| `typescript` | 5.2.2 → 7.0.2 | **Defer to last, treat as optional.** TS 7 is the Go-native rewrite; verify `eslint-config-next` and `next build` tolerate it before committing. Roll back to 5.9.x if anything smells. |

Housekeeping in the same phase: move `eslint`, `typescript`, `postcss`, `@types/*` from `dependencies` to `devDependencies`; either install and wire `@next/bundle-analyzer` in [next.config.ts](next.config.ts) or delete the broken `analyze` script.

---

## Phase 4 — Live-link health checks

### 4.1 `lib/link-status.ts`

Server-only helper. Design points that matter:

- **GET, not HEAD** — a large share of hosts answer HEAD with 405.
- **Classify failures rather than treating every error as dead.** Confirmed dead: `res.status >= 400`, or a DNS/connection-refused error (`ENOTFOUND`, `EAI_AGAIN`, `ECONNREFUSED`). Ambiguous: timeout, abort, TLS hiccup — **fail open** and keep showing the link. Without this split, one flaky build network silently strips the Live button off every card.
- `AbortController` with a ~5s timeout.
- Browser-like `User-Agent` — some hosts 403 unknown agents.
- `next: { revalidate: 86400 }` on the `fetch` so results cache for 24h instead of re-pinging on every request.
- `Promise.all` across all projects with a non-null `live`.

```ts
export type LinkState = "alive" | "dead";
export async function checkLinks(urls: string[]): Promise<Record<string, LinkState>>
```

### 4.2 Wire into the page

`app/page.tsx` is already a Server Component (no `"use client"`), so this needs no new client code:

```tsx
export const revalidate = 86400;

export default async function Home() {
  const liveStatus = await checkLinks(projects.map(p => p.live).filter(Boolean));
  …
}
```

Render condition at L664 becomes `{project.live && liveStatus[project.live] === "alive" && (…)}`.

**Constraint to flag:** `output: 'export'` is currently commented out in [next.config.ts](next.config.ts). Re-enabling static export would kill ISR and freeze link status at build time forever. Note it in `CLAUDE.md`.

Expected result on today's data: Live buttons disappear from **Better Bangladesh** and **Merlin**; both cards still render with their description, stack badges, and screenshot.

---

## Phase 5 — SEO

### 5.1 `app/layout.tsx` metadata

- `metadataBase: new URL(SITE_URL)` from `lib/site.ts` — removes the dead `shafinwebology.com`.
- `alternates: { canonical: "/" }` — currently missing entirely.
- `title` as `{ default, template: "%s | Shafin Ahmed" }`.
- `robots` as an object, not the string `"index, follow"`:
  `{ index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }`.
  `max-snippet: -1` and `max-image-preview: large` are what let answer engines quote at length and show the OG card — directly relevant to the AEO goal.
- Trim `keywords` from 35 to ~12. Google ignores the tag; the current list reads as stuffing to quality classifiers.
- Drop the hardcoded OG/Twitter image URLs — the file-based convention (5.2) wires them automatically and correctly.
- Add `export const viewport` with `themeColor` for light/dark (Next 15+ requires this split from `metadata`).

### 5.2 Dynamic OG image

New `app/opengraph-image.tsx`:

```tsx
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shafin Ahmed — Full-Stack Software Engineer";
export default async function Image() { /* ImageResponse */ }
```

Plus `app/twitter-image.tsx` re-exporting it. Composition: name, title, key stack, location, subtle gradient matching `--primary`. Fonts must be fetched as `ArrayBuffer` and passed to `ImageResponse` — `next/font` does not work inside `ImageResponse`. Delete the now-unused `public/img/seo-image.png` reference (keep the file).

### 5.3 `app/sitemap.ts` / `app/robots.ts`

- Both import `SITE_URL` from `lib/site.ts`. Fixes the `//sitemap.xml` double-slash.
- Sitemap: add `changeFrequency: "monthly"`, `priority: 1`.
- Robots: keep the `*` allow rule, add explicit allow entries for the AI crawlers (5.6).

### 5.4 Icons + manifest

No favicon exists. Add `app/icon.png` and `app/apple-icon.png` (derive from `public/img/logo.png`) and an `app/manifest.ts`.

### 5.5 Core Web Vitals (ranking signal, not cosmetic)

- `next.config.ts` sets `images: { unoptimized: true }`. `public/img/sheraa.png` is **2.1 MB**, `weatherAppSS.png` 522 KB, `keeperSS.png` 397 KB — served raw. Since `output: 'export'` is off and the host is Vercel, remove `unoptimized` and let Next serve AVIF/WebP.
- The project-grid `<Image fill>` at [app/page.tsx:628](app/page.tsx#L628) has no `sizes` prop (verified: zero `sizes=` occurrences in the repo) → oversized srcset selection. Add `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"`.
- **LCP element is not a `next/image`.** The hero photo at [app/page.tsx:395](app/page.tsx#L395) is a Radix `<AvatarImage>` — a plain `<img>` with no `priority` path. Either add `fetchPriority="high"` / `loading="eager"`, or swap the hero photo to `next/image` with `priority`. Only `public/img/logo.png` (L225) currently has `priority`, and it is not the LCP element.

---

## Phase 6 — AEO / GEO

### 6.1 JSON-LD `@graph` — and fix the delivery bug

**The existing schema does not reach crawlers.** [app/layout.tsx:126-131](app/layout.tsx#L126-L131) injects it via `<Script strategy="afterInteractive">`, so it only exists after client-side hydration. Crawlers and LLM fetchers that do not run JS see nothing. Replace with a plain server-rendered `<script type="application/ld+json" dangerouslySetInnerHTML={…} />` in the component tree — present in the initial HTML.

Replace the single `Person` with a linked `@graph`, built from `lib/portfolio-data.ts` so it can never drift from the visible page:

- `Person` (`@id: {SITE_URL}/#person`) — extend the current one with `knowsAbout` from the `skills` object, `hasOccupation`, `homeLocation`.
- `WebSite` (`#website`) — `publisher` → `#person`.
- `ProfilePage` (`#webpage`) — `about` → `#person`, `isPartOf` → `#website`, `primaryImageOfPage` → OG image.
- `ItemList` of projects → each a `SoftwareApplication` or `CreativeWork` with `name`, `description`, `url` (**only when the link check says alive**), `keywords` from `stacks`.
- `Organization` for ARITS Limited; `CollegeOrUniversity` for AIUB (already present, move into the graph).
- `EducationalOccupationalCredential` for the certifications section.
- `FAQPage` (6.2).

### 6.2 FAQ section + `FAQPage` schema

Highest-leverage AEO item — this is the block answer engines quote. New `components/faq.tsx` rendering an accordion (re-add `accordion` from shadcn) from a `faqs` array in `lib/portfolio-data.ts`, placed before the contact section. Same array feeds the `FAQPage` node.

~6 questions drafted strictly from facts already on the page: what Shafin builds, years of experience, current role at ARITS, primary stack, location/remote availability, notable projects, how to get in touch. **No invented claims.** User edits copy afterwards.

### 6.3 `llms.txt` + AI crawler policy

New `app/llms.txt/route.ts` — a `GET` returning `text/plain`, generated from `lib/portfolio-data.ts` so it stays in sync: who Shafin is, current role, stack by category, project list with live URLs (alive ones only), education, contact, links to `/sitemap.xml`.

`app/robots.ts` gains explicit allow rules for `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`, `Claude-User`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Bytespider`, `Applebot-Extended`, `Amazonbot`, `meta-externalagent`. All allowed, per decision.

### 6.4 Semantic HTML / accessibility pass on `app/page.tsx`

- Single `<h1>` at L333 is correct; verify h2 → h3 order holds after the FAQ section lands.
- **Icon-only links have no accessible name** — GitHub (L243) and LinkedIn (L248) in the nav render a bare icon. Add `aria-label` or `sr-only` text.
- Wrap experience entries in `<article>` with `<time dateTime="…">` on the date ranges; same for education.
- Project image `alt` is just `project.title` — make it descriptive (`"{title} — {short descriptor} screenshot"`).
- `<address>` for the contact block; `<nav aria-label>` on both nav instances.
- Fix the `<a><Button>` nesting from 2.3 (accessibility motivation as much as markup validity).

---

## Files touched

**New:** `lib/site.ts`, `lib/portfolio-data.ts`, `lib/link-status.ts`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/manifest.ts`, `app/llms.txt/route.ts`, `app/icon.png`, `app/apple-icon.png`, `components/faq.tsx`, `postcss.config.mjs`

**Rewritten:** `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, `components.json`, `package.json`, `next.config.ts`, `.env`, 16 × `components/ui/*`

**Deleted:** `tailwind.config.ts`, `postcss.config.js`, 30 × unused `components/ui/*`, `hooks/use-toast.ts`, `components/ui/toast.tsx`, `components/ui/toaster.tsx`

---

## Verification

No test suite exists. Proof is build + lint + targeted manual checks.

**Per phase:** `pnpm build && pnpm lint` must be clean before starting the next phase. Commit at each green checkpoint so rollback is one `git revert`.

**After Phase 1-2 (visual regression — the real risk):**
- `pnpm dev`, walk every section in light **and** dark mode.
- Specifically confirm still working: hero entrance animations, the dot-grid background, floating shapes, the photo glow pulse, scroll-reveal on every `AnimatedSection`, and `prefers-reduced-motion`.
- Interactive: theme toggle, mobile Sheet nav, project Tabs (All/Professional/Personal counts), Tooltips, contact form submit + sonner toast.

**After Phase 4:**
- `pnpm build` — Better Bangladesh and Merlin render without a Live button; the other six keep theirs.
- Temporarily point one project at a known-404 URL and rebuild to confirm the dead path; revert.
- Kill network and rebuild to confirm the fail-open path does **not** strip every Live button.

**After Phase 5-6:**
- `curl localhost:8080/robots.txt`, `/sitemap.xml`, `/llms.txt` — check the sitemap URL has no double slash and the domain is the Vercel one.
- `curl -s localhost:8080/ | grep 'application/ld+json'` — schema must be in the **raw HTML**, proving the `afterInteractive` bug is fixed. Paste the payload into Google Rich Results Test and schema.org validator; `FAQPage` must be eligible.
- Open `localhost:8080/opengraph-image` directly — 1200×630, text not clipped.
- Run Lighthouse SEO + Accessibility on the production build; expect 100 SEO, and no "links do not have a discernible name" violations.
- Verify OG rendering with a card debugger once deployed.

---

## Risk table

| Step | Risk | Mitigation / rollback |
|---|---|---|
| Tailwind v4 token conversion to oklch | Palette shifts subtly; `hsl(var(--border))` in `.hero-grid` renders nothing | Convert values individually, side-by-side screenshot diff. Fallback: keep HSL triplets with `hsl()` wrappers in `@theme inline`. |
| Renamed utilities (`rounded`, `shadow`, `ring`, `outline-none`) | Codemod misses classes built via `cn()` conditionals | Grep each renamed token by hand after the codemod; 96 `rounded` and 37 `outline-none` sites need eyes. |
| Custom CSS overwritten | 80 lines of hero/scroll animation silently lost | Copy the block out before touching `globals.css`; diff after. |
| shadcn `--overwrite` | Regenerated components drop props `page.tsx` passes | Regenerate, then `pnpm build` — TS surfaces most of it; manually exercise every interactive element. |
| zod 3 → 4 | `zodResolver` signature change breaks the contact form | Upgrade `@hookform/resolvers` in the same commit; submit the form for real before moving on. |
| typescript 5 → 7 | Go-native rewrite; toolchain incompatibility | Last step, isolated commit. Revert to 5.9.x if `next build` or eslint complains. |
| Build-time link ping | Flaky build network hides every Live button | Fail-open on ambiguous errors; only DNS failure and 4xx/5xx count as dead. |
| `revalidate` + static export | Re-enabling `output: 'export'` freezes link status permanently | Documented in `CLAUDE.md`; `next.config.ts` keeps the line commented. |
| Vercel URL as canonical | `*.vercel.app` is a weak ranking signal | Everything reads from `lib/site.ts` + `NEXT_PUBLIC_SITE_URL` — swapping to a real domain later is a one-line change. |

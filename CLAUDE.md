# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev             # Start dev server (clears .next, 6 GB memory cap)
pnpm og              # Render social cards + touch icon into public/ (build runs this first)
pnpm build           # Production build (pnpm og, then clears .next)
pnpm start           # Serve production build on port 8080
pnpm lint            # ESLint
pnpm format          # Prettier (entire project)
pnpm analyze         # Bundle analysis build
npx tsc --noEmit     # Typecheck — there is no `pnpm typecheck` script
pnpm run clean-install  # Nuke node_modules + reinstall (use when deps are broken)

# Cloudflare Workers (see Deployment below)
pnpm build:cf        # pnpm og, then compile the Worker via OpenNext
pnpm preview         # Build and run the Worker locally
pnpm deploy          # Build and deploy
pnpm cf-typegen      # Regenerate cloudflare-env.d.ts from wrangler.jsonc
```

**No test suite is configured.** Verification for this repo is `npx tsc --noEmit` +
`pnpm lint` on changed files, plus `pnpm build` when a route or metadata changed.

## Architecture

### Single-page portfolio + case-study pages
[app/page.tsx](app/page.tsx) renders the homepage. It is an **async Server Component** — do not add `"use client"` to it.

**All content lives in [lib/portfolio-data.ts](lib/portfolio-data.ts)**, not in the page: `profile`, `experience`, `projects`, `skills`, `navLinks`, `education`, `certification`, `faqs`. Six consumers read from it (page render, case-study pages, JSON-LD graph, both `llms.txt` routes, the build-time social cards in `scripts/generate-og.tsx`, the sitemap), so editing content means editing that one file. Never re-inline data into a component.

### Project case studies — `/projects/<slug>`
[app/projects/[slug]/page.tsx](app/projects/[slug]/page.tsx) renders a long-form write-up per project: hero + client/timeline/role, screenshot, problem, approach, features, stack, outcomes, prev/next, CTA.

**A project gets a page purely by having a non-null `caseStudy`.** `caseStudyProjects` in `lib/portfolio-data.ts` is the single derived list; `generateStaticParams`, `app/sitemap.ts`, the prev/next nav, the `llms.txt` route beside it, and the social card its metadata points at all read from it. `dynamicParams = false`, so any other slug 404s to [app/projects/[slug]/not-found.tsx](app/projects/[slug]/not-found.tsx). Today: 7 projects have one (`humr`, `oporajita`, `shaathi`, `calternatives`, `arits`, `sheraa`, `tazcreates`); the 2 remaining professional cards and the 3 personal ones do not.

Chrome is shared with the homepage via [components/site-header.tsx](components/site-header.tsx) (takes `hrefPrefix="/"` off-homepage so `#about` anchors resolve) and [components/site-footer.tsx](components/site-footer.tsx). The card/hero image — including the gradient placeholder used when `image` is null — is [components/project-media.tsx](components/project-media.tsx), shared so the two can never drift.

### Live-link health checks
[lib/link-status.ts](lib/link-status.ts) pings every project's `live` URL at build time; the Live button and the schema.org `url` only render when the ping succeeds. Failure handling is deliberate — only DNS failure / connection refused / 4xx-5xx count as dead; timeouts **fail open** so a flaky build network cannot strip every Live button. Results cache for 24h via `next: { revalidate }` plus `export const revalidate = 86400` on the page (the two must be kept in sync by hand — Next requires a literal there).

### Contact pipeline
The one public write path on the site. [components/contact-form.tsx](components/contact-form.tsx)
posts to [app/api/contact/route.ts](app/api/contact/route.ts); both parse the same schema in
[lib/contact-schema.ts](lib/contact-schema.ts).

The route runs five gates before any email leaves, cheapest rejection first, and **the
order is load-bearing** — do not reorder, skip, or make any of them conditional:

1. **config present** — missing keys answer `503 not_configured`, which is the signal the form uses to fall back to a pre-filled `mailto:` instead of looking broken
2. **shape** — the body is re-parsed with `contactSchema`; client-side validation counts for nothing on a public endpoint
3. **honeypot** — a filled hidden `website` field returns `{ ok: true }` with **200**, so a bot learns nothing. `company` is a real, visible, optional field and is **not** the honeypot
4. **rate limit** — 3 per IP per 10 minutes, in-memory. Per-isolate on Workers, so it is a speed bump; Turnstile is the real gate
5. **Turnstile** — verified server-side against Cloudflare, **failing closed** if verification is unreachable

Only then does it send. **`to` always comes from `CONTACT_TO_EMAIL`, never from the
payload** — that is what stops this being an open relay; the visitor's address goes in
`reply_to`. The visitor's own confirmation is the one send whose recipient does come from
the payload, which is why it goes last and inside its own `try`/`catch`: a failure there is
logged and swallowed rather than turned into a 502 that makes someone submit twice.

Delivery is a plain `fetch` to Resend's REST API — **not** the `resend` SDK, and the
templates in [emails/](emails/) are HTML template strings, **not** React Email. Those two
packages measured 1,791,420 bytes gzipped inside the Worker, more than half the entire free
plan script budget, for two POSTs. The tradeoff is that nothing escapes for you: **every
interpolated request value goes through `esc()`** from [emails/shared.ts](emails/shared.ts).

### Analytics (GA4)
Hand-rolled, **zero dependencies** — no `@next/third-parties`, no gtag wrapper. Same rule
that killed the `resend` SDK: an SDK is not free, and the loader here is `next/script`,
which ships with Next. [lib/analytics.ts](lib/analytics.ts) is the one module every call
site imports; nothing in it throws, and every entry point is truthiness-gated on
`NEXT_PUBLIC_GA_MEASUREMENT_ID` the way `contact-form.tsx` gates on the Turnstile site key.
**Empty ID disables the whole feature** — no loader, no banner, no events.

Four things here are load-bearing:

- **`next/script` is correct for this, and the ban in *SEO / AEO / GEO* below does not
  apply.** That ban exists because JSON-LD must be in the HTML crawlers receive. Analytics
  is the opposite case: it must *not* run before hydration, which is what
  `strategy="afterInteractive"` gives.
- **Consent Mode v2 defaults are inlined in `<head>`** in [app/layout.tsx](app/layout.tsx),
  after the `.js` classlist script, not via `next/script`. `dataLayer` is an ordered queue,
  so commands pushed before gtag.js arrives are replayed when it loads — that is what lets
  the loader stay `afterInteractive` while the consent defaults still land first. The
  region-scoped default (EEA + UK + CH) is IP-resolved by Google and is **what actually
  enforces denial**; [components/consent-banner.tsx](components/consent-banner.tsx) only
  offers the opt-in, which is why its time-zone region guess is allowed to be approximate —
  wrong in either direction fails safe.
- **Never call `useSearchParams()` in anything the root layout renders.** Without a
  `<Suspense>` boundary it bails every route out of static prerendering, and the four ISR
  routes are the entire reason `open-next.config.ts` provisions an R2 incremental cache.
  [components/page-view-tracker.tsx](components/page-view-tracker.tsx) uses `usePathname()`
  alone and fires `page_view` itself, because the bootstrap sets `send_page_view: false`.
- The resume event is **`resume_download`, not `file_download`** — GA4 enhanced measurement
  already fires `file_download` automatically for `.pdf`, so reusing the name double-counts.

[components/tracked-link.tsx](components/tracked-link.tsx) is the one tracked anchor. It
spreads every prop and passes `ref` through, so it drops into ShadCN `<Button asChild>`
(Radix `Slot`); it never calls `preventDefault`, so a blocked beacon costs a data point and
never the visitor's click. **No personal data may be sent** — the contact-form
`generate_lead` reports `project_type` only, never name, email, company, or message body.

There is **no CSP anywhere in this repo**. If one is ever added it must allow
`https://www.googletagmanager.com`.

Google **Preferred Sources** is a plain deeplink in
[components/site-footer.tsx](components/site-footer.tsx), built from `SITE_URL`. Google
requires no structured data, meta tag, or Search Console setting for it; the only
alternative is a `news.google.com` button script, deliberately not used — a fourth
third-party origin on every page load to chase Top Stories placement a portfolio will never
get.

### SEO / AEO / GEO
**The `seo` skill (`.claude/skills/seo/SKILL.md`) is the authority here** — read it before
changing any of the below. Its `references/json-ld-graph.md` documents both graphs
node-by-node. Three traps it exists to prevent: a page-level `openGraph` **replaces** the
parent's rather than merging (so `locale` silently vanishes); structured data must match
what the page visibly renders; and satori does not reflow, so an over-long OG card is cut
off without an error.

- [app/layout.tsx](app/layout.tsx) — `Metadata` + `viewport`. Canonical origin comes from [lib/site.ts](lib/site.ts) (`SITE_URL`, trailing slash stripped); never hardcode a domain.
- [lib/structured-data.ts](lib/structured-data.ts) — two builders. `buildStructuredData()` is the homepage `@graph` (Person, Organization, WebSite, ProfilePage, ItemList, FAQPage); `buildProjectStructuredData()` is the per-case-study graph (CreativeWork, WebPage, BreadcrumbList). A project's `url` is its own case-study page when it has one, with the client's live site in `sameAs` — still gated on the liveness ping. **Both render as a plain `<script type="application/ld+json">`** — do NOT move either to `next/script`, which only injects after hydration and is invisible to crawlers.
- [lib/og-card.tsx](lib/og-card.tsx) — the one `ImageResponse` renderer. It is called **only** by [scripts/generate-og.tsx](scripts/generate-og.tsx), which `pnpm og` runs at build time to write `public/og/root.png`, `public/og/<slug>.png` and `public/apple-icon.png`. Metadata points at those static files by URL. Inter is fetched at render with a fallback to the bundled font. 630px is a hard ceiling and satori does not reflow — the body is word-clamped and chips capped at 5, or the pill row falls off the card.
- **Do not turn the cards back into `opengraph-image.tsx` / `apple-icon.tsx` routes.** They render identically on every request, and as routes they keep `next/og` in the Cloudflare Worker bundle — measured at 816 KB gzipped. See *Deployment*.
- [app/llms.txt/route.ts](app/llms.txt/route.ts) — site-wide plain-text brief for LLM crawlers. [app/projects/[slug]/llms.txt/route.ts](app/projects/[slug]/llms.txt/route.ts) — the full case study as plain text, one per project, linked from the page via `alternates.types`. Both generated from `lib/portfolio-data.ts`.
- [app/sitemap.ts](app/sitemap.ts) — root plus one entry per case study, derived not hand-listed. `lastModified` comes from `caseStudy.updatedDate`, **never `new Date()`** — a lastmod that changes every build is one crawlers learn to ignore.
- [app/robots.ts](app/robots.ts) — explicitly allows every named AI crawler.

**AEO surfaces** (answer engines): each case study renders a key-takeaways block of
standalone sentences, a per-project FAQ accordion whose array also builds the `FAQPage`
node, and `speakable` selectors over the overview and takeaways.

**GEO surfaces** (generative engines): a discrete stat strip, a visible References list
emitted as schema `citation`, and every named organisation resolved as an `Organization`
with `sameAs` to its official site. **Every one of those facts is traceable to a verified
source — nothing in `lib/portfolio-data.ts` is invented, and an empty array is the correct
output when there is nothing citable.**

### Component library
ShadCN UI (new-york style, Tailwind v4 native) lives in `components/ui/`, imported via `@/components/ui/<name>`. Only the 15 components actually used are present — add more with `pnpm dlx shadcn@latest add <name>`. Radix comes from the **unified `radix-ui` package**, not per-component `@radix-ui/react-*`.

Custom components: [components/logo.tsx](components/logo.tsx) (`< S >` mark, inline SVG), [components/brand-icons.tsx](components/brand-icons.tsx) (GitHub/LinkedIn — lucide-react v1 removed brand marks), [components/faq.tsx](components/faq.tsx), [components/animated-section.tsx](components/animated-section.tsx), [components/contact-form.tsx](components/contact-form.tsx) (see *Contact pipeline*), [components/theme-toggle.tsx](components/theme-toggle.tsx), [components/site-header.tsx](components/site-header.tsx), [components/site-footer.tsx](components/site-footer.tsx), [components/project-media.tsx](components/project-media.tsx).

### Key utilities
- `cn()` in [lib/utils.ts](lib/utils.ts) — always use this for merging Tailwind classes conditionally (clsx + tailwind-merge). `tailwind-merge` must stay on v3+ or it mis-merges Tailwind v4 class names.
- Toasts are **sonner** only. The old `hooks/use-toast.ts` + `ui/toast.tsx` + `ui/toaster.tsx` trio has been deleted.

### Styling
- **Tailwind CSS v4** — no `tailwind.config.ts`. All theme config lives in [app/globals.css](app/globals.css) via `@theme inline`, with `@custom-variant dark (&:is(.dark *))` for class-based dark mode.
- Design tokens are **`oklch()` values**, not HSL triplets. Consume them as `var(--border)` directly — wrapping in `hsl()` silently renders nothing (see `.hero-grid`).
- `tw-animate-css` replaces `tailwindcss-animate`.
- The hand-written keyframes at the bottom of `globals.css` (hero entrance, float, pulse, `[data-animate]` scroll-reveal driven by `AnimatedSection`) are load-bearing — do not let a codemod or `shadcn add` overwrite them.

### Notable config
- [next.config.ts](next.config.ts): image optimization is **on** (AVIF/WebP). Do not re-enable `output: 'export'` — it would break the ISR the link checks depend on.
- `pnpm start` runs on port **8080**, not the default 3000
- Canonical origin is `https://shadev-tech.com`, from `NEXT_PUBLIC_SITE_URL` with the fallback in [lib/site.ts](lib/site.ts). Never hardcode a domain anywhere else.
- ESLint is pinned to **v9**; v10 crashes `eslint-plugin-react` via `eslint-config-next`. Its ignore list covers `.open-next/` and `.wrangler/` — without that, lint walks the generated Worker bundle and reports hundreds of errors in code nobody wrote.
- `tsconfig.json` targets ES2022 (ES5 broke `Set` iteration)
- `.prettierrc` / `.prettierignore` are present and `prettier` is a local devDependency, so the formatting hook in `.claude/settings.json` actually runs. The config is the house starter's with two deliberate changes — `trailingComma: "all"` and `bracketSameLine: false` — because that is how this repo was already written. `printWidth: 100` was picked by measurement: it produces less reformatting against the existing source than 80, 90, 110, or 120

---

# Deployment (Cloudflare Workers)

Deployed via `@opennextjs/cloudflare`, **not** Cloudflare Pages. `@cloudflare/next-on-pages`
is deprecated and does not support Next 16 — never reintroduce it. OpenNext output
(`.open-next/worker.js` + `.open-next/assets`) is a Worker with static assets, which the
Pages git integration cannot deploy.

- [wrangler.jsonc](wrangler.jsonc) — Worker name, `nodejs_compat`, ASSETS/IMAGES bindings, the R2 cache bucket, and the custom domain route.
- [open-next.config.ts](open-next.config.ts) — **not** the minimal config a static site uses. Four routes here carry `export const revalidate = 86400` (`app/page.tsx`, `app/projects/[slug]/page.tsx`, and both `llms.txt` routes), which is what keeps the live-link verdicts fresh. That needs a real incremental cache: an R2 bucket bound as `NEXT_INC_CACHE_R2_BUCKET` (the binding name is fixed by the adapter) plus `WORKER_SELF_REFERENCE` so the Worker can call back into itself to revalidate.
- Workers Builds runs `pnpm run build:cf`, then `pnpm exec wrangler deploy`.
- Build-time env (`NEXT_PUBLIC_*`) goes in Build variables; `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` are runtime secrets set with `wrangler secret put`.

Three traps, all learned the expensive way:

- **`wrangler deploy` makes `wrangler.jsonc` authoritative** and overwrites the dashboard. Anything the file omits — a var, a route — is *deleted* from the Worker on deploy. Configure them here, not there.
- **`WORKER_SELF_REFERENCE` cannot bind to a Worker that does not exist yet.** Comment that `services` block out for the very first deploy, then add it back and redeploy.
- **The R2 bucket must exist before the first deploy:** `pnpm exec wrangler r2 bucket create portfolio-inc-cache`.

## The 3 MiB script budget

The free Workers plan caps the compiled script at **3,145,728 bytes gzipped**. Measure
before adding anything that lands in the server graph:

```bash
pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c
```

Measured on this repo, not guessed:

| State | Bytes gzipped |
|---|---|
| With `next/og` routes + `resend` SDK + `@react-email/components` | 3,970,828 — **over** |
| After moving the cards to build time (`scripts/generate-og.tsx`) | 3,154,495 — still over |
| After replacing the SDK + React Email with `fetch` and HTML strings | **1,365,979** |

Two rules follow. **Anything computable once at build time belongs in `scripts/`, emitted
into `public/`, and served as a static asset** — assets do not count against the script
limit; `scripts/generate-og.tsx` is the worked example, and it removed 816 KB by taking
Satori (`resvg.wasm`, `yoga.wasm`, a font blob) out of the runtime graph. And **an SDK is
not free**: `resend` plus `@react-email/components` cost 1.79 MB gzipped to send two emails
that a `fetch` sends for nothing.

---

# Agents & Skills

This project has specialized subagents in `.claude/agents/` and skills in `.claude/skills/`. Use them proactively.

## Subagents

| Agent | When to use |
|-------|-------------|
| `frontend` | Building or editing components, pages, hooks, or styling |
| `ui-ux-designer` | Design decisions, layout architecture, accessibility audits, visual consistency |
| `code-review` | Reviewing any code change before committing; auditing a file or module |
| `qa` | Bug investigation, edge case analysis, validating correctness of changes |
| `knowledge` | Before any implementation — retrieve established patterns and past decisions |
| `learn` | After discovering a reusable pattern, gotcha, or architectural decision worth preserving |
| `security-reviewer` | After touching `app/api/contact/route.ts`, the contact form or schema, a `dangerouslySetInnerHTML`, `wrangler.jsonc`, or any env var |
| `seo-reviewer` | Diff-scoped: after touching metadata, JSON-LD, sitemap, robots, an `llms.txt` route, or an OG card |
| `seo-analyzer` | Whole-site SEO audit, read-only — the broad counterpart to `seo-reviewer` |
| `search-ai-optimizer` | **The only agent that writes SEO changes.** Schema, metadata, `llms.txt` |
| `ui-ux-reviewer` | Read-only, research-cited UI critique — the second opinion `ui-ux-designer` does not give |
| `sync-claude-md` | After significant codebase changes — keeps this file up to date |

Every agent runs on **`sonnet`**, per the global rule that project subagents never use
opus.

## Skills (auto-loaded into relevant agents)

| Skill | What it enforces |
|-------|-----------------|
| `frontend` | ShadCN imports, `cn()` usage, oklch dark-mode tokens, no inline styles, `"use client"` rules |
| `seo` | **The authority on SEO/AEO/GEO/OG.** Metadata contract, JSON-LD graph shape, citation and entity rules, satori/OG-card constraints |
| `code-review` | Structured review checklist and report format |
| `git` | No state-changing git — read-only git allowed; user commits |
| `commit-message-generator` | Composing a commit message (print-only — never commits) |
| `ui-auditor` | UI consistency, UX heuristics, accessibility; pattern registry at `tasks/ui-patterns.md` |
| `learn` | Capturing a learning into project memory |
| `knowledge` | Retrieving past learnings before implementing |
| `seo-optimizer` | The numeric SEO bar `seo` does not state — Core Web Vitals targets, heading hierarchy, image rules |
| `geo-fundamentals` | AI-citation mechanics: what gets quoted, crawler access, the two `llms.txt` routes |
| `ui-ux-quality` | Before delivering UI work — contrast, touch targets, breakpoints, motion durations |
| `frontend-design` | Building a page, section, or hero where visual quality matters — taste, not mechanics |

`seo` outranks `seo-optimizer` and `geo-fundamentals` wherever they overlap. The four
skills above came from the house Next.js starter and were rewritten against this repo's
layout — they name `lib/site.ts` and `lib/structured-data.ts`, not the starter's
`config/site.config.ts` and `lib/seo/`.

## Project memory

Persistent knowledge lives in
`~/.claude/projects/-Users-shafin-dev-projects-portfolio/memory/` — `MEMORY.md` is a
one-line index loaded every session, with one file per memory beside it. The `knowledge`
skill/agent reads it; the `learn` skill/agent writes it. **This is the only knowledge
store** — do not create a second one.

Fast corrections go to `tasks/lessons.md`; plans go to `tasks/plans/<slug>.md`.

## Delegating to the local model

Before reading any file over ~150 lines, sweeping several files, or starting a bounded
mechanical subtask, read the global `local-llm` skill
(`~/.claude/skills/local-llm/SKILL.md`) — it routes that work to the local LM Studio model
so file bytes never enter Claude's context. Delegation is the default; the exclusion list
in that skill is closed. Always review the output. Verification for this repo:
`npx tsc --noEmit && pnpm lint`, plus `pnpm build` when a route or metadata changed.

---

# Agent Behavior & Execution Rules

- **Plan Node Default:** Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions). Write detailed specs upfront to reduce ambiguity. If things go sideways, STOP and re-plan immediately.
- **Subagent Strategy:** Use subagents liberally to keep the main context window clean. Offload research, exploration, and parallel analysis to subagents. One task per subagent for focused execution.
- **Self-Improvement Loop:** After ANY correction from the user, update `tasks/lessons.md` with the pattern. Write rules to prevent the same mistake. Review lessons at session start.
- **Verification Before Done:** Never mark a task complete without proving it works. Run build/lint, check output, and demonstrate correctness. Ask yourself: "Would a staff engineer approve this?"
- **Demand Elegance (Balanced):** For non-trivial changes, pause and ask "is there a more elegant way?" If a fix feels hacky, implement the elegant solution instead. Skip this for simple, obvious fixes.
- **Autonomous Bug Fixing:** When given a bug report, just fix it. Point at logs/errors, then resolve them.

# Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items.
2. **Verify Plan**: Check in before starting implementation.
3. **Track Progress**: Mark items complete as you go.
4. **Explain Changes**: Provide a high-level summary at each step.
5. **Document Results**: Add a review section to `tasks/todo.md`.
6. **Capture Lessons**: Update `tasks/lessons.md` after any corrections.

# Core Principles

- **Simplicity First:** Make every change as simple as possible. Impact minimal code.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.

# Frontend Conventions

- **Stack:** Next.js 16 (App Router), React 19, **Tailwind CSS v4**, ShadCN UI (unified `radix-ui` package).
- **ShadCN UI:** All ShadCN components must reside in `./components/ui`. Import via `@/components/ui/<name>`.
- **Global Components:** Place shared/reusable components in `./components`.
- **Styling:** Theme config and design tokens go in `./app/globals.css` (`@theme inline`, `oklch()` values). Tailwind utility classes only — no inline styles.
- **Class merging:** Always use `cn()` from `./lib/utils` for conditional Tailwind classes.
- **Icons:** Use `lucide-react` exclusively (brand marks in `components/brand-icons.tsx`).
- **Types:** Define shared types inline in their component file; shared content types live in `lib/portfolio-data.ts`.
- **Dark mode:** Tailwind class-based via `next-themes`. Use CSS variable tokens (`bg-background`, `text-foreground`, etc.) — never hardcoded color values, and never wrap an `oklch()` token in `hsl()`.

# Environment Variables

Two files, deliberately split — `.env` is **tracked in git** and `.env*.local` is not.
[.env.example](.env.example) documents both.

| Key | File | Cloudflare | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `.env` | Build variable | Canonical origin; fallback in `lib/site.ts` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `.env` | Build variable | Public by design — the widget needs it in the browser |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `.env.local` | Build variable | GA4 `G-…`. Public, but kept out of git so a fork cannot pollute the property — the one public value not in `.env`. **Build variable, never a Worker `var`** — `NEXT_PUBLIC_*` are inlined at build time, so a runtime var does nothing. Workers Builds never sees `.env.local`, so without the Build variable production renders identically and collects nothing. Empty disables analytics entirely |
| `TURNSTILE_SECRET_KEY` | `.env.local` | `wrangler secret put` | **Never** prefix `NEXT_PUBLIC_` |
| `RESEND_API_KEY` | `.env.local` | `wrangler secret put` | **Never** prefix `NEXT_PUBLIC_` |
| `CONTACT_TO_EMAIL` | `.env.local` | `vars` in `wrangler.jsonc` | Where enquiries land |
| `CONTACT_FROM_EMAIL` | `.env.local` | `vars` in `wrangler.jsonc` | Must be on a Resend-verified domain |

**Nothing server-only goes in `.env`** — that file is committed. `NEXT_PUBLIC_FORMSPREE_URL`
is retired; the contact form posts to `app/api/contact/route.ts` now.

# Knowledge graph (graphify)

If `graphify-out/` exists: query the graph BEFORE Grep/Glob/Read. If
`graphify-out/.needs_update` exists, run `/graphify ./ --update` first.
Commands: `query "<q>"` (BFS), `query "<q>" --dfs`, `path "<A>" "<B>"`, `explain "<node>"`,
`affected "<node>"` (reverse traversal — blast radius before a change). Read
`graphify-out/GRAPH_REPORT.md` for architecture questions.
Cite `source_file:source_location` from graph results. Trust EXTRACTED edges; verify
INFERRED ones against source before relying on them.

`graphify-out/` is git-ignored, and `.graphifyignore` keeps lockfiles, `public/`, and
`.claude/` out of the graph.

# Hooks (`.claude/settings.json`)

- `SessionStart` runs `.claude/scripts/graphify-freshness.sh`, which marks the graph stale
  when a tracked file has changed since the last build. `PostToolUse` on `Bash` re-runs it
  after a `git pull` / `merge` / `checkout` / `switch`.
- `PreToolUse` on `Edit|Write` blocks edits to any lockfile.
- `PostToolUse` on `Edit|Write` runs the local `prettier` on `.ts`/`.tsx`/`.css`. This is
  live now — `prettier` and `prettier-plugin-tailwindcss` are devDependencies and
  `.prettierrc` is committed; it used to be a silent no-op.
- State-changing git commands are denied at the permission layer, not just by convention.

# Portfolio: agent-config merge, Tazcreates case study, Cloudflare/Turnstile/Resend scaffold

> **First implementation step:** copy this file to
> `/Users/shafin/dev/projects/portfolio/tasks/plans/portfolio-upgrade.md`.
> Per `/Users/shafin/CLAUDE.md`, plans are project artifacts and travel with the code;
> `~/.claude/plans/` is only where plan mode is allowed to write.

## Context

Three projects sit side by side in `/Users/shafin/dev/projects`:

- **`agentic-nextjs-project-template`** — the house Next.js starter. Its `.claude/` is the
  most developed agent configuration of the three: 12 skills, 5 agents, a graphify
  freshness hook, prettier config.
- **`tazcreates`** — a real site shipped from that template (portrait-commission portfolio
  for Tazmeen Zabiyaan, live at <https://tazcreates.site/>). Its `.claude/skills/` and
  `.claude/agents/` are **byte-identical** to the template's (verified by `diff`), so the
  template is the single extraction source. What tazcreates adds is a *worked deployment*:
  Cloudflare Workers via OpenNext, Turnstile-gated commission form, Resend + React Email
  delivery, and a measured fight with the 3 MiB free-plan script budget.
- **`portfolio`** — Shafin's personal site. Its `.claude/` has diverged in a good way
  (portfolio-specific `seo`, `frontend`, `knowledge`, `learn`, `code-review` skills) and a
  bad way (stale `/home/shafin-ahmed/…` paths from a Linux machine, `model: opus` on six
  subagents against the global rule, a permission entry pointing at a script that no longer
  exists, no local prettier so the formatting hook silently no-ops).

Three things are wanted, and they interlock: bring the template's agent tooling into
portfolio without flattening what portfolio already knows about itself; add tazcreates as a
first-class case study; and give portfolio the same Cloudflare + captcha + email pipeline
tazcreates proved out — which is also what finally replaces portfolio's Formspree contact
form with something that cannot be scraped and abused.

**Decisions taken with the user:** selective merge (not overwrite); keep ISR and wire an R2
incremental cache; full case study for tazcreates; Resend + Turnstile replaces Formspree.

**How this was researched:** file reading was delegated to the remote LM Studio model
(`gemma-4-26b-a4b-it-qat@q4_k_xl`) in two batched sweeps — skill/agent diffs, package
manifests, the tazcreates API route and email templates, portfolio's data and lib modules.
Every claim repeated below that mattered was re-opened at its cited line. Gemma misread the
rate-limit constants in `app/api/commission/route.ts` (it reported line numbers as values);
the real values are `WINDOW_MS = 10 * 60 * 1000` and `MAX_PER_WINDOW = 3`, confirmed at
`tazcreates/app/api/commission/route.ts:33-34`. `graphify` was not run: it writes
`graphify-out/`, which plan mode forbids. Running `/graphify ./` in portfolio is listed as
an optional first implementation step.

---

## Workstream A — extract skills, agents and Claude config into portfolio

Source of truth: `agentic-nextjs-project-template/.claude/` (identical to tazcreates').

### A1. Copy verbatim (no portfolio equivalent exists)

| From (template) | To (portfolio) | Why |
|---|---|---|
| `.claude/scripts/graphify-freshness.sh` | same path | Marks `graphify-out/` stale on file change; pairs with the hook below |
| `.graphifyignore` | repo root | Keeps `node_modules`/`.next` out of the graph |
| `.prettierrc`, `.prettierignore` | repo root | Portfolio's `PostToolUse` prettier hook is a **no-op today** — no local prettier binary |
| `knowledge/ssr-hydration-pattern.md` | `knowledge/` | The template's one curated pattern doc |

Add `prettier` and `prettier-plugin-tailwindcss` as devDependencies so
`node_modules/.bin/prettier` exists and the existing hook in
`portfolio/.claude/settings.json` starts firing.

Register the `SessionStart` hook in `portfolio/.claude/settings.json`, copying the shape at
`agentic-nextjs-project-template/.claude/settings.json` (hooks → SessionStart → command →
`"$CLAUDE_PROJECT_DIR/.claude/scripts/graphify-freshness.sh"`, timeout 30). Also copy the
template's `PostToolUse` **Bash** matcher that re-runs the freshness script after
`git pull`/`merge`/`checkout`/`switch`.

### A2. Keep portfolio's versions — do not overwrite

`frontend`, `seo`, `knowledge`, `learn`, `code-review`, `ui-auditor`, `git`.

The template's `frontend/SKILL.md` is 668 lines of data-table, pagination, faceted-filter,
entity-picker and mandatory-i18n convention (`.claude/skills/frontend/SKILL.md:48-340`,
`:572-689`). Portfolio is a static content site with no tables, no i18n and no data layer;
importing that would be actively misleading. Same for `knowledge`/`learn`, whose template
versions point at `.planning/learnings/` while portfolio uses the
`~/.claude/projects/…/memory/` store described in `portfolio/CLAUDE.md:116-124`.

**Backport nothing from the big template skills in this pass.** (The user chose plain
selective merge, not selective + backport.)

### A3. Add four template-only skills, path-adapted

Copy into `portfolio/.claude/skills/` and rewrite every path reference before saving —
these were written against the template's layout, which portfolio does not share:

| Skill | Adaptation required |
|---|---|
| `frontend-design` | References `lib/themes.ts` (`:36`) and `next/font` faces in `app/layout.tsx` (`:50`). Portfolio has no `lib/themes.ts` — retarget to the `@theme inline` oklch block in `app/globals.css` and portfolio's actual fonts |
| `ui-ux-quality` | References `components/ui/custom/` skeletons (`:51`) and `framer-motion` (`:53`). Portfolio has neither — retarget to `components/animated-section.tsx` and the hand-written keyframes at the bottom of `app/globals.css` |
| `geo-fundamentals` | Largely generic (AI-crawler access, `llms.txt`, retrieval structure). Add a header line deferring to portfolio's `seo` skill as the authority, and point `llms.txt` guidance at the two existing routes |
| `seo-optimizer` | Written against `config/site.config.ts` and `lib/seo/` (`:148-149` also assumes `LOCALE_PREFIXED_ROUTES`). Portfolio uses `lib/site.ts` + `lib/structured-data.ts` + `lib/portfolio-data.ts`. Keep what portfolio's `seo` skill lacks — Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms), one-`<h1>`-per-page, `priority` on the LCP image only — and drop the hreflang section |

Every one of these must state, at the top, that `.claude/skills/seo/SKILL.md` outranks it on
JSON-LD graph shape and OG-card constraints. Portfolio's `seo` skill covers things the
template pair does not: the `openGraph` inheritance trap, `@id` cross-referencing, and the
satori 630px ceiling / 5-chip cap.

### A4. Add three template-only agents, path-adapted

| Agent | Role in portfolio | Notes |
|---|---|---|
| `seo-analyzer` | Read-only **whole-site** metadata/schema/sitemap audit | Complements portfolio's existing `seo-reviewer`, which is diff-scoped. Rewrite its primitives paragraph away from `config/site.config.ts` / `lib/seo/` |
| `search-ai-optimizer` | The one agent allowed to **write** SEO changes | Rewrite its file map to portfolio's (`lib/structured-data.ts`, `app/sitemap.ts`, `app/robots.ts`, the two `llms.txt` routes, `lib/og-card.tsx`) |
| `ui-ux-reviewer` | Read-only, evidence-cited UI critique | Distinct from portfolio's `ui-ux-designer` (which is a builder/decider). State the split in both files so they do not collide |

**Skip `i18n-reviewer`** — portfolio has no next-intl, no `messages/`, no locale files.
**Skip the template's `security-reviewer`** — portfolio's own is better scoped
(`portfolio/.claude/agents/security-reviewer.md`); instead extend it to cover the new
`app/api/contact/route.ts` from Workstream C.

### A5. Fix what the audit turned up (all inside portfolio)

1. **Stale Linux memory paths** — `-home-shafin-ahmed-dev-projects-portfolio` →
   `-Users-shafin-dev-projects-portfolio` in seven places:
   `.claude/agents/learn.md:18,19,38`, `.claude/agents/knowledge.md:18,19,42`,
   `.claude/skills/learn/SKILL.md:15`, `.claude/skills/knowledge/SKILL.md:13,59`,
   `CLAUDE.md:119`. Also the absolute `/home/shafin-ahmed/dev/projects/portfolio/CLAUDE.md`
   at `.claude/agents/sync-claude-md.md:12` and the `du -sh` permission at
   `.claude/settings.local.json:26`.
2. **Subagent model routing** — global `~/.claude/CLAUDE.md` says agents in `.claude/agents/`
   use sonnet or haiku, never opus. Six are on opus: `code-review.md:5`, `qa.md:5`,
   `frontend.md:5`, `seo-reviewer.md:5`, `sync-claude-md.md:5`, `ui-ux-designer.md:5`.
   Change to `sonnet`.
3. **Dead permission entry** — `.claude/settings.json:9` allows
   `python3 ~/.claude/skills/local-llm/scripts/llm.py*`; the script is now `gemma.py`.
   Fix, and add `Bash(npx tsc --noEmit*)`, `Bash(pnpm typecheck*)`,
   `Bash(pnpm exec wrangler*)`, `Bash(pnpm dlx shadcn@latest add*)` (already present).
4. **Plaintext API key** — `.claude/settings.json` carries a literal `EXA_API_KEY` in the
   MCP server block, and that file is committed. Move it to an env reference and rotate the
   key. Flag to the user; do not silently leave it.
5. **Do not backport the local-model section** from the template or tazcreates CLAUDE.md —
   both still document the retired `google/gemma-4-12b-qat` curl-with-`temperature` recipe
   (`agentic-nextjs-project-template/CLAUDE.md:23-41`). Portfolio's
   (`CLAUDE.md:126-133`) already points at the current `local-llm` skill and is correct.

### A6. Rewrite `portfolio/CLAUDE.md`

Keep its structure. Changes:

- Extend the **Skills** table (`:103-114`) with the four new skills and the **Subagents**
  table (`:89-101`) with the three new agents.
- New `### Contact pipeline` under Architecture — the route, the check order, and the rule
  that `to` never comes from the payload.
- New `## Deployment (Cloudflare Workers)` section modelled on `tazcreates/CLAUDE.md` —
  OpenNext not Pages, never reintroduce `@cloudflare/next-on-pages`, the R2 incremental
  cache, and the 3 MiB script-budget measure command.
- Update **Environment Variables** (`:171-174`): drop `NEXT_PUBLIC_FORMSPREE_URL`, add
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and note which are build-time vs runtime secrets.
- Add a `## Knowledge graph (graphify)` section (portfolio has none) copied from
  `agentic-nextjs-project-template/CLAUDE.md:53-57`.
- Note under **Hooks** that prettier now resolves locally, so the `PostToolUse` hook is live.

Keep portfolio's root `tasks/` convention (`tasks/todo.md`, `tasks/lessons.md`,
`tasks/plans/<slug>.md`). Do **not** import the template's `.claude/tasks/` layout — two
plan directories in one repo is exactly the drift this is meant to prevent.

---

## Workstream B — add Tazcreates as a full case study

Single file edit plus one asset. Everything downstream is derived.

### B1. Asset

`public/img/tazcreates.png` — a screenshot of <https://tazcreates.site/>. Match the
existing shots in `public/img/`. **Manual step** unless the user wants one captured.
If the asset is not ready, `image: null` is valid — `components/project-media.tsx` renders
its gradient placeholder — but the OG card and homepage card are noticeably weaker.

### B2. The entry in `lib/portfolio-data.ts`

Append to the `projects` array (`lib/portfolio-data.ts:203`), following the shape at
`:107-125` and the `CaseStudy` contract at `:73-105`.

```
slug:        "tazcreates"
title:       "Tazcreates"
description: one sentence, commission portfolio for a portrait artist
image:       "/img/tazcreates.png"
live:        "https://tazcreates.site/"
repo:        null (or the URL if the repo is public)
category:    "professional"      // client work, same bucket as the ARITS projects
schemaType:  "WebSite"           // a marketing/portfolio site, not an application
stacks:      Next.js 16, TypeScript, Tailwind v4, shadcn/ui, framer-motion, Lenis,
             React Hook Form, Zod, Resend, React Email, Cloudflare Turnstile,
             Cloudflare Workers (OpenNext)
```

`caseStudy` content, drawn only from facts verifiable in the tazcreates repo — the file's
own header rule at `:66-71` is *nothing here is invented*:

- **overview / problem / solution** — a single-page commission site for a portrait artist:
  gallery, pricing tiers, process, FAQ, and a commission form that has to survive being a
  public, directly-POSTable endpoint.
- **takeaways** — three sentences, each true standing alone, no leading "It"/"The project"
  (`:88-93`). Candidates: the Cloudflare Pages → Workers migration forced by
  `@cloudflare/next-on-pages` being deprecated and Next 16-incompatible; moving the social
  card from a `next/og` runtime route to a build-time PNG; a five-gate submission pipeline
  in front of every email send.
- **stats** — must be real numbers already stated somewhere
  (`:26-33`). From `tazcreates/.claude/tasks/plans/cloudflare-deploy.md:43,58-59`:
  `820 KB` removed from the Worker payload; `21%` reduction (3,833,495 → 3,013,678 bytes
  gzipped); `3 MiB` free-plan script limit; `4%` headroom remaining.
- **features** — masonry gallery with lightbox, reduced-motion-aware marquee and reveals,
  Zod schema shared by form and API route, honeypot + per-IP rate limit + server-verified
  Turnstile, Resend delivery with a best-effort visitor confirmation, build-time OG card,
  server-rendered JSON-LD.
- **outcomes** — deployed on Cloudflare Workers under the 3 MiB free-plan cap with the
  custom domain pinned in `wrangler.jsonc`.
- **faqs** — feed the `FAQPage` node; answers must be self-contained.
- **sources** — the live site; Cloudflare's OpenNext adapter docs. Verify each URL resolves
  before writing it (`:189-195`).
- **entities** — Tazcreates / Tazmeen Zabiyaan as `Client` with `url`
  `https://tazcreates.site/`; add Cloudflare and Resend only if they are actually named in
  the rendered copy.
- **publishedDate / updatedDate** — real ISO dates. Note `CASE_STUDY_DATE` at `:201` is
  `2026-08-04` for the existing eight; this one is newer, so give it its own date.
  `updatedDate` drives sitemap `lastmod` (`CLAUDE.md:48`) — never `new Date()`.
- **externalCaseStudy** — `null`.

### B3. What follows automatically

No other file needs touching. `caseStudyProjects` is derived, and it feeds
`generateStaticParams`, `app/sitemap.ts`, prev/next in `app/projects/[slug]/page.tsx`,
`app/projects/[slug]/opengraph-image.tsx`, both `llms.txt` routes, and the homepage
`ItemList` JSON-LD (`CLAUDE.md:24,29`).

Two side effects to check rather than assume:

- **Prev/next chain shifts.** Nine case studies instead of eight; the ordering is array
  order, so the new entry lands at the end unless placed deliberately.
- **Live-link ping.** `lib/link-status.ts` pings `https://tazcreates.site/` at build; the
  Live button and the schema `url` only render if it answers. Timeouts fail open by design
  (`CLAUDE.md:34`), so a slow build network will not strip it.

---

## Workstream C — Cloudflare Workers + Turnstile + Resend

Modelled on tazcreates, with one structural difference that drives the whole design:
**portfolio uses ISR and tazcreates does not.** `export const revalidate = 86400` appears at
`app/page.tsx:48`, `app/projects/[slug]/page.tsx:37`, `app/llms.txt/route.ts:13` and
`app/projects/[slug]/llms.txt/route.ts:6`, and it is what keeps the live-link verdicts
fresh. So portfolio's OpenNext config cannot be the minimal one at
`tazcreates/open-next.config.ts`.

### C1. Dependencies

```
pnpm add resend @react-email/components @marsidev/react-turnstile @opennextjs/cloudflare
pnpm add -D wrangler
```

**Version note:** portfolio is on **zod v4** (`^4.4.3`) while tazcreates is on v3. Port the
schema to v4 idiom — top-level `z.email()`, as `components/contact-form.tsx:30` already
uses. Do not copy `lib/commission-schema.ts` verbatim.

### C2. Contact pipeline

| File | What it is |
|---|---|
| `lib/contact-schema.ts` | Zod v4 schema shared by the client form and the route. Fields: `name`, `email`, `projectType`, `description`, `company` (real, optional — see below), `website` (honeypot), `turnstileToken` |
| `emails/shared.tsx` | Layout/typography primitives, ported from `tazcreates/emails/shared.tsx` |
| `emails/contact-request.tsx` | The notification to Shafin. Sender as headline, reply button above the fold |
| `emails/contact-confirmation.tsx` | Auto-reply to the visitor |
| `app/api/contact/route.ts` | The handler. `export const runtime = "nodejs"` |
| `components/contact-form.tsx` | Rewired: Turnstile widget, hidden honeypot, POSTs `/api/contact` |

**Honeypot field name matters here.** tazcreates uses `company` as its honeypot
(`app/api/commission/route.ts:112-114`), but portfolio's form renders a *real, visible*
"Company (optional)" input at `components/contact-form.tsx:143-158`. Reusing `company`
would reject every legitimate submission that fills it in. Use a separate hidden `website`
field instead.

Preserve tazcreates' ordering exactly — it is cheapest-rejection-first and no email is sent
until every gate passes (`app/api/commission/route.ts:8-22`):

1. config present? → else `503 not_configured` (this is the signal the form uses to fall
   back to `mailto:`)
2. `request.json()` → `400 invalid_json`
3. `contactSchema.safeParse` → `400 invalid_input`
4. honeypot filled → return `{ ok: true }` **with 200**, so the bot learns nothing
5. per-IP rate limit → `429`. Constants: `WINDOW_MS = 10 * 60 * 1000`, `MAX_PER_WINDOW = 3`,
   with the opportunistic map sweep at `:47-51`
6. Turnstile verified **server-side** against
   `https://challenges.cloudflare.com/turnstile/v0/siteverify`, failing **closed** on a
   verification outage (`:81-84`) → `400 captcha_failed`
7. Resend send. `to` is always `process.env.CONTACT_TO_EMAIL`, **never** `data.email` —
   that is what stops it being an open relay (`:129-131`). Visitor's address goes in
   `replyTo`
8. visitor confirmation last, wrapped in its own try/catch, logged and swallowed — a failure
   here must not 502 the request and make someone submit twice (`:142-168`)

`clientIp()` prefers `cf-connecting-ip` (unspoofable on Workers), then `x-forwarded-for`,
then `x-real-ip` (`:55-64`).

**Accepted limit, document it:** the rate limit is per-isolate in memory. On Workers that
window is shorter and less reliable than on Node. Turnstile is the real gate.

**Client behaviour:** keep the existing `mailto:` fallback at
`components/contact-form.tsx:69-83`, but trigger it on a `503 not_configured` response
rather than on a missing env var — the site must not look broken before the keys are set.
Render `<Turnstile />` only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` exists, and block submit
until a token is held (`tazcreates/components/portfolio/commission-form.tsx:270-285`, token
threaded into the body at `:86`).

### C3. Env

`.env` (git-ignored via `.env*.local`; add a committed `.env.example` modelled on
`tazcreates/.env.example`):

| Key | Where it lives on Cloudflare |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Build variable |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build variable (Next inlines it) |
| `RESEND_API_KEY` | Runtime **secret** (`wrangler secret put`) |
| `TURNSTILE_SECRET_KEY` | Runtime **secret** |
| `CONTACT_TO_EMAIL` | `vars` in `wrangler.jsonc` (non-secret) |
| `CONTACT_FROM_EMAIL` | `vars` in `wrangler.jsonc` (non-secret) |

Retire `NEXT_PUBLIC_FORMSPREE_URL`.

### C4. Cloudflare config

**`wrangler.jsonc`** — copy `tazcreates/wrangler.jsonc` and change:

- `name`: `portfolio`; `main`: `.open-next/worker.js`
- `compatibility_flags`: `["nodejs_compat", "global_fetch_strictly_public"]`
- `assets`: `{ directory: ".open-next/assets", binding: "ASSETS" }`
- `images`: `{ binding: "IMAGES" }` — `next.config.ts` enables AVIF/WebP optimization on
  local files in `public/img`, so without this binding optimization fails at runtime.
  Transformations are metered past the free tier
- **`r2_buckets`** with binding `NEXT_INC_CACHE_R2_BUCKET` — the ISR cache. tazcreates has
  none because nothing there revalidates
- **`services`** with binding `WORKER_SELF_REFERENCE` pointing at `name` — OpenNext needs
  it to call back into itself to revalidate. tazcreates deliberately omits it
  (`wrangler.jsonc`, closing comment); portfolio genuinely needs it. It cannot bind to a
  Worker that does not exist yet, so the **first deploy must go out without it**, then be
  added and redeployed
- `workers_dev: false` and a `routes` entry with `custom_domain: true`. Heed tazcreates'
  warning: `wrangler deploy` makes this file authoritative and **deletes** any var or route
  the dashboard has that the file lacks
- Secrets never go in this file — it is committed

**`open-next.config.ts`** — *not* the minimal tazcreates version:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
```

**`package.json` scripts** (from `tazcreates/package.json`):
`build:cf`, `preview`, `deploy`, `cf-typegen`.

**`.gitignore`**: add `/.open-next/` and `/.wrangler/`.

### C5. The 3 MiB script budget — measure before assuming

This is the part most likely to bite. tazcreates fought to `3,013,678` bytes gzipped against
a `3,145,728` limit — 4% headroom — and portfolio's server graph is *heavier*: it adds the
`resend` SDK and `@react-email/components`, and it ships `next/og` in **three** places
(`app/opengraph-image.tsx`, `app/twitter-image.tsx` re-exporting it,
`app/projects/[slug]/opengraph-image.tsx`, all through `lib/og-card.tsx`). `next/og` alone
cost tazcreates 820 KB gzipped in `resvg.wasm` + `yoga.wasm` + a font blob.

Sequence it: get a **baseline measurement first**, then decide what to cut.

```
pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c
```

Levers, in the order tazcreates found them worth pulling:

1. Pin every OG route `export const dynamic = "force-static"`. Slugs are finite and
   `dynamicParams = false`, so all nine cards can be rendered at build. `lib/og-card.tsx:19`
   already fetches Inter with `next: { revalidate: false }`, which is build-time friendly.
2. If that is not enough, follow tazcreates exactly: a `scripts/generate-og.tsx` that
   renders the cards into `public/` at build time and takes Satori out of the runtime graph.
   Static assets do not count against the script limit.
3. Last lever: replace the `resend` SDK + `@react-email/components` with a plain `fetch` to
   Resend's REST API (`tazcreates/.claude/tasks/plans/cloudflare-deploy.md:70-71`).

Do **not** re-add `output: 'export'` to `next.config.ts` — the note at `next.config.ts:9-11`
is load-bearing; a static export freezes the link-status verdicts permanently.

### C6. Manual, user-side (not code)

- Cloudflare: create the Workers project, R2 bucket, and Turnstile widget; set Build command
  `pnpm run build:cf`, Deploy command `pnpm exec wrangler deploy`; add the build variables
  and `wrangler secret put` the two secrets.
- Resend: create the API key and verify the sending domain (DNS records) so
  `CONTACT_FROM_EMAIL` is deliverable.

---

## Verification

Per the user's global defaults: typecheck + lint + logic review. **Do not run a test suite**
(portfolio has none configured) and no browser checks unless asked.

```bash
cd /Users/shafin/dev/projects/portfolio
npx tsc --noEmit          # zod v4 port, new route, new data entry
pnpm lint                 # changed files
pnpm build                # proves the new case-study route and OG images generate
pnpm run build:cf && pnpm exec wrangler deploy --dry-run --outdir /tmp/wr
find /tmp/wr -type f ! -name '*.map' -exec cat {} + | gzip -c | wc -c   # must be < 3145728
```

Then check by hand:

1. `.next` build output contains `/projects/tazcreates` and its `llms.txt`; `app/sitemap.ts`
   emits nine case-study URLs with a real `lastModified`.
2. Every URL written into the new `caseStudy.sources` and `entities` resolves — a dead
   `sameAs` is worse than none (`lib/portfolio-data.ts:189-195`).
3. `grep -rn "shafin-ahmed" .claude CLAUDE.md` returns nothing.
4. `grep -rn "^model: opus" .claude/agents` returns nothing.
5. `grep -rn "FORMSPREE" .` returns nothing outside the plan/changelog.
6. `node_modules/.bin/prettier` exists, so the `PostToolUse` hook actually formats.
7. Contact route, by reasoning over the diff (it is untrusted-input code, so this stays in
   the main thread and is not delegated): the honeypot is `website` and not `company`;
   `to` is read only from env; the confirmation send is inside its own try/catch; Turnstile
   failure is fail-closed.
8. Run the `security-reviewer` agent over the diff once `app/api/contact/route.ts` exists.

## Suggested execution order

1. Copy this plan into `portfolio/tasks/plans/`.
2. Optional: `/graphify ./` in portfolio, so later sessions can query the graph before
   grepping.
3. Workstream A5 (the fixes) — small, isolated, and makes everything after it saner.
4. Workstream A1–A4 (config extraction), then A6 (CLAUDE.md), leaving the deployment and
   contact sections as stubs.
5. Workstream B (case study) — self-contained, verifiable with `pnpm build` alone.
6. Workstream C2–C3 (contact pipeline) — get it working locally first.
7. Workstream C1, C4–C5 (Cloudflare) — measure the budget before committing to the host.
8. Fill in the CLAUDE.md deployment and contact sections with what actually shipped.

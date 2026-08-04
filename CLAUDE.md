# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev             # Start dev server (clears .next, 6 GB memory cap)
pnpm build           # Production build (clears .next)
pnpm start           # Serve production build on port 8080
pnpm lint            # ESLint
pnpm format          # Prettier (entire project)
pnpm analyze         # Bundle analysis build
pnpm run clean-install  # Nuke node_modules + reinstall (use when deps are broken)
```

No test suite is configured.

## Architecture

### Single-page portfolio + case-study pages
[app/page.tsx](app/page.tsx) renders the homepage. It is an **async Server Component** — do not add `"use client"` to it.

**All content lives in [lib/portfolio-data.ts](lib/portfolio-data.ts)**, not in the page: `profile`, `experience`, `projects`, `skills`, `navLinks`, `education`, `certification`, `faqs`. Six consumers read from it (page render, case-study pages, JSON-LD graph, `/llms.txt`, the OG images, the sitemap), so editing content means editing that one file. Never re-inline data into a component.

### Project case studies — `/projects/<slug>`
[app/projects/[slug]/page.tsx](app/projects/[slug]/page.tsx) renders a long-form write-up per project: hero + client/timeline/role, screenshot, problem, approach, features, stack, outcomes, prev/next, CTA.

**A project gets a page purely by having a non-null `caseStudy`.** `caseStudyProjects` in `lib/portfolio-data.ts` is the single derived list; `generateStaticParams`, `app/sitemap.ts`, the prev/next nav, and `app/projects/[slug]/opengraph-image.tsx` all read from it. `dynamicParams = false`, so any other slug 404s to [app/projects/[slug]/not-found.tsx](app/projects/[slug]/not-found.tsx). Today: 8 professional projects have one; the 3 personal ones do not.

Chrome is shared with the homepage via [components/site-header.tsx](components/site-header.tsx) (takes `hrefPrefix="/"` off-homepage so `#about` anchors resolve) and [components/site-footer.tsx](components/site-footer.tsx). The card/hero image — including the gradient placeholder used when `image` is null — is [components/project-media.tsx](components/project-media.tsx), shared so the two can never drift.

### Live-link health checks
[lib/link-status.ts](lib/link-status.ts) pings every project's `live` URL at build time; the Live button and the schema.org `url` only render when the ping succeeds. Failure handling is deliberate — only DNS failure / connection refused / 4xx-5xx count as dead; timeouts **fail open** so a flaky build network cannot strip every Live button. Results cache for 24h via `next: { revalidate }` plus `export const revalidate = 86400` on the page (the two must be kept in sync by hand — Next requires a literal there).

### SEO / AEO / GEO
**The `seo` skill (`.claude/skills/seo/SKILL.md`) is the authority here** — read it before
changing any of the below. Its `references/json-ld-graph.md` documents both graphs
node-by-node. Three traps it exists to prevent: a page-level `openGraph` **replaces** the
parent's rather than merging (so `locale` silently vanishes); structured data must match
what the page visibly renders; and satori does not reflow, so an over-long OG card is cut
off without an error.

- [app/layout.tsx](app/layout.tsx) — `Metadata` + `viewport`. Canonical origin comes from [lib/site.ts](lib/site.ts) (`SITE_URL`, trailing slash stripped); never hardcode a domain.
- [lib/structured-data.ts](lib/structured-data.ts) — two builders. `buildStructuredData()` is the homepage `@graph` (Person, Organization, WebSite, ProfilePage, ItemList, FAQPage); `buildProjectStructuredData()` is the per-case-study graph (CreativeWork, WebPage, BreadcrumbList). A project's `url` is its own case-study page when it has one, with the client's live site in `sameAs` — still gated on the liveness ping. **Both render as a plain `<script type="application/ld+json">`** — do NOT move either to `next/script`, which only injects after hydration and is invisible to crawlers.
- [lib/og-card.tsx](lib/og-card.tsx) — the one `ImageResponse` renderer. [app/opengraph-image.tsx](app/opengraph-image.tsx) (root, re-exported by [app/twitter-image.tsx](app/twitter-image.tsx)) and [app/projects/[slug]/opengraph-image.tsx](app/projects/[slug]/opengraph-image.tsx) both call it. Inter is fetched at build with a fallback to the bundled font. 630px is a hard ceiling and satori does not reflow — the body is word-clamped and chips capped at 5, or the pill row falls off the card.
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

Custom components: [components/logo.tsx](components/logo.tsx) (`< S >` mark, inline SVG), [components/brand-icons.tsx](components/brand-icons.tsx) (GitHub/LinkedIn — lucide-react v1 removed brand marks), [components/faq.tsx](components/faq.tsx), [components/animated-section.tsx](components/animated-section.tsx), [components/contact-form.tsx](components/contact-form.tsx), [components/theme-toggle.tsx](components/theme-toggle.tsx), [components/site-header.tsx](components/site-header.tsx), [components/site-footer.tsx](components/site-footer.tsx), [components/project-media.tsx](components/project-media.tsx).

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
- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_FORMSPREE_URL` are defined in `.env`
- ESLint is pinned to **v9**; v10 crashes `eslint-plugin-react` via `eslint-config-next`
- `tsconfig.json` targets ES2022 (ES5 broke `Set` iteration)

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
| `security-reviewer` | After touching a route handler, the contact form, a `dangerouslySetInnerHTML`, or any env var |
| `seo-reviewer` | After touching metadata, JSON-LD, sitemap, robots, an `llms.txt` route, or an OG image |
| `sync-claude-md` | After significant codebase changes — keeps this file up to date |

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

## Project memory

Persistent knowledge lives in
`~/.claude/projects/-home-shafin-ahmed-dev-projects-portfolio/memory/` — `MEMORY.md` is a
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
`pnpm lint && pnpm build`.

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

- Only `.env` is used. Keep it in sync when adding new keys.
- Current keys: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORMSPREE_URL`

# Hooks (`.claude/settings.json`)

- `PreToolUse` on `Edit|Write` blocks edits to any lockfile.
- `PostToolUse` on `Edit|Write` runs the local `prettier` on `.ts`/`.tsx`/`.css` — a no-op
  until prettier is installed locally (`pnpm format` currently resolves it via `dlx`).
- State-changing git commands are denied at the permission layer, not just by convention.

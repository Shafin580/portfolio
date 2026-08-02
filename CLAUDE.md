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

### Single-page portfolio
[app/page.tsx](app/page.tsx) renders the whole site. It is an **async Server Component** — do not add `"use client"` to it.

**All content lives in [lib/portfolio-data.ts](lib/portfolio-data.ts)**, not in the page: `profile`, `experience`, `projects`, `skills`, `navLinks`, `education`, `certification`, `faqs`. Four consumers read from it (page render, JSON-LD graph, `/llms.txt`, the OG image), so editing content means editing that one file. Never re-inline data into a component.

### Live-link health checks
[lib/link-status.ts](lib/link-status.ts) pings every project's `live` URL at build time; the Live button and the schema.org `url` only render when the ping succeeds. Failure handling is deliberate — only DNS failure / connection refused / 4xx-5xx count as dead; timeouts **fail open** so a flaky build network cannot strip every Live button. Results cache for 24h via `next: { revalidate }` plus `export const revalidate = 86400` on the page (the two must be kept in sync by hand — Next requires a literal there).

### SEO / AEO / GEO
- [app/layout.tsx](app/layout.tsx) — `Metadata` + `viewport`. Canonical origin comes from [lib/site.ts](lib/site.ts) (`SITE_URL`, trailing slash stripped); never hardcode a domain.
- [lib/structured-data.ts](lib/structured-data.ts) — a linked schema.org `@graph` (Person, Organization, WebSite, ProfilePage, ItemList, FAQPage). **Rendered as a plain `<script type="application/ld+json">` in `app/page.tsx`** — do NOT move it to `next/script`, which only injects after hydration and is invisible to crawlers.
- [app/opengraph-image.tsx](app/opengraph-image.tsx) — dynamic 1200×630 card via `ImageResponse`; [app/twitter-image.tsx](app/twitter-image.tsx) re-exports it. Inter is fetched at build with a fallback to the bundled font.
- [app/llms.txt/route.ts](app/llms.txt/route.ts) — plain-text brief for LLM crawlers, generated from `lib/portfolio-data.ts`.
- [app/robots.ts](app/robots.ts) — explicitly allows every named AI crawler.

### Component library
ShadCN UI (new-york style, Tailwind v4 native) lives in `components/ui/`, imported via `@/components/ui/<name>`. Only the 15 components actually used are present — add more with `pnpm dlx shadcn@latest add <name>`. Radix comes from the **unified `radix-ui` package**, not per-component `@radix-ui/react-*`.

Custom components: [components/logo.tsx](components/logo.tsx) (`< S >` mark, inline SVG), [components/brand-icons.tsx](components/brand-icons.tsx) (GitHub/LinkedIn — lucide-react v1 removed brand marks), [components/faq.tsx](components/faq.tsx), [components/animated-section.tsx](components/animated-section.tsx), [components/contact-form.tsx](components/contact-form.tsx), [components/theme-toggle.tsx](components/theme-toggle.tsx).

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
| `sync-claude-md` | After significant codebase changes — keeps this file up to date |

## Skills (auto-loaded into relevant agents)

| Skill | What it enforces |
|-------|-----------------|
| `frontend` | ShadCN imports, `cn()` usage, dark mode tokens, no inline styles, `"use client"` rules |
| `code-review` | Structured review checklist and report format |
| `code-review-graph` | When and how to use the MCP knowledge graph instead of Grep/Read |
| `git` | Never run git commands — user manages all git operations |

## Knowledge graph (MCP: code-review-graph)

**Always use the graph before Grep/Glob/Read** for exploration and impact analysis — it's faster and gives structural context (callers, imports, blast radius) that file scanning cannot.

| Task | Tool |
|------|------|
| Exploring code | `semantic_search_nodes_tool` |
| Impact of a change | `get_impact_radius_tool` |
| Reviewing a diff | `detect_changes_tool` + `get_review_context_tool` |
| Tracing callers/imports | `query_graph_tool` |
| High-level structure | `get_architecture_overview_tool` |

Fall back to Grep/Glob/Read only when the graph doesn't cover what you need.

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

- **Stack:** Next.js 16 (App Router), Tailwind CSS 3, ShadCN UI (Radix UI).
- **ShadCN UI:** All ShadCN components must reside in `./components/ui`. Import via `@/components/ui/<name>`.
- **Global Components:** Place shared/reusable components in `./components`.
- **Styling:** Custom CSS and design token variables go in `./app/globals.css`. Tailwind utility classes only — no inline styles.
- **Class merging:** Always use `cn()` from `./lib/utils` for conditional Tailwind classes.
- **Icons:** Use `lucide-react` exclusively.
- **Types:** Define shared types inline in their component file, or in a dedicated `types.d.ts` at the root if used across multiple files.
- **Dark mode:** Tailwind class-based. Use CSS variable tokens (`bg-background`, `text-foreground`, etc.) — never hardcoded color values.

# Environment Variables

- Only `.env` is used. Keep it in sync when adding new keys.
- Current key: `NEXT_PUBLIC_SITE_URL`

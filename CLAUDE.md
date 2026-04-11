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
All portfolio content lives in [app/page.tsx](app/page.tsx). Projects and skills are defined as inline constants (`projects` array, `skills` object) at the top of that file — there is no CMS or external data source.

### App Router layout
[app/layout.tsx](app/layout.tsx) sets global metadata (title, description, Open Graph, Twitter cards), applies the Inter font, and imports `app/globals.css`. The root URL is `https://shafinwebology.com`.

### Component library
ShadCN UI components live in `components/ui/` and are imported via the `@/components/ui/<name>` path alias. The `@/*` alias resolves to the project root (configured in `tsconfig.json`).

### Key utilities
- `cn()` in [lib/utils.ts](lib/utils.ts) — always use this for merging Tailwind classes conditionally (combines clsx + tailwind-merge)
- [hooks/use-toast.ts](hooks/use-toast.ts) — custom toast hook (reducer-based); `sonner` is also installed as an alternative

### Styling
- Tailwind CSS 3 with class-based dark mode
- Design tokens (`background`, `foreground`, `primary`, etc.) are CSS variables defined in [app/globals.css](app/globals.css)
- `tailwindcss-animate` provides animation utilities

### Notable config
- [next.config.ts](next.config.ts): `images: { unoptimized: true }` — Next.js Image optimization is disabled; images are served as-is from `public/`
- `pnpm start` runs on port **8080**, not the default 3000
- `NEXT_PUBLIC_SITE_URL` env var is defined in `.env`

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

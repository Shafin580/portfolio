---
name: learn
description: Capture implementation learnings from the conversation into the project's persistent memory as structured, categorized, tagged files. Use when the user runs /learn, says "remember this", "capture this decision", "log this learning", or after a nontrivial bug fix, architecture decision, or tooling change that should survive beyond this session.
---

# /learn — Capture Project Knowledge

Turn what was just figured out into a memory a future session will actually find.

## Where It Goes

Everything this skill writes lands in the project's Claude memory directory:

```
~/.claude/projects/-Users-shafin-dev-projects-portfolio/memory/
  MEMORY.md          # one-line index, loaded into context every session
  <slug>.md          # one memory per file
```

This is the **only** knowledge store for this repo. The `learn` and `knowledge` agents
read and write the same directory — never introduce a second location (no
`.planning/learnings/`, no repo-local knowledge folder).

Fast corrections that only matter to the current workflow go to `tasks/lessons.md`
instead — see *What Not to Capture* below.

## Behavior

### 1. Extract Learnings from Context

Scan the **entire** conversation, not just the last few messages, for:

| Category | What counts |
|---|---|
| **architecture** | Route organization, data flow, component hierarchy, rendering-boundary decisions (server vs client), where content lives |
| **implementation** | Component and hook patterns, type-safety patterns, error handling, form handling, data fetching, reusable utilities |
| **tooling** | CLI commands that worked, config changes, build scripts, environment setup, deploy steps |
| **performance** | Optimizations, bundle-size wins, LCP/image work, caching and revalidation strategy |
| **security** | Input validation, sanitization, secret handling, vulnerabilities fixed |
| **debugging** | Errors hit and their fixes, gotchas, root causes, workarounds |
| **process** | Workflow improvements, review practices, documentation approaches |
| **other** | Third-party integration insights, library gotchas, migration experience, deprecated patterns to avoid |

### 2. Auto-Categorize

Match the learning against these signals; a learning may span several categories — record
the most specific one first.

- **architecture** — route/routing/navigation · architecture/design pattern/system design ·
  component hierarchy/data flow · server component/client boundary · single source of truth
- **implementation** — hook/useEffect/useState · component/jsx/tsx · type/interface/generic ·
  form/validation/zod/react-hook-form · fetch/data loading
- **tooling** — command/cli/pnpm · config/env · build/bundler/turbopack · deploy/docker
- **performance** — performance/optimize · cache/revalidate/memoize · lazy load/code split/bundle
- **security** — security/auth · xss/csrf/injection · sanitize/validate input · secrets
- **debugging** — error/bug/fix/debug · issue/troubleshoot · gotcha/mistake · workaround
- **process** — workflow/practice · review · documentation · skill/knowledge

### 3. Auto-Generate Tags

Extract from technology names, library names, pattern names, problem types, and feature
areas. Format: lowercase, hyphenated, specific.

Good: `tailwind-v4`, `oklch-tokens`, `server-components`, `json-ld`, `isr-revalidate`,
`link-status`, `hydration-error`
Bad: `frontend`, `misc`, `bug`

### 4. Generate a Title and Slug

- Imperative and specific: "Use `var(--token)` directly, never wrapped in `hsl()`"
- Include the key technology
- Max 60 characters
- Slug = kebab-case of the title, e.g. `oklch-tokens-never-wrap-in-hsl`

### 5. Write the Memory File

`memory/<slug>.md`:

```markdown
---
name: <slug>
description: <one line — this is what /knowledge matches against, make it searchable>
metadata:
  type: project | feedback | reference | user
---

<The fact, stated plainly.>

**Why:** <the reason it is true here — tradeoffs, what was tried and failed>
**How to apply:** <what a future session should actually do>

Captured: <YYYY-MM-DD> · Tags: `tag-one`, `tag-two`
Related: [[other-memory-slug]]
```

Rules:
- `type: project` for ongoing work, goals, constraints. `feedback` for guidance the user
  gave about how to work (always include **Why**). `reference` for pointers to external
  resources. `user` for who the user is.
- **Absolute dates only** (`2026-08-04`), never "yesterday" or "last week".
- Link related memories with `[[slug]]`. A link to a memory that does not exist yet is
  fine — it marks something worth writing later.

### 6. Update the Index

Append one line to `MEMORY.md`:

```
- [Title](slug.md) — one-line hook
```

`MEMORY.md` is the index that loads every session. One line per memory, no frontmatter,
never the memory content itself. Keep it under 200 lines.

### 7. Deduplicate Before Writing

1. Read `MEMORY.md` and look for an entry on the same topic.
2. If one exists, **update that file** — do not create a near-duplicate.
3. If the new information contradicts the old, the old file was wrong: rewrite it and note
   what changed. Delete memories that turn out to be false.

### 8. Confirm

```
Learned: [Title]
File: memory/<slug>.md
Category: <category> · Tags: <tags>
```

## Auto-Learning Mode

Capture without an explicit `/learn` when all of these hold:

- A nontrivial problem was solved after real investigation
- The solution is not obvious from reading the code afterwards
- It will apply again to future work in this repo

Say what was captured in one line; do not narrate the whole process.

## Quality Filters

**Capture:**
- Decisions with a rationale ("we chose X over Y because Z")
- Gotchas that cost time and would cost it again
- Patterns established for this repo specifically
- Constraints not derivable from the code itself

**Do NOT capture:**
- Anything the repo already records — code structure, git history, `CLAUDE.md` content,
  the rules in `.claude/skills/`
- Standard library or framework usage documented upstream
- One-off fixes with no reuse value
- Anything that only matters inside the current conversation
- Secrets, `.env` values, or personal data — never

If the user asks to remember something in the "do not capture" list, ask what was
non-obvious about it and capture *that* instead.

## Examples

**Good** — "Design tokens are `oklch()`, so `hsl(var(--border))` renders nothing. Consume
`var(--border)` directly. Cost an hour on `.hero-grid` because it fails silently with no
console error."

**Bad** — "Used Tailwind for styling." (No decision, no rationale, no reuse value.)

## Rules

- **NEVER** run a state-changing git command. Read-only git (`log`, `show`, `blame`) is
  useful for dating a decision against real history.
- One fact per file. Do not accumulate unrelated facts in one memory.
- Write the file first, then the `MEMORY.md` pointer — never the pointer alone.

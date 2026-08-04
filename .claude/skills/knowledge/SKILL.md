---
name: knowledge
description: Search and retrieve previously captured learnings from this project's Claude memory directory. Use when the user runs /knowledge, asks "have we solved this before", "what did we decide about X", "why did we choose Y", or before implementing anything — to recall project-specific decisions, patterns, and past bug fixes instead of re-solving them from scratch.
---

# /knowledge — Retrieve Project Knowledge

Read side of the knowledge system. The write side is the `learn` skill.

## Where to Look

```
~/.claude/projects/-home-shafin-ahmed-dev-projects-portfolio/memory/
  MEMORY.md          # one-line index, already in context every session
  <slug>.md          # one memory per file
```

Plus, in descending priority:

| Priority | Location | Contents |
|---|---|---|
| 1 | `memory/MEMORY.md` | index — scan first, it is already loaded |
| 2 | `memory/*.md` | the memories themselves |
| 3 | `.claude/skills/**/*.md` | codified conventions (rules, not history) |
| 4 | `tasks/lessons.md`, `tasks/plans/*.md` | corrections and past implementation plans |

There is no knowledge-graph tier in this repo. Files are the primary and only path.

## When to Retrieve

### Explicit triggers
- "what's our pattern for…", "how did we handle…", "what was decided about…", "why did we
  choose…", "have we hit this before"
- The user references work from a prior conversation

### Auto-invoke before implementation (MANDATORY)
Before **any** implementation task:
1. Scan `MEMORY.md` for anything touching the area about to change.
2. Open the matching memory files.
3. Apply what you find silently — only surface it when it changes the approach.

## Behavior

### 1. Parse the Query

Pull out:
- **Topic** — the subject area (styling, SEO, link checks, components, build config)
- **Keywords** — technologies, file names, symbol names
- **Category** — architecture · implementation · tooling · performance · security ·
  debugging · process · other
- **Intent** — decision ("why did we…"), pattern ("how do we…"), problem ("how did we fix…"),
  or browse ("what do we know about…")

### 2. Search

1. **`MEMORY.md` first** — its one-line hooks are written to be matched against.
2. **Grep the memory dir** for keywords and tags:
   ```bash
   rg -il '<keyword>' ~/.claude/projects/-home-shafin-ahmed-dev-projects-portfolio/memory/
   ```
3. **Read the hits.** Memory files are small; read them whole.
4. **Widen only if empty** — try synonyms, then the tag line, then `.claude/skills/` and
   `tasks/`.

### 3. Rank

Sort by, in descending weight:

1. Title/`name` matches the primary keyword (highest)
2. Tag match
3. Category match
4. Body keyword matches (each additional match adds a little)
5. Recency — newer memories break ties
6. Intent match — for a "why did we choose" query, prefer memories containing a rationale

### 4. Present Results

**When the user asked explicitly:**

```markdown
Found [N] relevant memories:

**1. [Title]** (<category>)
   Captured: YYYY-MM-DD
   [1-2 sentence key insight]
   - [key point]
   - [key point]
   Tags: `tag1`, `tag2`
   File: memory/<slug>.md
```

More than 5 hits: show the top 5, then "… and N more" plus a narrower query suggestion.

**Nothing found:**

```markdown
No existing knowledge found for "[query]".

Available categories: architecture, implementation, tooling, performance, security,
debugging, process, other. Use `/learn` to capture this once it is solved.
```

**When auto-retrieving before implementation:** do not print a report. Integrate it:
> "Our established pattern here is X, so I'll…"

Surface the lookup explicitly only when:
- The retrieved pattern conflicts with what the user is asking for
- A recorded gotcha directly threatens the current task

### 5. Show Context

When presenting a specific memory, include when it was captured, what it was decided
against, and any `[[linked]]` memories worth reading next.

## Special Queries

| Query | Behavior |
|---|---|
| `/knowledge` (bare) | Summarize `MEMORY.md` — counts by category, most recent entries |
| `/knowledge all` | List every memory, title + one-line hook |
| `/knowledge recent` | Last 10 by capture date |
| `/knowledge category:<name>` | Everything in one category |
| `/knowledge <topic>` | Standard ranked search |

## Rules

- **NEVER** run a state-changing git command. Read-only git is fine.
- **NEVER** modify memory files — this skill is READ-ONLY. Use `learn` to write.
- **A memory records what was true when written.** If it names a file, function, or flag,
  verify that still exists in the code before recommending it. When memory and current
  code disagree, trust the code and flag the stale memory for `learn` to fix.
- Never invent a memory. If nothing was found, say nothing was found.

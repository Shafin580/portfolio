---
name: karpathy-guidelines
description: Scope, simplicity, and stopping discipline for any change in this portfolio — think before coding, simplicity first, surgical diffs, verifiable success criteria. Read BEFORE starting an implementation, refactor, or bug fix, and whenever a change is about to touch code the request did not name. Triggers on "am I overengineering", "keep the diff small", "scope creep", "is this done".
---

# Karpathy Coding Guidelines (adapted)

**Boundary — read this first.** This skill owns *how much* to do and *when you may stop*.
It restates no conventions: `frontend` owns components and styling, `seo` owns metadata and
JSON-LD, `ui-ux-quality` owns the numbers, `code-review` owns the review checklist. Where
one of those states a MUST, it wins — this skill only decides how far the diff may reach
around it.

These rules bias caution over speed. On a trivial task use judgment, not ceremony.

## 1. Think before coding

Do not assume. Do not hide confusion. Surface tradeoffs.

- State the assumption in one line and proceed. Stop and ask only when two readings of the
  request would produce materially different work.
- If a simpler approach exists, say so before building the complicated one.
- Name what is confusing instead of guessing past it.

### In this repo

- Content edits fan out. `lib/portfolio-data.ts` has six consumers — the page render, the
  case-study pages, the JSON-LD graph, both `llms.txt` routes, the build-time social cards,
  the sitemap. Before editing content, say which of those you expect to change.
- The contact pipeline is the site's only public write path. An assumption there is a
  security assumption — state it explicitly, never silently.
- If a dependency or a new component could push the Worker toward the 3 MiB script budget,
  raise it before writing the code, not after `pnpm build:cf` fails.

## 2. Simplicity first

The minimum code that solves the asked problem. Nothing speculative.

- No feature beyond what was asked.
- No abstraction for a single call site.
- No "flexibility" or configurability nobody requested.
- No error handling for impossible states.
- If 200 lines could be 50, rewrite it.

Test: would a senior engineer call this overcomplicated?

### In this repo

- This is a single-page portfolio with case-study routes. There is no state library and no
  data layer — do not introduce one.
- Reach for an installed ShadCN primitive before writing a component. A new component is
  justified only when no primitive fits.
- Do not add a config knob to `lib/portfolio-data.ts` to serve one page.

## 3. Surgical changes

Touch only what you must. Clean up only your own mess.

- Do not "improve" adjacent code, comments, or formatting.
- Do not refactor what is not broken. Match the style already there.
- Report unrelated dead code; do not delete it.
- Do remove the imports, variables, and functions **your** change orphaned.

Test: every changed line traces directly to the request.

### In this repo

- A `PostToolUse` hook runs `prettier` on every `.ts` / `.tsx` / `.css` you write. Never
  hand-reformat a file to "fix" its style — that noise lands in the diff, not the hook's.
- Editing a page does not license editing `scripts/generate-og.tsx`, the sitemap, or
  `lib/portfolio-data.ts`. If one of them genuinely must change, say so and change only it.
- Do not reflow prose or renumber sections in `CLAUDE.md` while adding a line to it.

## 4. Goal-driven execution

Define the success criterion first, then loop until it is met. Weak criteria ("make it
work") force clarification round-trips; strong ones let the work close itself.

- "Add validation" becomes "invalid input is rejected at the schema, and the form shows the
  message".
- "Fix the bug" becomes "reproduce it from the described input, then show the input no
  longer produces it".
- For a multi-step task, write the steps to `tasks/todo.md` with a `verify:` line each.

### Proof in this repo

`npx tsc --noEmit` + `pnpm lint` on changed files, plus `pnpm build` when a route or
metadata changed. Add `pnpm build:cf` when the Worker bundle could grow.

**There is no test suite here.** Do not invent one to satisfy a success criterion, and do
not run a suite unless the user asks. List every check you did not execute as a manual
step in your summary.

## Precedence

### What these four narrow

- **Demand Elegance** (*Agent Behavior & Execution Rules*) — elegance applies inside the
  surface the request already touches. It is not a licence to rewrite working adjacent code.
- **Autonomous Bug Fixing** — state the assumption and fix it. Stop only when two readings
  imply materially different fixes.
- **Verification Before Done** — the proof is the command above, not a test run.
- **No Laziness** — root cause decides *what* to fix; *Surgical changes* decides how far
  the diff may reach.

### What outranks these four

- The repo invariants: the contact-gate order, `esc()` on every interpolated request value
  in email, JSON-LD as a plain `<script>` in the HTML crawlers receive, and the 3 MiB
  script budget.
- The `seo` skill, which is the authority on SEO/AEO/GEO/OG wherever it overlaps.
- The `frontend` skill's MUST rules, and the `git` policy.

Simplicity never justifies skipping one of these. If a required invariant makes the change
bigger, the change gets bigger.

## Before you deliver — self-check

1. Does every changed line trace to something the user asked for?
2. Did I add an abstraction, option, or guard that has exactly one caller and no requester?
3. Did I reformat, rename, or delete anything the request did not name?
4. Did I state my success criterion, and does the proof above actually pass?
5. Which checks did I not run — and did I say so?

## Attribution

Adapted from the Karpathy LLM-coding guidelines (MIT) —
<https://github.com/multica-ai/andrej-karpathy-skills>, derived from Andrej Karpathy's
observations on LLM coding pitfalls.

# Incorporate Karpathy guidelines into portfolio + 2 agentic templates

## Context

[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (MIT) packages four behavioral rules derived from Karpathy's observations on LLM coding pitfalls: **Think Before Coding**, **Simplicity First**, **Surgical Changes**, **Goal-Driven Execution**. Upstream ships them three ways — a drop-in `CLAUDE.md`, a `karpathy-guidelines` skill, and a plugin.

The problem it addresses is real in these three repos: all have rich convention skills (`frontend`, `backend`, `seo`) that say *how* to write code, and none say *how much* to write or *when to stop*. Diff-scope discipline is unowned.

Straight `cat >> CLAUDE.md` would be wrong here — it would duplicate rules that already exist and contradict three standing rules. Decided approach: **skill file + a compact always-on block merged into each `CLAUDE.md`**, text adapted per repo, with explicit precedence over the rules it clashes with.

Confirmed conflicts to resolve, not append past:

| Upstream principle | Clashes with | Resolution |
|---|---|---|
| "stop and ask when uncertain" | standing rule to answer directly / act | state the assumption in one line and proceed; block only when two readings imply materially different work |
| "write a failing test, loop until it passes" | standing rule: don't execute test suites unless asked; portfolio has **no test suite** ([portfolio/CLAUDE.md:25-26](portfolio/CLAUDE.md#L25-L26)) | success criteria stay mandatory; the loop exits on each repo's already-documented proof rule — **never reprint a verification command**, defer to it |
| "don't refactor what isn't broken" | portfolio **Demand Elegance** ([portfolio/CLAUDE.md:286](portfolio/CLAUDE.md#L286)) | elegance applies only inside the surface the request already touches |

Findings that shape the plan (from adversarial verification of the design):

- **portfolio's Skills table is documentation only.** Skills reach subagents through agent frontmatter (`skills:` list in [portfolio/.claude/agents/frontend.md:6-9](portfolio/.claude/agents/frontend.md#L6-L9), same in `code-review.md`, `qa.md`). A table row loads nothing. Editing 5 agent files is out of scope — so the row is documentation and must not claim "auto-loaded".
- **`.claude/skills/local-llm/` does not exist in any of the three repos** (it is global). No skill body may reference it.
- **No CLAUDE.md line numbers inside skill bodies** — portfolio's `sync-claude-md` agent ([portfolio/CLAUDE.md:232](portfolio/CLAUDE.md#L232)) rewrites the file. Cite rule names and section headings.
- portfolio's table header is `| Skill | What it enforces |`; the other two are `| Skill | When |`. Row prose differs accordingly.
- All three repos are clean on `main` with `.claude/skills/` git-tracked.

## Files touched

Two new-or-edited files per repo, plus one new skill file. Nothing else.

| Repo | New | Edited |
|---|---|---|
| `portfolio` | `.claude/skills/karpathy-guidelines/SKILL.md` | `CLAUDE.md` (3 spots) |
| `agentic-nestjs-project-template` | `.claude/skills/karpathy-guidelines/SKILL.md` | `CLAUDE.md` (3 spots) |
| `agentic-nextjs-project-template` | `.claude/skills/karpathy-guidelines/SKILL.md` | `CLAUDE.md` (3 spots) |

## 1. Canonical CLAUDE.md block

Identical wording in all three, only the bracketed fills vary. Sentence-case bold leads, no attribution (that lives in the skill), **no reprinted verification command**.

```markdown
- **Think before coding.** State the assumption in one line and proceed. Stop and ask only when two readings of the request would produce materially different work. Say so when a simpler approach exists, and name what is confusing instead of guessing past it.
- **Simplicity first.** The minimum code that solves the asked problem — nothing speculative, no feature that was not requested, no abstraction for a single call site, no unrequested configurability, no error handling for impossible states. If 200 lines could be 50, rewrite. Test: would a senior engineer call this overcomplicated?
- **Surgical changes.** Touch only what the request touches, and match the style already there. Do not reformat, rename, or refactor adjacent working code — report it instead. Do remove the imports, variables, and functions your own change orphaned. Test: every changed line traces to the request.
- **Goal-driven execution.** Name the verifiable success criterion before editing, then loop until it passes. {PROOF_CLAUSE}
- **Precedence.** These four decide how far a change may reach. {NARROWED} apply only inside the surface the request already touches; {WINNING} still outrank them. On a trivial task use judgment, not ceremony. Long form and examples: the `karpathy-guidelines` skill.
```

### Fills

**portfolio** — `{PROOF_CLAUSE}`: `The loop exits on the verification rule at the top of this file plus a read of the diff. There is no test suite in this repo; list every check you did not execute as a manual step.`
`{NARROWED}`: `*Demand Elegance*, *Autonomous Bug Fixing*, and *Verification Before Done* under **Agent Behavior & Execution Rules**`
`{WINNING}`: `the repo invariants — the contact-gate order, `esc()`, JSON-LD as a plain `<script>`, the 3 MiB script budget — and the `seo` skill's authority`

**agentic-nestjs-project-template** — `{PROOF_CLAUSE}`: `The loop exits on the proof rule above, including its `pnpm test` clause for logic changes — do not add checks beyond it, and list every check you did not execute as a manual step.`
`{NARROWED}`: `the `brainstorming` skill's scope pushback and the heavy-tools rule under **Cross-cutting rules**`
`{WINNING}`: `the `backend` skill's MUST rules, the auth/guard, validation and dual-surface rules under **Cross-cutting rules**, and the `git` policy`

**agentic-nextjs-project-template** — `{PROOF_CLAUSE}`: `The loop exits on the proof rule above plus a read of the diff. Write tests where the `frontend` skill requires them, run a suite only when the user asks, and list every check you did not execute as a manual step.`
`{NARROWED}`: `the `ui-auditor`, `frontend-design`, and `ui-ux-quality` skills`
`{WINNING}`: `the `frontend` skill's mandatory component contracts, the i18n and SEO rules under **Cross-cutting rules**, and the `git` policy`

## 2. Per-repo edits

### portfolio/CLAUDE.md — 3 edits, apply **bottom-up** (line numbers shift otherwise)

1. **Replace lines 300-301** (inside the existing `# Core Principles`, heading at 298 stays):
   - current: the one-line `**Simplicity First:**` bullet and the `**No Laziness:**` bullet
   - new: the 4 principle bullets, then `**No Laziness:**` **verbatim unchanged**, then the Precedence bullet. Fold nothing, delete nothing repo-original.
   - Precedence bullet gains one extra clause here: `*No Laziness* decides what to fix; *Surgical changes* decides how far the diff may reach.`
2. **Insert after line 287** (end of `# Agent Behavior & Execution Rules`, after the `Autonomous Bug Fixing` bullet) — a **one-line pointer only**, not a second copy of the rules:
   `- **Precedence:** *Core Principles* below outrank this section wherever they disagree — see that section for how.`
   Reason: an agent reads top-down and hits this section 18 lines before `# Core Principles`.
3. **Insert a table row after line 240** (the `|-------|-----------------|` separator) as **row 1, not appended**. Appending after line 252 would falsify the prose at 254-257, which counts the last four rows.
   `| \`karpathy-guidelines\` | Scope and stopping discipline — think before coding, simplicity first, surgical diffs, verifiable success criteria, and their precedence over the elegance and bug-fix rules |`

No third-edit equivalent: portfolio has no `## After auto-compact` section.

### agentic-nestjs-project-template/CLAUDE.md — 3 edits, bottom-up

1. **Insert the 5 bullets after line 25** (end of `## Behavior`). Do **not** restate line 24's command.
2. **Line 49** — add to the parenthetical: `(backend / mcp-builder / code-review / git / karpathy-guidelines)`.
3. **Append a table row after line 78** (`## Skills`, header `| Skill | When |` at 65):
   `| \`karpathy-guidelines\` | Before any implementation, and whenever another skill would widen the diff |`

### agentic-nextjs-project-template/CLAUDE.md — 3 edits, bottom-up

1. **Insert the 5 bullets after line 21** (end of `## Behavior`). Do **not** restate line 20's command.
2. **Line 45** — add to the parenthetical: `(frontend / git / code-review / karpathy-guidelines)`.
3. **Append a table row after line 74** (the `frontend-design` row; header `| Skill | When |` at 61):
   `| \`karpathy-guidelines\` | Before any implementation, and whenever another skill would widen the diff |`

## 3. The skill file

Path in each repo: `.claude/skills/karpathy-guidelines/SKILL.md`. Match house voice per repo (portfolio → `seo`/`frontend`; nestjs → `backend`; nextjs → `ui-ux-quality`).

Frontmatter: `name` + `description` only — no other SKILL.md in these dirs carries `license`, `allowed-tools`, or a URL. Shape matches existing "does X — use when Y" descriptions ([portfolio/.claude/skills/code-review/SKILL.md](portfolio/.claude/skills/code-review/SKILL.md), [nestjs .../brainstorming/SKILL.md](agentic-nestjs-project-template/.claude/skills/brainstorming/SKILL.md)):

```yaml
---
name: karpathy-guidelines
description: Scope, simplicity, and stopping discipline for any change in this repo — think before coding, simplicity first, surgical diffs, verifiable success criteria. Read before starting an implementation, refactor, or bug fix, and whenever a change is about to touch code the request did not name. Triggers on "am I overengineering", "keep the diff small", "scope creep", "is this done".
---
```

Body headings — **identical set and order in all three**:

```
# Karpathy Coding Guidelines (adapted)
    Boundary paragraph: this skill owns HOW MUCH and WHEN TO STOP; it restates no
    conventions. One-line tradeoff note: biases caution over speed.
## 1. Think before coding      → ### In this repo
## 2. Simplicity first         → ### In this repo
## 3. Surgical changes         → ### In this repo
## 4. Goal-driven execution    → ### Proof in this repo   (the command, stated ONCE, only here)
## Precedence
    ### What these four narrow
    ### What outranks these four
## Before you deliver — self-check   (5 questions)
## Attribution                       (MIT + upstream URL)
```

Hard constraints on the body:

- **Zero CLAUDE.md line numbers.** Cite rule names and section headings only.
- The verification command appears **once** in the whole skill, under §4.
- No reference to `local-llm` (absent from all three repos).
- nestjs: the description must state the boundary against `brainstorming`, which already owns pre-code YAGNI pushback.
- nextjs: the body must state that `frontend` **wins** over Simplicity First — its mandatory component contracts are the spec, not polish.

Vary per repo: the `### In this repo` bodies, `### Proof in this repo`, and the two precedence lists. Do not vary: heading set/order, the four principle statements, the self-check questions, the Attribution wording.

## 4. Deliberately not doing

- **Not** installing the upstream plugin (would duplicate the per-repo skill and drift).
- **Not** copying upstream `EXAMPLES.md` into `references/`. Its examples are generic TS, not repo-specific; add later only if the skill proves too abstract in use.
- **Not** editing agent frontmatter `skills:` lists (5 files in portfolio) — out of scope.
- **Not** touching the stale local-model sections ([nestjs/CLAUDE.md:27-45](agentic-nestjs-project-template/CLAUDE.md#L27-L45), [nextjs/CLAUDE.md:23-41](agentic-nextjs-project-template/CLAUDE.md#L23-L41)) — both still document `google/gemma-4-12b-qat` via raw `curl` with `temperature:0.2`, contradicting the global `local-llm` skill. Flagged for a separate pass.
- **Not** reconciling portfolio's two existing copies of its verification rule (lines 25-26 vs 275-276, `+` vs `&&`) — unrelated.
- **Not** committing. Per each repo's `git` skill, the user commits.

## Verification

No build or test run — these are markdown-only changes in three repos with no test suite in the loop.

1. `git -C <repo> status --porcelain` → exactly 2 paths per repo: `CLAUDE.md` and `.claude/skills/karpathy-guidelines/SKILL.md`. Any third path is a scope violation.
2. `git -C <repo> diff CLAUDE.md` → read every hunk; confirm no pre-existing line was deleted except portfolio's two `# Core Principles` bullets (one replaced, one re-emitted verbatim).
3. Anchor re-check after edits, per repo:
   `grep -n "karpathy-guidelines" CLAUDE.md` → 2 hits in portfolio (Precedence pointer + table row), 3 in each template (bullets pointer + after-auto-compact list + table row).
4. Table integrity: `grep -c '^| ' CLAUDE.md` before/after → +1 per repo. In portfolio confirm the prose at ~254-257 still correctly describes the **last four** rows.
5. Frontmatter parses and the skill is discoverable: start a fresh Claude Code session in each repo and confirm `karpathy-guidelines` appears in the available-skills list; or `head -5 .claude/skills/karpathy-guidelines/SKILL.md` and check `name:`/`description:` are single-line YAML.
6. `grep -n "tsc\|pnpm lint\|pnpm test" CLAUDE.md` → confirm the count of verification-command mentions is **unchanged** from before the edit in all three files (the block defers, never reprints).
7. Contradiction check, nestjs only: confirm nothing in the new block tells the agent to skip `pnpm test`, since line 24 mandates it for logic changes.

## Notes

Written to `~/.claude/plans/` because plan mode fixes that path. Per `/Users/shafin/CLAUDE.md`, on execution copy this to each repo's `tasks/plans/karpathy-guidelines.md` (portfolio) / `.claude/tasks/plans/karpathy-guidelines.md` (both templates) so it travels with the code.

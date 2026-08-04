---
name: git
description: Policy for any git usage in this project. Read before running any git command. Covers which git operations are allowed (read-only) and which are never permitted (anything that mutates the repo), and how to hand work off for the user to commit.
---

# Git Policy

## Rules (MUST follow)

### No State-Changing Git Actions — Ever

**NEVER run any git command that changes repo state.** This includes (not exhaustive):

- `git add`
- `git commit`
- `git push`
- `git checkout` / `git switch`
- `git reset`
- `git stash`
- `git merge`
- `git rebase`
- `git tag`
- `git config`
- `git clean`
- Any other git subcommand that mutates the working tree, index, refs, or config

The user manages all git operations manually. Agents may edit files on disk and stop there — never stage, commit, push, or otherwise mutate the repo.

### Read-Only Git Is Allowed — and Encouraged

Read-only git commands are safe for analysis and should be used freely:

- `git status`
- `git diff`
- `git log`
- `git show`
- `git blame`

Use these to understand current changes, history, and context before and after making edits. Scoping a review with `git diff` is far cheaper than re-reading whole files.

### What to Do Instead of Committing

After making file changes:

1. List the changed files (from `git status` / `git diff --stat`).
2. Tell the user what to commit and why.
3. If a commit message is wanted, use the `commit-message-generator` skill to compose one — that skill also never runs `git commit`. It hands the user a ready-to-run message; the user commits it themselves.

> "Files updated on disk — ready for you to commit when you like."

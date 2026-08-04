---
name: commit-message-generator
description: Compose a detailed, human-readable, emoji-rich git commit message organized by category, for the user to review and run themselves. Use when the user says "commit", "generate commit message", "commit message", "write a commit", "describe my changes", or any request to compose a git commit message for staged or unstaged changes. Never stages or commits — see the `git` skill for that boundary.
---

# Commit Message Generator

Compose polished, categorized commit messages with personality — for the user to run.

## Workflow

1. Gather all changes (staged + unstaged + untracked)
2. Analyze and categorize each change
3. Compose the commit message
4. Present the message and a copy-paste commit snippet — never commit it yourself

## Step 1: Gather Changes

Run these read-only commands in parallel to collect the full picture:

```bash
git status
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git log --oneline -5
```

If there are untracked files that look relevant, read them to understand what was added.

## Step 2: Analyze & Categorize

Group every change into one of these categories (skip categories with no changes):

| Emoji | Category | Use For |
|-------|----------|---------|
| ✨ | **New Features** | Brand new functionality, components, pages, endpoints |
| 🔧 | **Improvements** | Enhancements to existing features, better UX, extended logic |
| 🐛 | **Bug Fixes** | Fixing broken behavior, correcting logic errors |
| 🎨 | **Styling & UI** | CSS, layout, spacing, visual tweaks, theming, responsive fixes |
| ♻️ | **Refactoring** | Code restructuring without behavior change, cleanup, renaming |
| 📦 | **Dependencies** | Package additions, removals, version bumps |
| 🗃️ | **Data & Models** | Schema changes, type definitions, migrations, seed data |
| 🔒 | **Security** | Auth, permissions, input validation, XSS/CSRF fixes |
| ⚡ | **Performance** | Optimizations, caching, lazy loading, bundle size |
| 🧪 | **Tests** | New tests, test fixes, coverage improvements |
| 📝 | **Documentation** | README, comments, JSDoc, inline docs |
| 🏗️ | **Infrastructure** | CI/CD, Docker, config files, build tooling, env vars |
| 🗑️ | **Removals** | Deleted files, deprecated code, dead code cleanup |

## Step 3: Compose the Message

### Format

```
<title line — imperative, max 72 chars, no emoji>

<blank line>

<category sections>
```

### Title Line Rules

- Imperative mood ("Add", "Fix", "Update" — not "Added", "Fixes")
- Max 72 characters
- No trailing period
- Summarize the most important change or theme
- No emoji in the title line

### Category Section Rules

Each category section follows this format:

```
<emoji> <Category Name>
  - <concise but specific description of change>
  - <another change in this category>
```

### Writing Style

- **Slick & confident** — write like a dev who's proud of clean work
- **Specific** — mention file names, component names, function names when it adds clarity
- **Human** — "Tightened up the sidebar spacing" beats "Modified CSS margin values"
- **Active voice** — "Reworked the auth flow" not "The auth flow was reworked"
- Keep each bullet to one line when possible, two max

### Examples

**Example 1 — Mixed feature + styling work:**

```
Add invoice creation form with validation and layout polish

✨ New Features
  - Wire up InvoiceCreateTab with date pickers, client selector, and attachment upload
  - Add POST endpoint for invoice submissions in API routes

🎨 Styling & UI
  - Tighten card padding and align form grid to 2-col on desktop
  - Swap generic button for Shadcn Button with loading state

🐛 Bug Fixes
  - Fix stale cache on invoice list after a successful submission

♻️ Refactoring
  - Extract shared invoice-field logic into useInvoiceForm hook
```

**Example 2 — Config and cleanup sprint:**

```
Clean up unused deps and harden ESLint config

🗑️ Removals
  - Drop legacy moment.js — all dates now use date-fns
  - Remove dead ProviderLegacy component and its route

🏗️ Infrastructure
  - Add strict TypeScript paths to tsconfig for @/components/ui
  - Enable no-unused-vars rule in shared ESLint config

📦 Dependencies
  - Bump next from 16.0.1 to 16.0.3
  - Add zod-form-data for multipart validation
```

**Example 3 — Single focused fix:**

```
Fix timezone offset bug in audit report date display

🐛 Bug Fixes
  - Normalize all audit timestamps to UTC before rendering in AuditReport.Client
  - Guard against null createdAt in audit row mapper
```

## Step 4: Present

1. Display the composed message in a code block
2. Ask if the user wants to edit anything
3. Provide a copy-paste snippet using a HEREDOC for proper formatting, for the **user** to run:

   ```bash
   git commit -m "$(cat <<'EOF'
   <title line>

   <category sections>
   EOF
   )"
   ```

4. **Never stage or commit anything yourself** — no `git add`, no `git commit`. Composing the message is this skill's whole job; running it is the user's. See the `git` skill for the full policy.
5. If changes span multiple concerns, suggest splitting into separate commits — list which files belong in each proposed commit.
6. If nothing has changed, say so and stop.

### Important

- Never include secrets in the message (`.env` values, tokens, credentials) — respect `.gitignore` and flag anything that looks staged by accident.
- Message content (including whether to add a trailer like Co-Authored-By) is the user's choice — don't impose one.
- If nothing is changed, say so and stop.

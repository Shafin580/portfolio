---
name: code-review
description: Structured review checklist and report format for this portfolio project. Read when reviewing a diff, auditing a file or module, or validating implementation quality before the user commits — it enforces the frontend and git conventions plus the project invariants that fail silently.
---

# Code Review Skill

## Purpose

Structured code review checklist for the portfolio project. Enforces all project conventions from frontend and git skills. Use when reviewing changes or validating implementation quality.

## Review Process

### Step 1: Scope the Review

Identify what changed:
- Look at affected files
- Note the intent: new section, component change, styling fix, config change

### Step 2: Apply the Checklist

---

## Frontend Checklist

### Components
- [ ] Interactive components have `"use client"` directive
- [ ] ShadCN components imported from `@/components/ui/` — not recreated
- [ ] `cn()` from `@/lib/utils` used for conditional Tailwind class merging
- [ ] Icons from `lucide-react`

### Styling
- [ ] Tailwind CSS classes only — no inline styles
- [ ] Uses CSS variable theme tokens — no hardcoded color values
- [ ] Dark mode works correctly (check both themes)
- [ ] Responsive at common breakpoints (mobile, tablet, desktop)

### TypeScript & Quality
- [ ] No `any` types — TypeScript strict compliance
- [ ] No `console.log` left in code
- [ ] No unused imports or variables

### Accessibility
- [ ] Interactive elements are keyboard accessible
- [ ] Images have meaningful `alt` text
- [ ] Buttons and links have descriptive labels

### Post-Change
- [ ] Build passes: `pnpm build`
- [ ] No lint errors: `pnpm lint`

---

## Security Checklist
- [ ] No secrets committed (.env values, API keys, tokens)
- [ ] No XSS vectors (user input rendered with `dangerouslySetInnerHTML` or similar)

---

## SEO / AEO / GEO

If the diff touches `generateMetadata`, `lib/structured-data.ts`, `app/sitemap.ts`,
`app/robots.ts`, an `llms.txt` route, `lib/og-card.tsx`, an `opengraph-image` file, or
content in `lib/portfolio-data.ts`:

- [ ] Read the **`seo` skill** — it is the authority, and several things that look like
      mistakes in that code are documented deliberate decisions
- [ ] Hand the diff to the **`seo-reviewer` agent** rather than improvising SEO advice here
- [ ] Spot-check the two that break silently: a page-level `openGraph` restates `locale`,
      and any `BreadcrumbList` / `FAQPage` matches what the page actually renders

---

## Step 3: Report Format

```markdown
## Code Review: [scope]

### Summary
[1-2 sentence overview of what the changes do]

### Verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION

### Issues Found
#### Critical (must fix)
- [file:line] — [description]

#### Warnings (should fix)
- [file:line] — [description]

#### Suggestions (consider)
- [file:line] — [description]

### Convention Compliance
- Frontend rules: PASS / FAIL ([details])
- Security: PASS / FAIL ([details])

### What's Good
- [positive observations — acknowledge good patterns]
```

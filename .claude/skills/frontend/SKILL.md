---
name: frontend
description: Frontend conventions for this Next.js 16 / React 19 / Tailwind v4 / ShadCN portfolio. Read BEFORE writing or reviewing any component, page, route handler, or styling change — it covers ShadCN imports, `cn()` usage, oklch design tokens, `"use client"` rules, where content must live, and the project invariants that break the site silently if violated.
---

# Frontend Conventions

## Rules (MUST follow)

### Components
- Import ShadCN components from `@/components/ui/` — never recreate what's already there.
  Only the components in use are installed; add more with `pnpm dlx shadcn@latest add <name>`.
- Radix comes from the **unified `radix-ui` package**, never per-component `@radix-ui/react-*`
- Use `"use client"` directive on any component that uses hooks, event handlers, or browser APIs
- Use `cn()` from `@/lib/utils` for all conditional Tailwind class merging
- `app/page.tsx` is an **async Server Component** — do NOT add `"use client"` to it

### Content
- **All portfolio content lives in `lib/portfolio-data.ts`** (`profile`, `experience`,
  `projects`, `skills`, `navLinks`, `education`, `certification`, `faqs`). Four consumers
  read it — the page render, the JSON-LD `@graph`, `/llms.txt`, and the OG image — so
  editing content means editing that one file. **Never re-inline data into a component.**

### Styling
- **Tailwind CSS v4** — there is no `tailwind.config.ts`. All theme config lives in
  `app/globals.css` under `@theme inline`, with `@custom-variant dark (&:is(.dark *))`.
- **Tailwind classes only** — no inline styles, no separate CSS files (except globals.css)
- Use CSS variable theme tokens for colors (`bg-background`, `text-foreground`, `bg-card`, …)
  — never hardcoded values like `bg-gray-900`
- Design tokens are **`oklch()` values**, not HSL triplets. Consume them as `var(--border)`
  directly; wrapping one in `hsl()` renders nothing at all and fails silently.
- `tw-animate-css` provides animation utilities (it replaced `tailwindcss-animate`)
- The hand-written keyframes at the bottom of `globals.css` (hero entrance, float, pulse,
  `[data-animate]` scroll-reveal driven by `AnimatedSection`) are load-bearing — never let
  a codemod or `shadcn add` overwrite them
- `tailwind-merge` must stay on v3+ or `cn()` mis-merges Tailwind v4 class names
- Dark mode via `next-themes` class switching — test both modes

### TypeScript
- Strict mode — no `any` types
- Define types inline or in the component file unless shared across multiple files.
  Shared content types live in `lib/portfolio-data.ts`.
- `tsconfig.json` targets ES2022 (ES5 broke `Set` iteration) — do not lower it

### SEO / AEO / GEO
**Read the `seo` skill before touching any of it** — metadata, JSON-LD, sitemap, robots,
`llms.txt`, or an OG image. It is the authority; the highlights below are here so you know
when to go read it, not as a second copy to keep in sync.

- The JSON-LD `<script type="application/ld+json">` is a plain tag on purpose. **Never move
  it to `next/script`** — that only injects after hydration and is invisible to crawlers.
- Canonical origin comes from `SITE_URL` / `absoluteUrl()` in `lib/site.ts`. Never
  hardcode a domain anywhere.
- `lib/link-status.ts` gates every outbound project link. Its failure classification is
  deliberate: only DNS failure, connection refused, and 4xx-5xx count as dead; timeouts
  **fail open** so a flaky build network cannot strip every Live button.
- A page's `export const revalidate` literal must stay in sync with
  `LINK_CHECK_REVALIDATE` by hand — Next requires a literal there.
- Structured data must match the visible page: a `BreadcrumbList` needs a rendered
  breadcrumb, a `FAQPage` needs the same questions in the accordion.
- `next.config.ts` must not re-enable `output: 'export'` — it would break the ISR the
  link checks depend on.

### Code Quality
- No `console.log` in production code
- Keep components focused — extract logic into a small component or helper when complex
- Prefer editing existing components over creating new files
- Toasts are **sonner** only

### Icons
- Use `lucide-react` (v1) for all icons. Brand marks (GitHub, LinkedIn) come from
  `components/brand-icons.tsx` — lucide v1 removed them.

### Commands
```bash
pnpm dev      # dev server (clears .next, 6 GB memory cap)
pnpm build    # production build — this is the typecheck
pnpm lint     # ESLint (pinned to v9; v10 crashes eslint-plugin-react)
pnpm start    # serve the production build on port 8080, not 3000
```

### Git
**NEVER** run a state-changing git command. Read-only git (`status`, `diff`, `log`,
`show`, `blame`) is allowed. Inform the user what files were modified. See the `git` skill.

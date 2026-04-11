# Frontend Conventions Skill

## Rules (MUST follow)

### Components
- Import ShadCN components from `@/components/ui/` — never recreate what's already there
- Use `"use client"` directive on any component that uses hooks, event handlers, or browser APIs
- Use `cn()` from `@/lib/utils` for all conditional Tailwind class merging

### Styling
- **Tailwind CSS classes only** — no inline styles, no separate CSS files (except globals.css)
- Use CSS variable theme tokens for colors (`bg-background`, `text-foreground`, `bg-card`, etc.) — never hardcoded color values like `bg-gray-900`
- Dark mode via `next-themes` class switching — test both modes

### TypeScript
- Strict mode — no `any` types
- Define types inline or in the component file unless shared across multiple files

### Code Quality
- No `console.log` in production code
- Keep components focused — extract logic into custom hooks when it gets complex
- Prefer editing existing components over creating new files

### Icons
- Use `lucide-react` for all icons

### Git
**NEVER** run any git commands. Inform the user what files were modified.

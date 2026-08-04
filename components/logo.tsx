import { cn } from "@/lib/utils";
import { profile } from "@/lib/portfolio-data";

/**
 * The `< S >` mark: an S monogram wrapped in angle brackets.
 * Inline rather than an <img> so it stays crisp at any size and adds no
 * network request to the navbar. The tile carries its own gradient, so it
 * reads correctly in both light and dark themes.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="logo-mark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logo-mark-gradient)" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 22 L10.5 32 L17.5 42" strokeWidth="4.5" opacity=".62" />
        <path d="M46.5 22 L53.5 32 L46.5 42" strokeWidth="4.5" opacity=".62" />
        <path
          d="M40 24 C40 19 36.5 16 32 16 C27.5 16 24 19 24 23 C24 31 41 29 41 39 C41 44.5 37 48 32 48 C27 48 24 45 24 41"
          strokeWidth="5.5"
        />
      </g>
    </svg>
  );
}

/** Mark plus wordmark, for the navbar. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="hidden text-base font-semibold tracking-tight sm:inline">
        {profile.name}
      </span>
    </span>
  );
}

/**
 * Google Analytics 4 — the one module every event call site imports.
 *
 * There is no SDK here on purpose. `@next/third-parties` and the various gtag
 * wrappers buy nothing that this file does not, and this repo has already paid
 * 1.79 MB gzipped once to learn that an SDK is not free — see CLAUDE.md, "The
 * 3 MiB script budget". The loader is `next/script`, which ships with Next.
 *
 * Nothing here throws. Analytics failing must never break an interaction, so
 * every entry point is truthiness-gated the same way `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * is in `components/contact-form.tsx`.
 */

/**
 * GA4 measurement ID. Public by design — Next inlines it into the client bundle
 * and gtag.js cannot fire without it reaching the browser.
 *
 * Empty disables analytics entirely: no loader, no consent defaults, no events.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Regions where Consent Mode v2 must default to denied: EU-27 + the rest of the
 * EEA (IS, LI, NO) + the UK + Switzerland — the same set Google's certified CMP
 * shows its European regulations message to.
 *
 * Google resolves these server-side from the request IP, which makes this list
 * the thing that actually enforces denial. The opt-in comes from that CMP, not
 * from anything in this repo.
 */
export const CONSENT_DENIED_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
] as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Send a GA4 event. No-ops silently when gtag is absent. Consent is not checked here —
 * Consent Mode, set up in `app/layout.tsx`, decides what gtag stores and sends.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}

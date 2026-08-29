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
 * Empty disables analytics entirely: no loader, no banner, no events.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/** localStorage key holding the visitor's stored Consent Mode choice. */
export const CONSENT_KEY = "ga-consent";

/**
 * Regions where Consent Mode v2 must default to denied: EU-27 + the rest of the
 * EEA (IS, LI, NO) + the UK + Switzerland.
 *
 * Google resolves these server-side from the request IP, which makes this list —
 * not the banner — the thing that actually enforces denial. The banner's own
 * region guess (see `isConsentRegion`) only decides whether to offer an opt-in.
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

/**
 * IANA time zones covering `CONSENT_DENIED_REGIONS`.
 *
 * A time zone is a coarse proxy for location, and deliberately so: reading the
 * real country would mean `headers()` and `CF-IPCountry`, which forces dynamic
 * rendering and would cost this site the ISR that `open-next.config.ts` and the
 * R2 incremental cache exist to serve.
 *
 * Both ways of being wrong are safe. A miss (an EEA visitor sees no banner)
 * leaves them denied by the IP-based `region` gate above — correct, just no
 * data. A false hit (a non-EEA visitor sees a banner) is cosmetic.
 */
const CONSENT_TIME_ZONES = new Set([
  "Europe/Vienna",
  "Europe/Brussels",
  "Europe/Sofia",
  "Europe/Zagreb",
  "Europe/Nicosia",
  "Asia/Nicosia",
  "Europe/Prague",
  "Europe/Copenhagen",
  "Europe/Tallinn",
  "Europe/Helsinki",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Busingen",
  "Europe/Athens",
  "Europe/Budapest",
  "Europe/Dublin",
  "Europe/Rome",
  "Europe/Riga",
  "Europe/Vilnius",
  "Europe/Luxembourg",
  "Europe/Malta",
  "Europe/Amsterdam",
  "Europe/Warsaw",
  "Europe/Lisbon",
  "Atlantic/Azores",
  "Atlantic/Madeira",
  "Europe/Bucharest",
  "Europe/Bratislava",
  "Europe/Ljubljana",
  "Europe/Madrid",
  "Africa/Ceuta",
  "Atlantic/Canary",
  "Europe/Stockholm",
  "Atlantic/Reykjavik",
  "Europe/Vaduz",
  "Europe/Oslo",
  "Arctic/Longyearbyen",
  "Europe/London",
  "Europe/Zurich",
]);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send a GA4 event. No-ops silently when gtag is absent or consent is denied. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}

/** The visitor's stored choice, or `null` if they have not made one. */
export function readStoredConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Private mode, or storage disabled. Treat as "no choice made".
    return null;
  }
}

/** Is this visitor plausibly in a region that requires an opt-in? */
export function isConsentRegion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return CONSENT_TIME_ZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    // Unknown location — offer the banner rather than assume consent.
    return true;
  }
}

/** Record the visitor's choice and tell gtag about it. */
export function setConsent(granted: boolean): void {
  if (typeof window === "undefined") return;

  const value = granted ? "granted" : "denied";
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage unavailable — the update below still applies for this page view.
  }

  window.gtag?.("consent", "update", { analytics_storage: value });
}

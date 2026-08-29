"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { trackEvent } from "@/lib/analytics";

/**
 * The only source of GA4 page views.
 *
 * The inline bootstrap in `app/layout.tsx` configures gtag with
 * `send_page_view: false`, so the initial view and every client navigation are
 * both fired from here. That is more precise than letting GA4's enhanced
 * measurement infer views from History API calls, which reports the *previous*
 * document title on App Router transitions.
 *
 * `usePathname` only — never `useSearchParams`. A client component reading
 * search params without a `<Suspense>` boundary bails the whole route out of
 * static prerendering, and this site's four ISR routes (`revalidate = 86400`)
 * are exactly what the R2 incremental cache exists to serve. Nothing here is
 * driven by a query string, so there is nothing to lose.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}

"use client";

import { useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isConsentRegion, readStoredConsent, setConsent } from "@/lib/analytics";

/**
 * Whether to offer an opt-in, read straight from the browser.
 *
 * `useSyncExternalStore` rather than an effect that calls `setState`: both inputs
 * (localStorage and the resolved time zone) exist only in the browser, so the
 * server snapshot has to be `false` to match the prerendered HTML, and React
 * swaps in the real value after hydration with no cascading render.
 *
 * The value cannot change while mounted — a visitor does not move country
 * mid-session, and the one thing that does change it (making a choice) unmounts
 * the banner through `dismissed` instead. So the subscribe callback is a no-op.
 */
const NO_OP_SUBSCRIBE = () => () => {};
const needsConsentOnClient = () => readStoredConsent() === null && isConsentRegion();
const needsConsentOnServer = () => false;

/**
 * Consent Mode v2 opt-in, shown only where one is actually required.
 *
 * This banner does not enforce anything. The `region` list in the inline gtag
 * bootstrap (`app/layout.tsx`) already denies `analytics_storage` for EEA/UK/CH
 * visitors, resolved by Google from the request IP. All this does is give those
 * visitors a way to say yes.
 *
 * That split is what lets the region guess here be approximate — see
 * `isConsentRegion` in `lib/analytics.ts`. Guessing wrong in either direction
 * fails safe.
 */
export function ConsentBanner() {
  const needsConsent = useSyncExternalStore(
    NO_OP_SUBSCRIBE,
    needsConsentOnClient,
    needsConsentOnServer,
  );
  const [dismissed, setDismissed] = useState(false);

  if (!needsConsent || dismissed) return null;

  function choose(granted: boolean) {
    setConsent(granted);
    setDismissed(true);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics consent"
      className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-50 border-t shadow-lg backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-muted-foreground flex items-start gap-2.5 text-sm">
          <Cookie className="text-foreground mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            I use Google Analytics to see which work people find useful. Nothing is shared or sold,
            and declining leaves the site fully functional.
          </span>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 flex-1 sm:flex-none"
            onClick={() => choose(false)}
          >
            Decline
          </Button>
          <Button size="sm" className="min-h-11 flex-1 sm:flex-none" onClick={() => choose(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

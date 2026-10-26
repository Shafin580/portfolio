import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { PageViewTracker } from "@/components/page-view-tracker";
import { profile } from "@/lib/portfolio-data";
import { CONSENT_DENIED_REGIONS, GA_ID } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

/** AdSense publisher ID (`ca-pub-…`). Public by design; empty disables ads and the verification tag. */
const ADSENSE_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

/**
 * Consent Mode v2 defaults plus the gtag queue, inlined ahead of gtag.js.
 *
 * `dataLayer` is an ordered queue, so commands pushed before the library arrives
 * are replayed in order once it does. That is what lets the loader stay
 * `afterInteractive` while the consent defaults still land first — which they
 * must, or the first hit leaves before the visitor's region has been considered.
 *
 * The region-scoped default is written first and the global one second purely as
 * documentation; Google resolves the most specific matching region regardless of
 * order. Outside those regions everything defaults to granted.
 *
 * Nothing here issues a `consent update`. In EEA/UK/CH that comes from Google's
 * certified CMP — the AdSense Privacy & messaging "European regulations" message,
 * delivered by `adsbygoogle.js` — which needs both of its consent-mode settings
 * switched on to pass ad *and* analytics choices back to gtag. `wait_for_update`
 * holds the first hit up to 500 ms so a returning visitor's stored choice can land
 * before it; if the CMP is slower, that hit simply goes out denied.
 *
 * No request data reaches this string — every interpolated value is a build-time
 * env var or a constant in this repo. `js()` still hardens each one, because
 * `dangerouslySetInnerHTML` performs no escaping of its own and `JSON.stringify`
 * does not escape `<`: without this, a measurement ID containing `</script>`
 * would close the tag early and turn a build-config typo into injected markup.
 */
const js = (value: unknown) => JSON.stringify(value ?? null).replace(/</g, "\\u003c");

const consentBootstrap = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${js(CONSENT_DENIED_REGIONS)},wait_for_update:500});
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
gtag('config',${js(GA_ID)},{send_page_view:false});`;

const title = `${profile.name} — ${profile.title}`;

/**
 * The social card is a static asset, not a metadata-image route.
 *
 * `app/opengraph-image.tsx` and friends kept `next/og` in the server module graph, and
 * OpenNext bundles route handlers into the Cloudflare Worker whether or not they are
 * prerendered — which put `resvg.wasm` and `yoga.wasm` ~816 KB gzipped over the free
 * plan's 3 MiB script ceiling. `scripts/generate-og.tsx` renders the same cards into
 * `public/og/` at build time instead. Do not turn this back into a route.
 */
const OG_IMAGE = {
  url: "/og/root.png",
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.title}`,
} as const;

const description =
  "Shafin Ahmed is a Full-Stack Software Engineer with 4+ years of experience building scalable web applications using Next.js, React, TypeScript, Laravel, and Docker. Based in Dhaka, Bangladesh — currently at ARITS Limited, delivering projects like HumR, Oporajita, Bullwip, Datafast, and calternatives.org.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description,
  applicationName: title,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  // Deliberately short. Search engines ignore this tag, and a 35-term list
  // reads as stuffing to quality classifiers.
  keywords: [
    "Shafin Ahmed",
    "Full-Stack Software Engineer",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "Laravel developer",
    "software engineer Dhaka",
    "web developer Bangladesh",
    "ARITS Limited",
    "hire full-stack developer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Shafin",
    lastName: "Ahmed",
    username: "Shafin580",
    title,
    description,
    siteName: title,
    url: SITE_URL,
    locale: "en_US",
    countryName: profile.countryName,
    emails: profile.email,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE.url],
  },
  icons: {
    // Rendered at build time by scripts/generate-og.tsx, not by an app/apple-icon.tsx
    // route — see OG_IMAGE above.
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets answer engines quote at length and show the OG card — the whole
      // point of the AEO work.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // AdSense site verification for shadev-tech.com, which also covers its subdomains
  // (e.g. sanchay.shadev-tech.com). The publisher id is public by design.
  ...(ADSENSE_ID ? { other: { "google-adsense-account": ADSENSE_ID } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1c" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Arms the scroll-reveal in `globals.css`, which starts every `[data-animate]`
          section at `opacity: 0`. Scoping those rules to `.js` is what stops a page
          without working JavaScript from rendering blank below the hero; this script is
          the other half of that. It is inline and synchronous on purpose — deferring it
          would let the un-hidden content paint first and then blink out.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        {GA_ID && <script dangerouslySetInnerHTML={{ __html: consentBootstrap }} />}
        {/*
          AdSense auto ads, which also deliver Google's consent message to EEA/UK/CH
          visitors. A plain `<script>`, not `next/script`: AdSense warns about the
          `data-nscript` attribute that one adds.

          `defer`, not Google's stock `async`. React 19 hoists any `async` + `src` script
          to the top of `<head>`, ahead of the inline consent defaults above, and a cached
          copy could then run before they are queued. A deferred script is rendered in
          place and runs after parsing, so the defaults always land first.
        */}
        {ADSENSE_ID && (
          <script
            defer
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
          {GA_ID && (
            <>
              {/*
                `next/script` is correct here, unlike for JSON-LD. The ban noted in
                CLAUDE.md exists because structured data must be in the HTML crawlers
                receive; analytics is the opposite case — it should not run until
                after hydration, which is exactly what `afterInteractive` gives.
              */}
              <Script
                id="ga-loader"
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              />
              <PageViewTracker />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { profile } from "@/lib/portfolio-data";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap" });

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
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

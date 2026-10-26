import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { privacyPolicy, profile } from "@/lib/portfolio-data";
import { absoluteUrl } from "@/lib/site";

const title = "Privacy Policy";
const description =
  "What this portfolio collects, which cookies Google Analytics and Google AdSense set, and how the contact form handles your details.";
const path = "/privacy";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  // NOTE: a child `openGraph` object REPLACES the parent's, it does not merge
  // into it — `locale` and `siteName` have to be restated here.
  openGraph: {
    type: "website",
    title,
    description,
    url: absoluteUrl(path),
    siteName: `${profile.name} — ${profile.title}`,
    locale: "en_US",
    // Restated for the same reason: the site-wide card, rendered by scripts/generate-og.tsx.
    images: [
      { url: "/og/root.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.title}` },
    ],
  },
};

export default function PrivacyPage() {
  const updated = new Date(`${privacyPolicy.updatedDate}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader hrefPrefix="/" />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated: <time dateTime={privacyPolicy.updatedDate}>{updated}</time>
        </p>

        <div className="mt-10 space-y-10">
          {privacyPolicy.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-bold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
              {section.links && (
                <ul className="list-disc space-y-2 pl-6">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4 hover:no-underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

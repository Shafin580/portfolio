import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import {
  platformProfiles,
  platforms,
  profile,
  serviceFromPrice,
  services,
  servicesFaqs,
  servicesIntro,
} from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { buildServicesHubStructuredData } from "@/lib/structured-data";

const title = "Freelance Services — Hire on Upwork, Fiverr & Kwork";
const path = "/services";

const ogImage = {
  url: "/og/services.png",
  width: 1200,
  height: 630,
  alt: `Freelance services by ${profile.name}`,
} as const;

export const metadata: Metadata = {
  title,
  description: servicesIntro.summary,
  keywords: [
    "hire Next.js developer",
    "freelance full-stack developer",
    "Next.js freelancer",
    "Laravel freelancer",
    "headless WordPress developer",
    ...platforms.map((platform) => `${platformProfiles[platform].name} freelancer`),
    profile.name,
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: path },
  // A child `openGraph` REPLACES the layout's — restate `locale` and the rest.
  openGraph: {
    type: "website",
    title,
    description: servicesIntro.summary,
    url: absoluteUrl(path),
    siteName: `${profile.name} — ${profile.title}`,
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: servicesIntro.summary,
    images: [ogImage.url],
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* Server-rendered on purpose — see the note in app/page.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServicesHubStructuredData()) }}
      />
      <div className="bg-background min-h-screen">
        <SiteHeader hrefPrefix="/" />

        <main>
          {/* ── Hero ── */}
          <section className="bg-muted/40 border-b">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                {/* Mirrors the hub's BreadcrumbList node — edit the two together. */}
                <BreadcrumbTrail items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={100}>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                  {servicesIntro.headline}
                </h1>
                <p className="text-muted-foreground mt-4 max-w-3xl text-lg leading-relaxed">
                  {servicesIntro.summary}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <Button key={platform} variant="outline" asChild>
                      <TrackedLink
                        href={platformProfiles[platform].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        event="click"
                        params={{ outbound: true, item_id: platform, location: "services_profile" }}
                      >
                        {platformProfiles[platform].name} profile
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </TrackedLink>
                    </Button>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* ── Services ── Same array as the ItemList node. */}
          <section
            aria-label="Services"
            className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:px-8"
          >
            {services.map((service, index) => (
              <AnimatedSection
                key={service.slug}
                animation="scaleIn"
                delay={((index % 2) * 100 + 100) as 100 | 200}
              >
                <Card className="flex h-full flex-col gap-4 p-6 transition-shadow hover:shadow-lg">
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                    {service.summary}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      From{" "}
                      <span className="font-bold">
                        ${serviceFromPrice(service).toLocaleString("en-US")}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        on{" "}
                        {service.offers
                          .map((offer) => platformProfiles[offer.platform].name)
                          .join(" · ")}
                      </span>
                    </div>
                    <Button size="sm" asChild>
                      <TrackedLink
                        href={`/services/${service.slug}`}
                        aria-label={`${service.name}: details and listings`}
                        event="select_content"
                        params={{
                          content_type: "service",
                          item_id: service.slug,
                          location: "services_card",
                        }}
                      >
                        Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </TrackedLink>
                    </Button>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </section>

          {/* ── FAQ ── Same array that feeds the hub's FAQPage node. */}
          <div className="bg-background border-t">
            <div className="mx-auto max-w-5xl">
              <Faq
                items={servicesFaqs}
                id="services-faq"
                title="Hiring — questions"
                description="How the marketplaces, pricing and direct contact work."
                className="py-14"
                headingClassName="text-2xl font-bold mb-2"
              />
            </div>
          </div>

          {/* ── CTA ── */}
          <section className="bg-muted/40 border-t">
            <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold">Not sure which service fits?</h2>
              <p className="text-muted-foreground mt-2">
                Describe the project and I&apos;ll point you to the right package.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <TrackedLink
                    href="/#contact"
                    event="select_content"
                    params={{ content_type: "services_cta", link_id: "get_in_touch" }}
                  >
                    <Mail className="mr-1.5 h-4 w-4" /> Get in touch
                  </TrackedLink>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/#projects">
                    See my work <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}

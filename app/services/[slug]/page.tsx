import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Award, CheckCircle2, ExternalLink, Mail, PackageCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnimatedSection } from "@/components/animated-section";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { Faq } from "@/components/faq";
import { PlatformIcon } from "@/components/platform-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import {
  caseStudyProjects,
  formatOfferPrice,
  platformProfiles,
  profile,
  serviceFromPrice,
  services,
  servicesCheckedDate,
  type Service,
} from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { buildServiceStructuredData } from "@/lib/structured-data";

// Only the slugs below exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

function findService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** "23 September 2026" — the listing check date, as shown beside the offers. */
const checkedLabel = new Date(servicesCheckedDate).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) return {};

  const title = service.headline;
  const description = service.summary;
  const path = `/services/${service.slug}`;

  // Rendered at build time by `scripts/generate-og.tsx` — see the note on the
  // case-study page for why this is not an `opengraph-image.tsx` route.
  const ogImage = {
    url: `/og/services-${service.slug}.png`,
    width: 1200,
    height: 630,
    alt: `${service.headline} by ${profile.name}`,
  } as const;

  return {
    title,
    description,
    keywords: [
      ...service.keywords,
      service.name,
      ...service.offers.map((offer) => `${platformProfiles[offer.platform].name} freelancer`),
      profile.name,
    ],
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
    publisher: profile.name,
    alternates: {
      canonical: path,
      types: { "text/plain": `${path}/llms.txt` },
    },
    // A child `openGraph` REPLACES the layout's — restate `locale` and the rest.
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: `${profile.name} — ${profile.title}`,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) notFound();

  const related = caseStudyProjects.filter((project) =>
    service.relatedProjects.includes(project.slug),
  );
  const platformNames = service.offers.map((offer) => platformProfiles[offer.platform].name);

  return (
    <>
      {/* Server-rendered on purpose — see the note in app/page.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServiceStructuredData(service)) }}
      />
      <div className="bg-background min-h-screen">
        <SiteHeader hrefPrefix="/" />

        <main>
          {/* ── Hero ── */}
          <section className="bg-muted/40 border-b">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                {/* Mirrors the BreadcrumbList node item-for-item — see
                    lib/structured-data.ts. Edit the two together. */}
                <BreadcrumbTrail
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: service.name },
                  ]}
                />
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={100}>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                  {service.headline}
                </h1>
                <p
                  data-speakable="summary"
                  className="text-muted-foreground mt-4 max-w-3xl text-lg leading-relaxed"
                >
                  {service.summary}
                </p>
                <p className="mt-4 text-sm font-medium">
                  Fixed-price packages on {platformNames.join(", ")} from $
                  {serviceFromPrice(service).toLocaleString("en-US")}.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="#hire">
                      See the listings <ArrowRight className="ml-1.5 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <TrackedLink
                      href="/#contact"
                      event="select_content"
                      params={{
                        content_type: "service_cta",
                        item_id: service.slug,
                        link_id: "hero_contact",
                      }}
                    >
                      <Mail className="mr-1.5 h-4 w-4" /> Ask a question first
                    </TrackedLink>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {/* ── Listings ──
              The same `offers` array builds the schema.org `Offer` nodes, so the
              prices here and in the structured data cannot disagree. */}
          <section
            id="hire"
            aria-labelledby="hire-heading"
            className="mx-auto max-w-5xl scroll-mt-20 px-4 pt-12 sm:px-6 lg:px-8"
          >
            <AnimatedSection animation="fadeInUp">
              <h2 id="hire-heading" className="text-2xl font-bold">
                Where can you hire Shafin for this?
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Prices checked{" "}
                <time dateTime={servicesCheckedDate}>{checkedLabel}</time>. Each listing has
                larger packages; messaging and payment stay on the platform you choose.
              </p>
            </AnimatedSection>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.offers.map((offer, index) => {
                const platformName = platformProfiles[offer.platform].name;
                return (
                  <AnimatedSection
                    key={offer.platform}
                    animation="scaleIn"
                    delay={((index % 3) * 100 + 100) as 100 | 200 | 300}
                  >
                    <Card className="flex h-full flex-col gap-4 p-5">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                          <PlatformIcon platform={offer.platform} className="text-primary h-5 w-5" />
                        </span>
                        <h3 className="font-semibold">{platformName}</h3>
                      </div>
                      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                        {offer.title}
                      </p>
                      <p className="text-sm">
                        From <span className="text-lg font-bold">{formatOfferPrice(offer)}</span>
                      </p>
                      <Button asChild>
                        <TrackedLink
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View on ${platformName}: ${service.name} listing`}
                          event="click"
                          params={{
                            outbound: true,
                            item_id: service.slug,
                            platform: offer.platform,
                            location: "service_offer",
                          }}
                        >
                          <ExternalLink className="mr-1.5 h-4 w-4" /> View on {platformName}
                        </TrackedLink>
                      </Button>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </section>

          {/* ── Body ── */}
          <div className="mx-auto max-w-5xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 text-2xl font-bold">
                  <span className="bg-primary/10 border-primary/20 flex h-9 w-9 items-center justify-center rounded-lg border">
                    <PackageCheck className="text-primary h-4.5 w-4.5" />
                  </span>
                  What do you get?
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="text-muted-foreground flex gap-2.5 text-sm">
                      <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </AnimatedSection>

            <Separator />

            <AnimatedSection animation="fadeInUp">
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 text-2xl font-bold">
                  <span className="bg-primary/10 border-primary/20 flex h-9 w-9 items-center justify-center rounded-lg border">
                    <Award className="text-primary h-4.5 w-4.5" />
                  </span>
                  What has Shafin built like this?
                </h2>
                <ul data-speakable="proof" className="space-y-3">
                  {service.proof.map((line) => (
                    <li key={line} className="flex gap-2.5 leading-relaxed">
                      <CheckCircle2 className="text-primary mt-1 h-4 w-4 shrink-0" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {related.length > 0 && (
                  <div className="grid gap-4 pt-2 sm:grid-cols-2">
                    {related.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="group bg-muted/40 hover:border-primary/50 rounded-lg border p-5 transition-colors"
                      >
                        <span className="text-muted-foreground text-xs tracking-wide uppercase">
                          Case study
                        </span>
                        <span className="group-hover:text-primary mt-1.5 block font-semibold transition-colors">
                          {project.title}
                        </span>
                        <span className="text-muted-foreground mt-1 line-clamp-2 block text-sm">
                          {project.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </AnimatedSection>

            <Separator />

            <AnimatedSection animation="fadeInUp">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {service.stacks.map((stack) => (
                    <Badge key={stack} variant="outline">
                      {stack}
                    </Badge>
                  ))}
                </div>
              </section>
            </AnimatedSection>
          </div>

          {/* ── FAQ ── Same array that feeds the FAQPage node. */}
          <div className="bg-background border-t">
            <div className="mx-auto max-w-5xl">
              <Faq
                items={service.faqs}
                id="service-faq"
                title={`${service.name} — questions`}
                description={`Common questions about hiring ${profile.name} for this.`}
                className="py-14"
                headingClassName="text-2xl font-bold mb-2"
              />
            </div>
          </div>

          {/* ── CTA ── */}
          <section className="bg-muted/40 border-t">
            <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold">Need something outside a package?</h2>
              <p className="text-muted-foreground mt-2">
                Tell me about the project and I&apos;ll scope it with you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <TrackedLink
                    href="/#contact"
                    event="select_content"
                    params={{
                      content_type: "service_cta",
                      item_id: service.slug,
                      link_id: "get_in_touch",
                    }}
                  >
                    <Mail className="mr-1.5 h-4 w-4" /> Get in touch
                  </TrackedLink>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/services">
                    All services <ArrowRight className="ml-1.5 h-4 w-4" />
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

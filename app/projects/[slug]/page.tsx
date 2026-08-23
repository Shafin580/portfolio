import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Mail,
  Target,
  UserRound,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnimatedSection } from "@/components/animated-section";
import { GithubIcon } from "@/components/brand-icons";
import { ProjectMedia } from "@/components/project-media";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkLinks } from "@/lib/link-status";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { Faq } from "@/components/faq";
import { caseStudyProjects, profile, type Project } from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { buildProjectStructuredData } from "@/lib/structured-data";

// Same cadence as LINK_CHECK_REVALIDATE in lib/link-status.ts — Next requires a
// literal here, so the two must be kept in sync by hand.
export const revalidate = 86400;

// Only the slugs below exist; anything else is a 404 rather than an on-demand
// render of a project that does not exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.slug }));
}

function findProject(slug: string): Project | undefined {
  return caseStudyProjects.find((project) => project.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project?.caseStudy) return {};

  const study = project.caseStudy;
  const title = `${project.title} — Case Study`;
  const description = study.overview;
  const path = `/projects/${project.slug}`;

  /**
   * Rendered at build time by `scripts/generate-og.tsx` into `public/og/<slug>.png`, not
   * by an `opengraph-image.tsx` route — that route kept `next/og` in the Cloudflare
   * Worker bundle and pushed it past the 3 MiB free-plan script limit. Adding a new case
   * study regenerates its card on the next build.
   */
  const ogImage = {
    url: `/og/${project.slug}.png`,
    width: 1200,
    height: 630,
    alt: `${project.title} case study${study.client ? ` for ${study.client}` : ""} by ${profile.name}`,
  } as const;

  return {
    title,
    description,
    // Narrow and specific. The stack is what people actually search on; the
    // client and the domain give the page something to rank for beyond it.
    keywords: [
      project.title,
      `${project.title} case study`,
      ...project.stacks,
      ...(study.client ? [study.client] : []),
      study.role,
      profile.name,
    ],
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
    publisher: profile.name,
    alternates: {
      canonical: path,
      // The plain-text brief for LLM crawlers — see the route beside this file.
      types: { "text/plain": `${path}/llms.txt` },
    },
    // NOTE: a child `openGraph` object REPLACES the parent's, it does not merge
    // into it. Everything the root layout sets and this page still needs —
    // `locale` in particular — has to be restated here.
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteUrl(path),
      siteName: `${profile.name} — ${profile.title}`,
      locale: "en_US",
      publishedTime: study.publishedDate,
      modifiedTime: study.updatedDate,
      authors: [profile.name],
      section: "Case Studies",
      tags: project.stacks,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

/** Section wrapper — heading + prose, consistent across every block. */
function Section({
  icon: Icon,
  title,
  children,
  delay,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
  delay?: 100 | 200 | 300 | 400;
}) {
  return (
    <AnimatedSection animation="fadeInUp" delay={delay}>
      <section className="space-y-4">
        <h2 className="flex items-center gap-2.5 text-2xl font-bold">
          <span className="bg-primary/10 border-primary/20 flex h-9 w-9 items-center justify-center rounded-lg border">
            <Icon className="text-primary h-4.5 w-4.5" />
          </span>
          {title}
        </h2>
        {children}
      </section>
    </AnimatedSection>
  );
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);

  // `dynamicParams = false` already blocks unknown slugs at the route level;
  // this keeps the type narrow and covers a stale prerender manifest.
  if (!project?.caseStudy) notFound();

  const study = project.caseStudy;

  // Same build-time liveness gate the homepage uses — a Live button that leads
  // nowhere is worse than no button at all.
  const linkStatus = await checkLinks([project.live]);
  const isLive = Boolean(project.live) && linkStatus[project.live!] === "alive";

  const index = caseStudyProjects.findIndex((p) => p.slug === project.slug);
  const previous = index > 0 ? caseStudyProjects[index - 1] : null;
  const next = index < caseStudyProjects.length - 1 ? caseStudyProjects[index + 1] : null;

  const meta = [
    study.client ? { icon: Building2, label: "Client", value: study.client } : null,
    { icon: Calendar, label: "Timeline", value: study.year },
    { icon: UserRound, label: "Role", value: study.role },
  ].filter(Boolean) as { icon: typeof Building2; label: string; value: string }[];

  return (
    <>
      {/* Server-rendered on purpose — see the note in app/page.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProjectStructuredData(project, isLive)),
        }}
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
                    { label: "Projects", href: "/#projects" },
                    { label: project.title },
                  ]}
                />
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={100}>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                  {project.title}
                </h1>
                <p
                  data-speakable="overview"
                  className="text-muted-foreground mt-4 max-w-3xl text-lg leading-relaxed"
                >
                  {study.overview}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={200}>
                <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {meta.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                          {label}
                        </dt>
                        <dd className="text-sm font-medium">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={300}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {isLive && (
                    <Button asChild>
                      <a
                        href={project.live!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open the live ${project.title} site`}
                      >
                        <ExternalLink className="mr-1.5 h-4 w-4" /> Visit live site
                      </a>
                    </Button>
                  )}
                  {study.externalCaseStudy && (
                    <Button variant="outline" asChild>
                      <a
                        href={study.externalCaseStudy}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Read the client's own write-up of ${project.title}`}
                      >
                        <ExternalLink className="mr-1.5 h-4 w-4" /> Client write-up
                      </a>
                    </Button>
                  )}
                  {project.repo && (
                    <Button variant="outline" asChild>
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View the ${project.title} source on GitHub`}
                      >
                        <GithubIcon className="mr-1.5 h-4 w-4" /> Source
                      </a>
                    </Button>
                  )}
                </div>
              </AnimatedSection>

              {/* ── Stats ──
                  Discrete labelled numbers. A statistic buried inside a
                  paragraph is hard for an answer engine to lift cleanly; the
                  same number standing on its own is not. */}
              {study.stats.length > 0 && (
                <AnimatedSection animation="fadeInUp" delay={400}>
                  <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {study.stats.map((stat) => (
                      <div key={stat.label} className="bg-background rounded-lg border p-4">
                        <dt className="sr-only">{stat.label}</dt>
                        <dd>
                          <span className="text-primary block text-2xl font-bold tracking-tight sm:text-3xl">
                            {stat.value}
                          </span>
                          <span className="text-muted-foreground mt-1 block text-xs leading-snug">
                            {stat.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </AnimatedSection>
              )}
            </div>
          </section>

          {/* ── Key takeaways ──
              First substantive block on the page. Each bullet is a complete
              standalone sentence because an answer engine quotes the sentence,
              not the section. */}
          {study.takeaways.length > 0 && (
            <section
              aria-labelledby="takeaways-heading"
              className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8"
            >
              <AnimatedSection animation="fadeInUp">
                <div className="bg-muted/40 rounded-xl border p-6 sm:p-8">
                  <h2
                    id="takeaways-heading"
                    className="flex items-center gap-2.5 text-lg font-bold"
                  >
                    <Lightbulb className="text-primary h-5 w-5" aria-hidden />
                    Key takeaways
                  </h2>
                  <ul data-speakable="takeaways" className="mt-4 space-y-3">
                    {study.takeaways.map((takeaway) => (
                      <li key={takeaway} className="flex gap-2.5 leading-relaxed">
                        <CheckCircle2 className="text-primary mt-1 h-4 w-4 shrink-0" aria-hidden />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </section>
          )}

          {/* ── Screenshot ── */}
          <section
            aria-label={`${project.title} screenshot`}
            className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8"
          >
            <AnimatedSection animation="scaleIn">
              <div className="overflow-hidden rounded-xl border shadow-sm">
                <ProjectMedia
                  project={project}
                  linkToCaseStudy={false}
                  priority
                  className="h-56 sm:h-80 lg:h-[26rem]"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </AnimatedSection>
          </section>

          {/* ── Body ── */}
          <div className="mx-auto max-w-5xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
            <Section icon={Target} title="The problem">
              <p className="text-muted-foreground leading-relaxed">{study.problem}</p>
            </Section>

            <Separator />

            <Section icon={Wrench} title="The approach" delay={100}>
              <p className="text-muted-foreground leading-relaxed">{study.solution}</p>
            </Section>

            <Separator />

            <Section icon={CheckCircle2} title="What it does" delay={100}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {study.features.map((feature) => (
                  <li key={feature} className="text-muted-foreground flex gap-2.5 text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Separator />

            <AnimatedSection animation="fadeInUp">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.stacks.map((stack) => (
                    <Badge key={stack} variant="outline">
                      {stack}
                    </Badge>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            <Separator />

            <AnimatedSection animation="fadeInUp">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Outcome</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {study.outcomes.map((outcome) => (
                    <Card key={outcome} className="p-5">
                      <p className="text-sm leading-relaxed">{outcome}</p>
                    </Card>
                  ))}
                </div>
              </section>
            </AnimatedSection>

            {/* ── References ──
                Genuine citations, so deliberately NOT rel="nofollow". An
                unsourced claim is what a generative engine discounts. */}
            {study.sources.length > 0 && (
              <>
                <Separator />
                <Section icon={BookOpen} title="References">
                  <ul className="space-y-3">
                    {study.sources.map((source) => (
                      <li key={source.url} className="text-sm">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary decoration-muted-foreground/40 font-medium underline underline-offset-4 transition-colors"
                        >
                          {source.label}
                        </a>
                        {source.publisher !== source.label && (
                          <span className="text-muted-foreground"> — {source.publisher}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              </>
            )}
          </div>

          {/* ── FAQ ──
              Same array that feeds the FAQPage node, so the rendered questions
              and the structured data cannot disagree. */}
          {study.faqs.length > 0 && (
            <div className="bg-background border-t">
              <div className="mx-auto max-w-5xl">
                <Faq
                  items={study.faqs}
                  id="project-faq"
                  title={`${project.title} — questions`}
                  description={`Common questions about ${project.title} and how it was built.`}
                  className="py-14"
                  headingClassName="text-2xl font-bold mb-2"
                />
              </div>
            </div>
          )}

          {/* ── Prev / next ── */}
          {(previous || next) && (
            <section aria-label="More case studies" className="bg-muted/40 border-t">
              <div className="mx-auto grid max-w-5xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:px-8">
                {previous ? (
                  <Link
                    href={`/projects/${previous.slug}`}
                    className="group bg-background hover:border-primary/50 rounded-lg border p-5 transition-colors"
                  >
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs tracking-wide uppercase">
                      <ArrowLeft className="h-3.5 w-3.5" /> Previous
                    </span>
                    <span className="group-hover:text-primary mt-1.5 block font-semibold transition-colors">
                      {previous.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    href={`/projects/${next.slug}`}
                    className="group bg-background hover:border-primary/50 rounded-lg border p-5 text-right transition-colors sm:col-start-2"
                  >
                    <span className="text-muted-foreground flex items-center justify-end gap-1.5 text-xs tracking-wide uppercase">
                      Next <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="group-hover:text-primary mt-1.5 block font-semibold transition-colors">
                      {next.title}
                    </span>
                  </Link>
                )}
              </div>
            </section>
          )}

          {/* ── CTA ── */}
          <section className="border-t">
            <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold">Building something similar?</h2>
              <p className="text-muted-foreground mt-2">
                I&apos;m open to new opportunities and project work.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/#contact">
                    <Mail className="mr-1.5 h-4 w-4" /> Get in touch
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/#projects">
                    See more work <ArrowRight className="ml-1.5 h-4 w-4" />
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

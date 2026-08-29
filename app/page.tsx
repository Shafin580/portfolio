import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { ContactForm } from "@/components/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { Faq } from "@/components/faq";
import { ProjectMedia } from "@/components/project-media";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackedLink } from "@/components/tracked-link";
import {
  certification,
  education,
  experience,
  personalProjects,
  profile,
  professionalProjects,
  projects,
  skills,
} from "@/lib/portfolio-data";
import { checkLinks } from "@/lib/link-status";
import { buildStructuredData } from "@/lib/structured-data";

// Same cadence as LINK_CHECK_REVALIDATE in lib/link-status.ts — Next requires a
// literal here, so the two must be kept in sync by hand.
export const revalidate = 86400;

// ── Component ─────────────────────────────────────────────────────────────────

export default async function Home() {
  const linkStatus = await checkLinks(projects.map((p) => p.live));
  const isLive = (url: string | null) => Boolean(url) && linkStatus[url!] === "alive";

  return (
    <TooltipProvider>
      {/* Server-rendered on purpose. The previous implementation injected this
          with next/script strategy="afterInteractive", so it only existed after
          hydration — invisible to crawlers and LLM fetchers that do not run JS. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData(linkStatus)) }}
      />
      <div className="bg-background min-h-screen">
        <SiteHeader />

        <main>
          {/* ── Hero ── */}
          <section
            id="home"
            className="hero-grid relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden"
          >
            {/* Background radial glow */}
            <div
              className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[700px] sm:w-[700px]"
              aria-hidden="true"
            />
            {/* Floating decorative shapes (desktop only) */}
            <div
              className="border-primary/10 animate-float pointer-events-none absolute top-24 right-[12%] hidden h-16 w-16 rounded-xl border md:block"
              aria-hidden="true"
            />
            <div
              className="border-primary/10 animate-float-delayed pointer-events-none absolute bottom-32 left-[8%] hidden h-12 w-12 rounded-full border md:block"
              aria-hidden="true"
            />
            <div
              className="border-primary/5 animate-float pointer-events-none absolute top-1/3 left-[4%] hidden h-8 w-8 rotate-45 rounded-md border lg:block"
              aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
              <div className="flex flex-col items-center gap-12 md:flex-row lg:gap-20">
                {/* Text column */}
                <div className="flex-1 space-y-7">
                  {/* Status badge */}
                  <div className="hero-animate-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-sm text-green-600 dark:text-green-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Open to new opportunities
                    </div>
                  </div>

                  {/* Name & title */}
                  <div className="hero-animate-2 space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                      Shafin Ahmed
                    </h1>
                    <p className="text-primary text-xl font-semibold sm:text-2xl lg:text-3xl">
                      Full-Stack Software Engineer
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground hero-animate-3 max-w-lg text-base leading-relaxed sm:text-lg">
                    Building scalable web applications and cloud-native systems with Next.js,
                    TypeScript, and microservice architecture — 4+ years shipping production-grade
                    software.
                  </p>

                  {/* Stat cards */}
                  <div className="hero-animate-4 grid max-w-xs grid-cols-3 gap-3 sm:max-w-sm">
                    {[
                      { icon: Briefcase, value: "4+", label: "Years Exp." },
                      { icon: CheckCircle2, value: "10+", label: "Projects" },
                      { icon: MapPin, value: "BD", label: "Dhaka" },
                    ].map(({ icon: Icon, value, label }) => (
                      <Card
                        key={label}
                        className="hover:border-primary/50 cursor-default p-3 text-center transition-colors"
                      >
                        <div className="mb-1.5 flex justify-center">
                          <Icon className="text-primary h-4 w-4" />
                        </div>
                        <p className="text-xl font-bold tracking-tight sm:text-2xl">{value}</p>
                        <p className="text-muted-foreground text-[11px]">{label}</p>
                      </Card>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="hero-animate-5 flex flex-wrap gap-3 pt-1">
                    <Button size="lg" className="gap-2" asChild>
                      <TrackedLink
                        href="#projects"
                        event="select_content"
                        params={{ content_type: "hero_cta", item_id: "view_projects" }}
                      >
                        View Projects
                        <ExternalLink className="h-4 w-4" />
                      </TrackedLink>
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2" asChild>
                      <TrackedLink
                        href="#contact"
                        event="select_content"
                        params={{ content_type: "hero_cta", item_id: "hire_me" }}
                      >
                        <Mail className="h-4 w-4" />
                        Hire Me
                      </TrackedLink>
                    </Button>
                  </div>
                </div>

                {/* Photo column */}
                <div className="hero-animate-photo flex flex-1 justify-center md:justify-end">
                  <div className="relative">
                    {/* Atmospheric glow */}
                    <div
                      className="from-primary/25 via-primary/5 to-primary/25 animate-pulse-slow pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-r blur-2xl"
                      aria-hidden="true"
                    />
                    {/* Gradient border ring */}
                    <div className="from-primary via-primary/60 to-primary/20 relative rounded-full bg-gradient-to-br p-[3px]">
                      {/*
                      This is the LCP element, so it goes through `next/image` rather than
                      Radix Avatar. Radix only renders its <img> after a client-side load
                      check, which measured a 444ms LCP load delay — the browser could not
                      discover the image in the HTML at all. `priority` emits a preload
                      link instead, and the optimizer serves AVIF/WebP at the rendered size
                      rather than the 637x784 source.
                    */}
                      <div className="ring-background relative h-52 w-52 overflow-hidden rounded-full ring-4 sm:h-64 sm:w-64 lg:h-72 lg:w-72">
                        <Image
                          src={profile.photo}
                          alt={`${profile.name} — ${profile.title}`}
                          fill
                          priority
                          sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 208px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    {/* Company badge */}
                    <div className="absolute -right-3 -bottom-2 sm:right-0 sm:bottom-3">
                      <Card className="border-primary/20 px-3 py-2 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                          <span className="text-xs font-medium whitespace-nowrap">
                            @ ARITS Limited
                          </span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div
              className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce sm:block"
              aria-hidden="true"
            >
              <div className="border-muted-foreground/30 flex h-10 w-6 justify-center rounded-full border-2 pt-2">
                <div className="bg-muted-foreground/30 h-3 w-1.5 rounded-full" />
              </div>
            </div>
          </section>

          {/* ── About ── */}
          <section id="about" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                <h2 className="mb-10 text-3xl font-bold">About Me</h2>
              </AnimatedSection>
              <div className="grid gap-8 md:grid-cols-3">
                <AnimatedSection
                  className="space-y-4 md:col-span-2"
                  animation="fadeInUp"
                  delay={100}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    I&apos;m a versatile full-stack software engineer with over 4 years of hands-on
                    experience designing and shipping production-grade web applications. At ARITS
                    Limited, I&apos;ve progressed from intern to Software Engineer — leading the
                    frontend architecture of complex products including HumR (an in-house
                    multi-company HR platform), a UK rental platform, and various client-facing
                    websites.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I thrive at the intersection of clean code and great user experience — from
                    architecting secure SSO systems with cookie encryption to integrating payment
                    gateways and building dynamic form builders. I&apos;m passionate about developer
                    tooling, performance optimisation, and technical SEO.
                  </p>
                </AnimatedSection>

                <div className="space-y-4">
                  <AnimatedSection animation="fadeInUp" delay={200}>
                    <Card className="p-5 transition-shadow hover:shadow-md">
                      <div className="mb-2 flex items-center gap-3">
                        <Building2 className="text-primary h-5 w-5" />
                        <span className="font-semibold">Current Role</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Software Engineer</p>
                      <p className="text-sm font-medium">ARITS Limited</p>
                      <p className="text-muted-foreground mt-1 text-xs">Jun 2024 – Present</p>
                    </Card>
                  </AnimatedSection>

                  <AnimatedSection animation="fadeInUp" delay={300}>
                    <Card className="p-5 transition-shadow hover:shadow-md">
                      <div className="mb-2 flex items-center gap-3">
                        <GraduationCap className="text-primary h-5 w-5" />
                        <span className="font-semibold">Education</span>
                      </div>
                      <p className="text-sm font-medium">BSc in Computer Science</p>
                      <p className="text-muted-foreground text-sm">
                        American International University-Bangladesh
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        GPA 3.58 / 4.0 · 2018–2022
                      </p>
                    </Card>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Experience ── */}
          <section id="experience" className="bg-muted/40 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                <h2 className="mb-10 text-3xl font-bold">Work Experience</h2>
              </AnimatedSection>

              <div className="relative">
                <div className="bg-border absolute top-0 bottom-0 left-4 hidden w-0.5 sm:block" />
                <div className="space-y-8">
                  {experience.map((job, index) => (
                    <AnimatedSection
                      key={job.role + job.period}
                      animation="slideInLeft"
                      delay={Math.min((index + 1) * 100, 400) as 100 | 200 | 300 | 400}
                    >
                      <article className="relative sm:pl-12">
                        <div
                          className="border-primary bg-background absolute top-5 left-2.5 hidden h-3 w-3 rounded-full border-2 sm:block"
                          aria-hidden="true"
                        />
                        <Card className="p-6 transition-shadow hover:shadow-md">
                          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{job.role}</h3>
                              <div className="text-primary mt-0.5 flex items-center gap-2 text-sm font-medium">
                                <Building2 className="h-4 w-4" aria-hidden="true" />
                                {job.company}
                              </div>
                            </div>
                            <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                              <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                                <time dateTime={job.startDate}>{job.period.split(" – ")[0]}</time>
                                <span aria-hidden="true">–</span>
                                {job.endDate ? (
                                  <time dateTime={job.endDate}>{job.period.split(" – ")[1]}</time>
                                ) : (
                                  <span>Present</span>
                                )}
                              </div>
                              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                {job.location}
                              </div>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {job.bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="text-muted-foreground flex gap-2.5 text-sm"
                              >
                                <CheckCircle2
                                  className="text-primary mt-0.5 h-4 w-4 shrink-0"
                                  aria-hidden="true"
                                />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </article>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Skills ── */}
          <section id="skills" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                <h2 className="mb-10 text-3xl font-bold">Skills & Technologies</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(skills).map(([category, items], i) => (
                  <AnimatedSection
                    key={category}
                    animation="fadeInUp"
                    delay={Math.min((i + 1) * 100, 600) as 100 | 200 | 300 | 400 | 500 | 600}
                  >
                    <Card className="h-full p-6 transition-shadow hover:shadow-md">
                      <CardHeader className="mb-4 p-0">
                        <CardTitle className="text-base font-semibold">{category}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex flex-wrap gap-2">
                          {items.map((skill) => (
                            <Tooltip key={skill}>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="secondary"
                                  className="hover:bg-primary hover:text-primary-foreground cursor-default transition-colors"
                                >
                                  {skill}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{skill}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Projects ── */}
          <section id="projects" className="bg-muted/40 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                <h2 className="mb-2 text-3xl font-bold">Featured Projects</h2>
                <p className="text-muted-foreground mb-10">
                  A selection of professional client work and personal builds.
                </p>
              </AnimatedSection>

              <Tabs defaultValue="all">
                <AnimatedSection animation="fadeInUp" delay={100}>
                  <TabsList className="mb-8">
                    <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
                    <TabsTrigger value="professional">
                      Professional ({professionalProjects.length})
                    </TabsTrigger>
                    <TabsTrigger value="personal">Personal ({personalProjects.length})</TabsTrigger>
                  </TabsList>
                </AnimatedSection>

                {(["all", "professional", "personal"] as const).map((tab) => {
                  const list =
                    tab === "all"
                      ? projects
                      : tab === "professional"
                        ? professionalProjects
                        : personalProjects;

                  return (
                    <TabsContent key={tab} value={tab}>
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {list.map((project, index) => (
                          <AnimatedSection
                            key={project.title}
                            animation="scaleIn"
                            delay={Math.min((index % 3) * 100 + 100, 400) as 100 | 200 | 300 | 400}
                          >
                            <Card className="flex h-full flex-col gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
                              {/* The media strip is a link to the case study when there is
                                one, so the whole visual is clickable — otherwise it stays
                                inert markup. */}
                              <ProjectMedia project={project} />

                              <div className="flex flex-1 flex-col p-6">
                                <h3 className="mb-2 text-lg font-semibold">
                                  {project.caseStudy ? (
                                    <TrackedLink
                                      href={`/projects/${project.slug}`}
                                      className="hover:text-primary transition-colors"
                                      event="select_content"
                                      params={{
                                        content_type: "case_study",
                                        item_id: project.slug,
                                        location: "card_title",
                                      }}
                                    >
                                      {project.title}
                                    </TrackedLink>
                                  ) : (
                                    project.title
                                  )}
                                </h3>
                                <p className="text-muted-foreground mb-4 flex-1 text-sm">
                                  {project.description}
                                </p>
                                <div className="mb-4 flex flex-wrap gap-1.5">
                                  {project.stacks.map((stack) => (
                                    <Badge key={stack} variant="outline" className="text-xs">
                                      {stack}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="mt-auto flex flex-wrap gap-3">
                                  {project.caseStudy && (
                                    <Button size="sm" asChild>
                                      <TrackedLink
                                        href={`/projects/${project.slug}`}
                                        aria-label={`Read the ${project.title} case study`}
                                        event="select_content"
                                        params={{
                                          content_type: "case_study",
                                          item_id: project.slug,
                                          location: "card_button",
                                        }}
                                      >
                                        Case study <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                      </TrackedLink>
                                    </Button>
                                  )}
                                  {/* Only rendered when the build-time ping says the site
                                    is actually reachable — see lib/link-status.ts. */}
                                  {isLive(project.live) && (
                                    <Button variant="outline" size="sm" asChild>
                                      <TrackedLink
                                        href={project.live!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Open the live ${project.title} site`}
                                        event="click"
                                        params={{
                                          outbound: true,
                                          item_id: project.slug,
                                          location: "card_live",
                                        }}
                                      >
                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                                      </TrackedLink>
                                    </Button>
                                  )}
                                  {project.repo && (
                                    <Button variant="outline" size="sm" asChild>
                                      <TrackedLink
                                        href={project.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`View the ${project.title} source on GitHub`}
                                        event="click"
                                        params={{
                                          outbound: true,
                                          item_id: project.slug,
                                          location: "card_repo",
                                        }}
                                      >
                                        <GithubIcon className="mr-1.5 h-3.5 w-3.5" /> Code
                                      </TrackedLink>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </AnimatedSection>
                        ))}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </section>

          <Separator />

          {/* ── Education & Certifications ── */}
          <section id="education" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fadeInUp">
                <h2 className="mb-10 text-3xl font-bold">Education & Certifications</h2>
              </AnimatedSection>
              <div className="grid gap-6 md:grid-cols-2">
                <AnimatedSection animation="slideInLeft" delay={100}>
                  <Card className="h-full p-6 transition-shadow hover:shadow-md">
                    <article className="flex items-start gap-4">
                      <div
                        className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        aria-hidden="true"
                      >
                        <GraduationCap className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{education.degree}</h3>
                        <p className="text-primary mt-0.5 text-sm font-medium">
                          {education.institution}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {education.location} · GPA {education.gpa}
                        </p>
                        <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          <time dateTime={education.startDate}>January 2018</time>
                          <span aria-hidden="true">–</span>
                          <time dateTime={education.endDate}>April 2022</time>
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs italic">
                          Thesis: {education.thesis}
                        </p>
                      </div>
                    </article>
                  </Card>
                </AnimatedSection>

                <AnimatedSection animation="slideInLeft" delay={200}>
                  <Card className="h-full p-6 transition-shadow hover:shadow-md">
                    <article className="flex items-start gap-4">
                      <div
                        className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        aria-hidden="true"
                      >
                        <Award className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{certification.name}</h3>
                        <p className="text-primary mt-0.5 text-sm font-medium">
                          {certification.issuer}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {certification.location}
                        </p>
                        <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          <time dateTime={certification.dateISO}>{certification.date}</time>
                        </div>
                      </div>
                    </article>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </section>

          <Separator />

          {/* ── FAQ ── */}
          <Faq />

          <Separator />

          {/* ── Contact / Hire Me ── */}
          <section id="contact" className="bg-muted/40 py-20" aria-labelledby="contact-heading">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-start gap-12 lg:grid-cols-2 [&>*]:min-w-0">
                {/* Left: heading + contact details */}
                <AnimatedSection animation="fadeInUp" className="space-y-6">
                  <div>
                    <h2 id="contact-heading" className="mb-3 text-3xl font-bold">
                      Let&apos;s Work Together
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Have a project in mind? I&apos;d love to hear about it. Fill out the form and
                      I&apos;ll get back to you within 24 hours.
                    </p>
                  </div>

                  <address className="space-y-4 not-italic">
                    {/* A visitor who emails directly never reaches the form, so without
                      this event they are invisible in the funnel. */}
                    <TrackedLink
                      href={`mailto:${profile.email}`}
                      className="text-muted-foreground hover:text-foreground group flex min-w-0 items-center gap-3 text-sm [overflow-wrap:anywhere] transition-colors"
                      event="click"
                      params={{ method: "mailto", location: "contact" }}
                    >
                      <div
                        className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                        aria-hidden="true"
                      >
                        <Mail className="text-primary h-5 w-5" />
                      </div>
                      {profile.email}
                    </TrackedLink>
                    <TrackedLink
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground group flex min-w-0 items-center gap-3 text-sm [overflow-wrap:anywhere] transition-colors"
                      event="click"
                      params={{ outbound: true, link_domain: "linkedin.com", location: "contact" }}
                    >
                      <div
                        className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                        aria-hidden="true"
                      >
                        <LinkedinIcon className="text-primary h-5 w-5" />
                      </div>
                      linkedin.com/in/shafin580
                    </TrackedLink>
                    <TrackedLink
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground group flex min-w-0 items-center gap-3 text-sm [overflow-wrap:anywhere] transition-colors"
                      event="click"
                      params={{ outbound: true, link_domain: "github.com", location: "contact" }}
                    >
                      <div
                        className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                        aria-hidden="true"
                      >
                        <GithubIcon className="text-primary h-5 w-5" />
                      </div>
                      github.com/Shafin580
                    </TrackedLink>
                  </address>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Currently available for new projects
                    </div>
                  </div>
                </AnimatedSection>

                {/* Right: form */}
                <AnimatedSection animation="fadeInUp" delay={200}>
                  <Card className="p-6 sm:p-8">
                    <h3 className="mb-1 text-xl font-semibold">Start a Project</h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Tell me what you&apos;re building and I&apos;ll be in touch.
                    </p>
                    <ContactForm />
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </TooltipProvider>
  );
}

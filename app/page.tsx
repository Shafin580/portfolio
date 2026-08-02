import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Menu,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedSection } from "@/components/animated-section";
import { ContactForm } from "@/components/contact-form";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { Faq } from "@/components/faq";
import { Logo } from "@/components/logo";
import {
  certification,
  education,
  experience,
  navLinks,
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
      <div className="min-h-screen bg-background">
        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" aria-label={`${profile.name} — home`}>
                <Logo />
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-6" role="navigation" aria-label="Sections">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${profile.name} on GitHub`}
                  >
                    <GithubIcon className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${profile.name} on LinkedIn`}
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="sm" className="hidden sm:inline-flex" asChild>
                  <a href={profile.resume} download>
                    <Download className="mr-2 h-4 w-4" /> Resume
                  </a>
                </Button>

                {/* Mobile hamburger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                    <nav className="flex flex-col gap-5 mt-8 px-4" aria-label="Mobile">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                      <Separator />
                      <Button className="w-full" asChild>
                        <a href={profile.resume} download>
                          <Download className="mr-2 h-4 w-4" /> Resume
                        </a>
                      </Button>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>

        <main>
        {/* ── Hero ── */}
        <section
          id="home"
          className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden hero-grid"
        >
          {/* Background radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-primary/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          {/* Floating decorative shapes (desktop only) */}
          <div
            className="absolute top-24 right-[12%] w-16 h-16 border border-primary/10 rounded-xl animate-float pointer-events-none hidden md:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-32 left-[8%] w-12 h-12 border border-primary/10 rounded-full animate-float-delayed pointer-events-none hidden md:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 left-[4%] w-8 h-8 border border-primary/5 rounded-md rotate-45 animate-float pointer-events-none hidden lg:block"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              {/* Text column */}
              <div className="flex-1 space-y-7">
                {/* Status badge */}
                <div className="hero-animate-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-sm text-green-600 dark:text-green-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    Open to new opportunities
                  </div>
                </div>

                {/* Name & title */}
                <div className="hero-animate-2 space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Shafin Ahmed
                  </h1>
                  <p className="text-xl sm:text-2xl lg:text-3xl text-primary font-semibold">
                    Full-Stack Software Engineer
                  </p>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed hero-animate-3">
                  Building scalable web applications and cloud-native systems with Next.js,
                  TypeScript, and microservice architecture — 4+ years shipping production-grade software.
                </p>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-3 max-w-xs sm:max-w-sm hero-animate-4">
                  {[
                    { icon: Briefcase, value: "4+", label: "Years Exp." },
                    { icon: CheckCircle2, value: "10+", label: "Projects" },
                    { icon: MapPin, value: "BD", label: "Dhaka" },
                  ].map(({ icon: Icon, value, label }) => (
                    <Card
                      key={label}
                      className="p-3 text-center hover:border-primary/50 transition-colors cursor-default"
                    >
                      <div className="flex justify-center mb-1.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                    </Card>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 pt-1 hero-animate-5">
                  <Button size="lg" className="gap-2" asChild>
                    <a href="#projects">
                      View Projects
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <a href="#contact">
                      <Mail className="h-4 w-4" />
                      Hire Me
                    </a>
                  </Button>
                </div>
              </div>

              {/* Photo column */}
              <div className="flex-1 flex justify-center md:justify-end hero-animate-photo">
                <div className="relative">
                  {/* Atmospheric glow */}
                  <div
                    className="absolute -inset-6 rounded-full bg-gradient-to-r from-primary/25 via-primary/5 to-primary/25 blur-2xl animate-pulse-slow pointer-events-none"
                    aria-hidden="true"
                  />
                  {/* Gradient border ring */}
                  <div className="relative rounded-full p-[3px] bg-gradient-to-br from-primary via-primary/60 to-primary/20">
                    <Avatar className="w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 ring-4 ring-background">
                      <AvatarImage
                        src={profile.photo}
                        alt={`${profile.name} — ${profile.title}`}
                        // LCP element. Radix renders a plain <img>, so `priority`
                        // is not available — hint the browser directly instead.
                        loading="eager"
                        fetchPriority="high"
                      />
                      <AvatarFallback className="text-5xl font-bold bg-primary text-primary-foreground">
                        SA
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {/* Company badge */}
                  <div className="absolute -bottom-2 -right-3 sm:bottom-3 sm:right-0">
                    <Card className="px-3 py-2 shadow-lg border-primary/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <span className="text-xs font-medium whitespace-nowrap">@ ARITS Limited</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block"
            aria-hidden="true"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <h2 className="text-3xl font-bold mb-10">About Me</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedSection className="md:col-span-2 space-y-4" animation="fadeInUp" delay={100}>
                <p className="text-muted-foreground leading-relaxed">
                  I&apos;m a versatile full-stack software engineer with over 4 years of hands-on
                  experience designing and shipping production-grade web applications. At ARITS Limited,
                  I&apos;ve progressed from intern to Software Engineer — leading the frontend
                  architecture of complex products including an in-house HRMS, a UK rental platform, and
                  various client-facing websites.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I thrive at the intersection of clean code and great user experience — from architecting
                  secure SSO systems with cookie encryption to integrating payment gateways and building
                  dynamic form builders. I&apos;m passionate about developer tooling, performance
                  optimisation, and technical SEO.
                </p>
              </AnimatedSection>

              <div className="space-y-4">
                <AnimatedSection animation="fadeInUp" delay={200}>
                  <Card className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Current Role</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                    <p className="text-sm font-medium">ARITS Limited</p>
                    <p className="text-xs text-muted-foreground mt-1">Jun 2024 – Present</p>
                  </Card>
                </AnimatedSection>

                <AnimatedSection animation="fadeInUp" delay={300}>
                  <Card className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Education</span>
                    </div>
                    <p className="text-sm font-medium">BSc in Computer Science</p>
                    <p className="text-sm text-muted-foreground">
                      American International University-Bangladesh
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">GPA 3.58 / 4.0 · 2018–2022</p>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Experience ── */}
        <section id="experience" className="py-20 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <h2 className="text-3xl font-bold mb-10">Work Experience</h2>
            </AnimatedSection>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <AnimatedSection
                    key={job.role + job.period}
                    animation="slideInLeft"
                    delay={((Math.min((index + 1) * 100, 400)) as 100 | 200 | 300 | 400)}
                  >
                    <article className="sm:pl-12 relative">
                      <div
                        className="absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-primary bg-background hidden sm:block"
                        aria-hidden="true"
                      />
                      <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{job.role}</h3>
                            <div className="flex items-center gap-2 text-primary font-medium text-sm mt-0.5">
                              <Building2 className="h-4 w-4" aria-hidden="true" />
                              {job.company}
                            </div>
                          </div>
                          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                              <time dateTime={job.startDate}>{job.period.split(" – ")[0]}</time>
                              <span aria-hidden="true">–</span>
                              {job.endDate ? (
                                <time dateTime={job.endDate}>{job.period.split(" – ")[1]}</time>
                              ) : (
                                <span>Present</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {job.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2
                                className="h-4 w-4 text-primary shrink-0 mt-0.5"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <h2 className="text-3xl font-bold mb-10">Skills & Technologies</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, items], i) => (
                <AnimatedSection
                  key={category}
                  animation="fadeInUp"
                  delay={((Math.min((i + 1) * 100, 600)) as 100 | 200 | 300 | 400 | 500 | 600)}
                >
                  <Card className="p-6 h-full hover:shadow-md transition-shadow">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-base font-semibold">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <Tooltip key={skill}>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="cursor-default hover:bg-primary hover:text-primary-foreground transition-colors"
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
        <section id="projects" className="py-20 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {list.map((project, index) => (
                        <AnimatedSection
                          key={project.title}
                          animation="scaleIn"
                          delay={((Math.min((index % 3) * 100 + 100, 400)) as 100 | 200 | 300 | 400)}
                        >
                          <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow py-0 gap-0">
                            {project.image ? (
                              <div className="relative h-48 shrink-0">
                                <Image
                                  src={project.image}
                                  alt={`Screenshot of ${project.title} — ${project.stacks
                                    .slice(0, 3)
                                    .join(", ")} project by ${profile.name}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="relative h-48 shrink-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
                                <div className="text-center px-4">
                                  <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                  </div>
                                  <p className="text-sm font-semibold text-foreground/80">
                                    {project.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Client / Private Project
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4 flex-1">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.stacks.map((stack) => (
                                  <Badge key={stack} variant="outline" className="text-xs">
                                    {stack}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-3 mt-auto">
                                {/* Only rendered when the build-time ping says the site
                                    is actually reachable — see lib/link-status.ts. */}
                                {isLive(project.live) && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={project.live!}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={`Open the live ${project.title} site`}
                                    >
                                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                                    </a>
                                  </Button>
                                )}
                                {project.repo && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={project.repo}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={`View the ${project.title} source on GitHub`}
                                    >
                                      <GithubIcon className="mr-1.5 h-3.5 w-3.5" /> Code
                                    </a>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <h2 className="text-3xl font-bold mb-10">Education & Certifications</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection animation="slideInLeft" delay={100}>
                <Card className="p-6 h-full hover:shadow-md transition-shadow">
                  <article className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{education.degree}</h3>
                      <p className="text-primary text-sm font-medium mt-0.5">
                        {education.institution}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {education.location} · GPA {education.gpa}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        <time dateTime={education.startDate}>January 2018</time>
                        <span aria-hidden="true">–</span>
                        <time dateTime={education.endDate}>April 2022</time>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Thesis: {education.thesis}
                      </p>
                    </div>
                  </article>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slideInLeft" delay={200}>
                <Card className="p-6 h-full hover:shadow-md transition-shadow">
                  <article className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{certification.name}</h3>
                      <p className="text-primary text-sm font-medium mt-0.5">
                        {certification.issuer}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{certification.location}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
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
        <section id="contact" className="py-20 bg-muted/40" aria-labelledby="contact-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: heading + contact details */}
              <AnimatedSection animation="fadeInUp" className="space-y-6">
                <div>
                  <h2 id="contact-heading" className="text-3xl font-bold mb-3">
                    Let&apos;s Work Together
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Have a project in mind? I&apos;d love to hear about it. Fill out the form and
                    I&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                <address className="space-y-4 not-italic">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      aria-hidden="true"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    {profile.email}
                  </a>
                  <Link
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      aria-hidden="true"
                    >
                      <LinkedinIcon className="h-5 w-5 text-primary" />
                    </div>
                    linkedin.com/in/shafin580
                  </Link>
                  <Link
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      aria-hidden="true"
                    >
                      <GithubIcon className="h-5 w-5 text-primary" />
                    </div>
                    github.com/Shafin580
                  </Link>
                </address>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    Currently available for new projects
                  </div>
                </div>
              </AnimatedSection>

              {/* Right: form */}
              <AnimatedSection animation="fadeInUp" delay={200}>
                <Card className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold mb-1">Start a Project</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Tell me what you&apos;re building and I&apos;ll be in touch.
                  </p>
                  <ContactForm />
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        </main>

        {/* ── Footer ── */}
        <footer className="border-t py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2026 Shafin Ahmed. All rights reserved.</p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Available for new opportunities
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

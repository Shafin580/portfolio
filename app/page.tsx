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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Github,
  Linkedin,
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

// ── Data ──────────────────────────────────────────────────────────────────────

const experience = [
  {
    role: "Software Engineer",
    company: "ARITS Limited",
    period: "Jun 2024 – Present",
    location: "Baridhara DOHS, Dhaka",
    bullets: [
      "Spearheaded development of responsive UIs with real-time data sync, global state management, and multi-factor authentication",
      "Containerized applications with Docker achieving 50% reduction in deployment time",
      "Integrated Stripe payment gateway and implemented notification & messaging services across multiple products",
      "Designed SSO flow with encrypted cookie sharing across subdomains for seamless multi-module authentication",
    ],
  },
  {
    role: "Junior Software Engineer",
    company: "ARITS Limited",
    period: "Sept 2022 – Jun 2024",
    location: "Baridhara DOHS, Dhaka",
    bullets: [
      "Designed 12+ complex responsive UIs with Next.js, implementing global state management and authentication systems",
      "Containerized 40%+ of deployments with Docker, enhancing full-stack development capabilities",
      "Applied cryptography techniques for secure data transactions in microservice architecture",
    ],
  },
  {
    role: "Internship Trainee",
    company: "ARITS Limited",
    period: "Jun 2022 – Sept 2022",
    location: "Baridhara DOHS, Dhaka",
    bullets: [
      "Built web apps with Next.js SSR and RESTful APIs; managed state with modern frontend libraries",
      "Developed backend services and REST APIs using Laravel with Elasticsearch for optimised data querying",
    ],
  },
];

const projects = [
  {
    title: "HRMS",
    description:
      "In-house Human Resource Management System. Features SSO across subdomains via encrypted cookie sharing, Turborepo-managed shared packages, Dynamic Form Builder, Weekly Routine Builder, and Attendance Clock In-Out.",
    image: null,
    stacks: ["Next.js 15", "TypeScript", "Cryptography", "TanStack Query", "ShadCN UI", "Turborepo"],
    live: null,
    repo: null,
    category: "professional",
  },
  {
    title: "Bullwip",
    description:
      "Full-stack rental onboarding platform for the UK housing market. Responsive Next.js frontend with TanStack Query and a robust Laravel backend API with cookie-encrypted session management.",
    image: null,
    stacks: ["Next.js 16", "TypeScript", "Laravel", "PostgreSQL", "Elasticsearch", "Docker"],
    live: null,
    repo: null,
    category: "professional",
  },
  {
    title: "Datafast",
    description:
      "Full-stack data management desktop application wrapped with Electron. Features web automation via Puppeteer, Next.js frontend, and a Laravel backend — built entirely from scratch.",
    image: null,
    stacks: ["Next.js 14", "Laravel", "MySQL", "Electron", "Puppeteer", "Docker", "TypeScript"],
    live: null,
    repo: null,
    category: "professional",
  },
  {
    title: "calternatives.org",
    description:
      "SEO-first headless CMS site. Integrated WordPress with GraphQL and ACF — achieved 65% improvement in search visibility and 70% faster development speed through SSG/SSR strategies.",
    image: null,
    stacks: ["Next.js 14", "Headless WordPress", "GraphQL", "ACF", "SSG/SSR", "Docker"],
    live: "https://calternatives.org",
    repo: null,
    category: "professional",
  },
  {
    title: "Better Bangladesh",
    description:
      "A platform for voicing concerns and connecting people from all backgrounds to find solutions to core societal problems through thought-provoking discussions.",
    image: "/img/better-bangladesh.png",
    stacks: ["Next.js", "TypeScript", "MongoDB", "TanStack Query", "Context API"],
    live: "https://betterbangladesh.io/",
    repo: null,
    category: "professional",
  },
  {
    title: "Arits Limited",
    description:
      "Corporate website for a leading IT solutions provider. Delivered via headless WordPress with GraphQL and ACF, achieving 45% improvement in search engine performance.",
    image: "/img/arits-image.png",
    stacks: ["Next.js", "TypeScript", "Headless WordPress", "GraphQL", "ACF", "TanStack Query"],
    live: "https://www.aritsltd.com/",
    repo: null,
    category: "professional",
  },
  {
    title: "SheRAA",
    description:
      "Website for the Women's Climate Coalition in Bangladesh, empowering women to lead climate action and sustainable development initiatives.",
    image: "/img/sheraa.png",
    stacks: ["Next.js", "TypeScript", "Headless WordPress", "GraphQL", "ACF", "TanStack Query"],
    live: "https://sheraa.network/",
    repo: null,
    category: "professional",
  },
  {
    title: "Merlin",
    description:
      "Comprehensive MERL solution for managing interventions with encrypted data transactions. Built a Dynamic Form Builder and achieved 50% improvement in data-fetching performance.",
    image: "/img/merlin.png",
    stacks: ["Next.js", "Docker", "Cryptography", "TypeScript", "Microservice", "TanStack Query"],
    live: "https://merlinapp.co.uk/",
    repo: null,
    category: "professional",
  },
  {
    title: "Weather App",
    description:
      "A simple weather application that lets users enter a city name and view current weather conditions via the OpenWeatherMap API.",
    image: "/img/weatherAppSS.png",
    stacks: ["React.js", "OpenWeatherMap"],
    live: "https://weatherappshafindev.netlify.app/",
    repo: "https://github.com/Shafin580/react-weather-app",
    category: "personal",
  },
  {
    title: "Keeper App",
    description:
      "A React application for creating, managing, and deleting personal notes and to-do list items.",
    image: "/img/keeperSS.png",
    stacks: ["React.js", "JavaScript"],
    live: "https://keepershafindev.netlify.app/",
    repo: "https://github.com/Shafin580/react-keeper-app",
    category: "personal",
  },
  {
    title: "Fence Jumper",
    description:
      "A browser-based side-scroller game built with vanilla JavaScript and the p5.js creative coding library.",
    image: "/img/fenceJumperSS.png",
    stacks: ["JavaScript", "p5.js"],
    live: "https://shafin580.github.io/fenceJumper.github.io/",
    repo: "https://github.com/Shafin580/fenceJumper.github.io",
    category: "personal",
  },
];

const skills = {
  Languages: ["JavaScript", "TypeScript", "PHP", "Python", "Java", "C", "C++", "C#"],
  Frontend: ["React", "Next.js", "ShadCN UI", "Tailwindcss", "HTML5", "CSS"],
  Backend: ["Node.js", "NestJS", "Django", "Laravel"],
  Database: ["PostgreSQL", "MongoDB", "Elasticsearch", "MySQL", "GraphQL"],
  "DevOps & Cloud": ["AWS", "Docker", "Turborepo", "Electron", "CI/CD"],
  "Libraries & Tools": [
    "TanStack Query",
    "Zustand",
    "Redux",
    "Context API",
    "Puppeteer",
    "Headless WordPress",
    "Git",
    "JIRA",
  ],
};

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const professionalProjects = projects.filter((p) => p.category === "professional");
  const personalProjects = projects.filter((p) => p.category === "personal");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/">
                <Image src="/img/logo.png" alt="Shafin Ahmed" width={80} height={80} priority />
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-6">
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
                <Link href="https://github.com/Shafin580" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/shafin580/" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </Link>
                <a href="/files/Shafin Ahmed - Resume.pdf" download className="hidden sm:block">
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" /> Resume
                  </Button>
                </a>

                {/* Mobile hamburger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <nav className="flex flex-col gap-5 mt-8">
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
                      <a href="/files/Shafin Ahmed - Resume.pdf" download>
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" /> Resume
                        </Button>
                      </a>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>

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
                  <a href="#projects">
                    <Button size="lg" className="gap-2">
                      View Projects
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#contact">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Hire Me
                    </Button>
                  </a>
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
                        src="/img/Shafin-Ahmed.jpeg"
                        alt="Shafin Ahmed — Full-Stack Software Engineer"
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
                    <div className="sm:pl-12 relative">
                      <div className="absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-primary bg-background hidden sm:block" />
                      <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{job.role}</h3>
                            <div className="flex items-center gap-2 text-primary font-medium text-sm mt-0.5">
                              <Building2 className="h-4 w-4" />
                              {job.company}
                            </div>
                          </div>
                          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {job.period}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {job.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
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
                          <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                            {project.image ? (
                              <div className="relative h-48 shrink-0">
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
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
                                {project.live && (
                                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                                    </Button>
                                  </a>
                                )}
                                {project.repo && (
                                  <a href={project.repo} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <Github className="mr-1.5 h-3.5 w-3.5" /> Code
                                    </Button>
                                  </a>
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
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">
                        Bachelor of Science — Computer Science & Engineering
                      </h3>
                      <p className="text-primary text-sm font-medium mt-0.5">
                        American International University-Bangladesh
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dhaka, Bangladesh · GPA 3.58 / 4.0
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        January 2018 – April 2022
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Thesis: Machine Learning — Training AI to detect sentiment in a sentence
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="slideInLeft" delay={200}>
                <Card className="p-6 h-full hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Responsive Web Development</h3>
                      <p className="text-primary text-sm font-medium mt-0.5">CodersTrust</p>
                      <p className="text-sm text-muted-foreground mt-1">Dhaka, Bangladesh</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        March 2020
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Contact / Hire Me ── */}
        <section id="contact" className="py-20 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: heading + contact details */}
              <AnimatedSection animation="fadeInUp" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-3">Let&apos;s Work Together</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Have a project in mind? I&apos;d love to hear about it. Fill out the form and
                    I&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href="mailto:shafinwork580@gmail.com"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    shafinwork580@gmail.com
                  </a>
                  <Link
                    href="https://www.linkedin.com/in/shafin580/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </div>
                    linkedin.com/in/shafin580
                  </Link>
                  <Link
                    href="https://github.com/Shafin580"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Github className="h-5 w-5 text-primary" />
                    </div>
                    github.com/Shafin580
                  </Link>
                </div>

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

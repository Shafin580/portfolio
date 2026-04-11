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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
      "In-house Human Resource Management System web app built with Next.js 16. Features SSO across subdomains via encrypted cookie sharing, Turborepo-managed shared packages, Dynamic Form Builder, Weekly Routine Builder, and Attendance Clock In-Out.",
    image: null,
    stacks: ["Next.js 15", "TypeScript", "Cryptography", "TanStack Query", "ShadCN UI", "Turborepo", "Tailwindcss"],
    live: null,
    repo: null,
    category: "professional",
  },
  {
    title: "Bullwip",
    description:
      "Full-stack rental onboarding platform built for the UK housing market. Features a responsive Next.js frontend with TanStack Query and a robust Laravel backend API with cookie-encrypted session management.",
    image: null,
    stacks: ["Next.js 16", "TypeScript", "Laravel", "PostgreSQL", "Elasticsearch", "Docker", "ShadCN UI"],
    live: null,
    repo: null,
    category: "professional",
  },
  {
    title: "Datafast",
    description:
      "Full-stack data management desktop application wrapped with Electron. Features web automation via Puppeteer, a Next.js frontend, and a Laravel backend — built entirely from scratch with Docker infrastructure.",
    image: null,
    stacks: ["Next.js 14", "Laravel", "MySQL", "Electron", "Puppeteer", "Docker", "TypeScript"],
    live: null,
    repo: null,
    category: "professional",
  },
  {
    title: "calternatives.org",
    description:
      "SEO-first headless CMS site. Integrated WordPress with GraphQL and ACF for flexible content management — achieved 65% improvement in search visibility and 70% faster development speed through SSG/SSR strategies.",
    image: null,
    stacks: ["Next.js 14", "Headless WordPress", "GraphQL", "ACF", "SSG", "SSR", "Docker", "TypeScript"],
    live: "https://calternatives.org",
    repo: null,
    category: "professional",
  },
  {
    title: "Better Bangladesh",
    description:
      "A platform for voicing concerns and connecting people from all backgrounds to engage in thought-provoking discussions and find solutions to core societal problems.",
    image: "/img/better-bangladesh.png",
    stacks: ["Next.js", "TypeScript", "MongoDB", "TanStack Query", "Context API"],
    live: "https://betterbangladesh.io/",
    repo: null,
    category: "professional",
  },
  {
    title: "Arits Limited",
    description:
      "Corporate website for a leading IT solutions provider. Delivered via headless WordPress with GraphQL and ACF, achieving 45% improvement in search engine performance through technical SEO best practices.",
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
      "Comprehensive MERL solution for managing interventions with encrypted data transactions. Built a Dynamic Form Builder and integrated TanStack Query for a 50% improvement in data-fetching performance.",
    image: "/img/merlin.png",
    stacks: ["Next.js", "Docker", "Cryptography", "TypeScript", "Microservice", "TanStack Query"],
    live: "https://merlinapp.co.uk/",
    repo: null,
    category: "professional",
  },
  {
    title: "Weather App",
    description:
      "A simple weather application that lets users enter a city name and displays current weather conditions using the OpenWeatherMap API.",
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
                <Image
                  src="/img/logo.png"
                  alt="Shafin Ahmed"
                  width={80}
                  height={80}
                  priority
                />
              </Link>

              {/* Desktop nav */}
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

              <div className="flex items-center gap-2">
                <ThemeToggle />

                <Link
                  href="https://github.com/Shafin580"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>

                <Link
                  href="https://www.linkedin.com/in/shafin580/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </Link>

                <a href="/files/Shafin Ahmed - Resume.pdf" download>
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
                    <nav className="flex flex-col gap-4 mt-8">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section id="home" className="py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <AnimatedSection className="flex-1 space-y-6" animation="fadeInUp">
                {/* Status badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-600 dark:text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Open to new opportunities
                </div>

                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                    Shafin Ahmed
                  </h1>
                  <p className="text-2xl text-primary font-semibold">
                    Full-Stack Software Engineer
                  </p>
                </div>

                <p className="text-lg text-muted-foreground max-w-xl">
                  4+ years of experience building scalable web applications and
                  cloud-native systems. Specialising in Next.js, TypeScript,
                  and microservice architecture.
                </p>

                {/* Stat chips */}
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                    4+ Years Experience
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    10+ Projects Delivered
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    <MapPin className="mr-1.5 h-3.5 w-3.5" />
                    Dhaka, Bangladesh
                  </Badge>
                </div>

                <div className="flex gap-3 pt-2">
                  <a href="#projects">
                    <Button>View Projects</Button>
                  </a>
                  <a href="#contact">
                    <Button variant="outline">Get In Touch</Button>
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="scaleIn" delay={200}>
                <Avatar className="w-56 h-56 sm:w-64 sm:h-64 border-4 border-primary shadow-xl">
                  <AvatarImage
                    src="/img/Shafin-Ahmed.jpeg"
                    alt="Shafin Ahmed — Full-Stack Software Engineer"
                  />
                  <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                    SA
                  </AvatarFallback>
                </Avatar>
              </AnimatedSection>
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
                <p className="text-muted-foreground leading-relaxed text-base">
                  I&apos;m a versatile full-stack software engineer with over 4 years of hands-on
                  experience designing and shipping production-grade web applications. At ARITS Limited,
                  I&apos;ve progressed from intern to Software Engineer — leading the frontend
                  architecture of complex products including an in-house HRMS, a UK rental platform, and
                  various client-facing websites.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  I thrive at the intersection of clean code and great user experience — from architecting
                  secure SSO systems with cookie encryption to integrating payment gateways and building
                  dynamic form builders. I&apos;m passionate about developer tooling, performance
                  optimisation, and technical SEO.
                </p>
              </AnimatedSection>

              <div className="space-y-4">
                <AnimatedSection animation="fadeInUp" delay={200}>
                  <Card className="p-5">
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
                  <Card className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Education</span>
                    </div>
                    <p className="text-sm font-medium">BSc in Computer Science</p>
                    <p className="text-sm text-muted-foreground">American International University-Bangladesh</p>
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
              {/* Vertical timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

              <div className="space-y-8">
                {experience.map((job, index) => (
                  <AnimatedSection
                    key={job.role + job.period}
                    animation="slideInLeft"
                    delay={((index * 100) as 100 | 200 | 300) || undefined}
                  >
                    <div className="sm:pl-12 relative">
                      {/* Timeline dot */}
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
              {Object.entries(skills).map(([category, items], categoryIndex) => (
                <AnimatedSection
                  key={category}
                  animation="fadeInUp"
                  delay={((Math.min(categoryIndex * 100, 600)) as 100 | 200 | 300 | 400 | 500 | 600) || undefined}
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
                  <TabsTrigger value="personal">
                    Personal ({personalProjects.length})
                  </TabsTrigger>
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
                          delay={((Math.min((index % 3) * 100 + 100, 400)) as 100 | 200 | 300 | 400) || undefined}
                        >
                          <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                            {/* Project image / placeholder */}
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
                                  <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button variant="outline" size="sm">
                                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                                    </Button>
                                  </a>
                                )}
                                {project.repo && (
                                  <a
                                    href={project.repo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
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

        {/* ── Footer / Contact ── */}
        <footer
          id="contact"
          className="border-t py-16 bg-muted/40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">Get In Touch</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I&apos;m currently open to new opportunities. Whether you have a question or just
                  want to say hi — my inbox is always open!
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={100}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <a href="mailto:shafinwork580@gmail.com">
                  <Button size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    shafinwork580@gmail.com
                  </Button>
                </a>
                <Link
                  href="https://www.linkedin.com/in/shafin580/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                </Link>
                <Link
                  href="https://github.com/Shafin580"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <Separator className="mb-8" />

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

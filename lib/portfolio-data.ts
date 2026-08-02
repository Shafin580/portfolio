/**
 * Single source of truth for every piece of portfolio content.
 *
 * Consumed by the page render, the JSON-LD `@graph`, `/llms.txt`, and the
 * dynamic OG image — keeping them here is what stops the structured data from
 * drifting away from what a human actually sees on the page.
 */

export interface Job {
  role: string;
  company: string;
  period: string;
  /** ISO 8601 for <time dateTime> and schema.org. */
  startDate: string;
  /** ISO 8601, or null when still current. */
  endDate: string | null;
  location: string;
  bullets: string[];
}

export interface Project {
  title: string;
  description: string;
  image: string | null;
  stacks: string[];
  live: string | null;
  repo: string | null;
  category: "professional" | "personal";
}

export interface Faq {
  question: string;
  answer: string;
}

export const profile = {
  name: "Shafin Ahmed",
  title: "Full-Stack Software Engineer",
  email: "shafinwork580@gmail.com",
  tagline:
    "Building scalable web applications and cloud-native systems with Next.js, TypeScript, and microservice architecture — 4+ years shipping production-grade software.",
  locality: "Dhaka",
  region: "Dhaka Division",
  country: "BD",
  countryName: "Bangladesh",
  employer: "ARITS Limited",
  employerUrl: "https://www.aritsltd.com/",
  github: "https://github.com/Shafin580",
  linkedin: "https://www.linkedin.com/in/shafin580/",
  resume: "/files/Shafin Ahmed - Resume.pdf",
  photo: "/img/Shafin-Ahmed.jpeg",
  logo: "/img/logo.png",
  yearsExperience: "4+",
} as const;

export const experience: Job[] = [
  {
    role: "Software Engineer",
    company: "ARITS Limited",
    period: "Jun 2024 – Present",
    startDate: "2024-06",
    endDate: null,
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
    startDate: "2022-09",
    endDate: "2024-06",
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
    startDate: "2022-06",
    endDate: "2022-09",
    location: "Baridhara DOHS, Dhaka",
    bullets: [
      "Built web apps with Next.js SSR and RESTful APIs; managed state with modern frontend libraries",
      "Developed backend services and REST APIs using Laravel with Elasticsearch for optimised data querying",
    ],
  },
];

export const projects: Project[] = [
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

export const skills = {
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
} as const;

export const education = {
  degree: "Bachelor of Science — Computer Science & Engineering",
  institution: "American International University-Bangladesh",
  location: "Dhaka, Bangladesh",
  gpa: "3.58 / 4.0",
  period: "January 2018 – April 2022",
  startDate: "2018-01",
  endDate: "2022-04",
  thesis: "Machine Learning — Training AI to detect sentiment in a sentence",
} as const;

export const certification = {
  name: "Responsive Web Development",
  issuer: "CodersTrust",
  location: "Dhaka, Bangladesh",
  date: "March 2020",
  dateISO: "2020-03",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/**
 * Answer-engine fodder. Every answer is drawn from facts already stated
 * elsewhere on this page — nothing here is invented.
 */
export const faqs: Faq[] = [
  {
    question: "Who is Shafin Ahmed?",
    answer:
      "Shafin Ahmed is a Full-Stack Software Engineer based in Dhaka, Bangladesh, with 4+ years of experience building production-grade web applications. He currently works as a Software Engineer at ARITS Limited, where he has progressed from intern to engineer since 2022, leading frontend architecture on products including an in-house HRMS, a UK rental platform, and multiple client-facing websites.",
  },
  {
    question: "What technologies does Shafin Ahmed work with?",
    answer:
      "On the frontend: React, Next.js, TypeScript, ShadCN UI, TanStack Query, Zustand and Redux. On the backend: Laravel, Node.js, NestJS and Django, with PostgreSQL, MySQL, MongoDB, Elasticsearch and GraphQL for data. For infrastructure: Docker, AWS, Turborepo, CI/CD pipelines and Electron for desktop builds.",
  },
  {
    question: "Is Shafin Ahmed available for hire?",
    answer:
      "Yes — he is open to new opportunities and project work. The fastest route is email at shafinwork580@gmail.com or the contact form on this site; he responds within 24 hours. He is also reachable on LinkedIn at linkedin.com/in/shafin580.",
  },
  {
    question: "What has Shafin Ahmed built?",
    answer:
      "Notable work includes an in-house HRMS with subdomain SSO and a dynamic form builder, Bullwip (a rental onboarding platform for the UK housing market), Datafast (an Electron desktop app with Puppeteer automation), Merlin (an encrypted MERL platform), and SEO-first headless WordPress sites including calternatives.org, aritsltd.com and sheraa.network.",
  },
  {
    question: "How many years of experience does Shafin Ahmed have?",
    answer:
      "Over 4 years. He joined ARITS Limited as an internship trainee in June 2022, became a Junior Software Engineer in September 2022, and was promoted to Software Engineer in June 2024.",
  },
  {
    question: "Does Shafin Ahmed work with international clients?",
    answer:
      "Yes. His work includes Bullwip for the UK housing market, the Merlin MERL platform, and calternatives.org — all delivered remotely from Dhaka, Bangladesh.",
  },
  {
    question: "What is Shafin Ahmed's educational background?",
    answer:
      "A BSc in Computer Science & Engineering from American International University-Bangladesh (January 2018 – April 2022), graduating with a GPA of 3.58 / 4.0. His thesis covered machine learning for sentence-level sentiment detection. He also holds a Responsive Web Development certification from CodersTrust (March 2020).",
  },
];

export const professionalProjects = projects.filter((p) => p.category === "professional");
export const personalProjects = projects.filter((p) => p.category === "personal");

/** Flat list of every skill, used for schema.org `knowsAbout`. */
export const allSkills: string[] = Object.values(skills).flat();

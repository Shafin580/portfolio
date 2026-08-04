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

export interface Faq {
  question: string;
  answer: string;
}

/**
 * A discrete, quotable number.
 *
 * Statistics buried inside a sentence are hard for an answer engine to lift
 * cleanly; the same number as its own labelled fact is not. Every value here
 * must already be stated somewhere verifiable — never estimate one to fill the
 * row out.
 */
export interface Stat {
  /** "15", "65%", "8 weeks" — the number itself, formatted for display. */
  value: string;
  label: string;
}

/** An external document that backs a claim made on the page. */
export interface Source {
  label: string;
  url: string;
  publisher: string;
}

/**
 * A real-world organisation named on the page.
 *
 * Emitted as a schema.org `Organization` with `sameAs` pointing at its official
 * site, so "The Asia Foundation" resolves to the actual entity rather than
 * leaving a generative engine to guess which one is meant.
 */
export interface NamedEntity {
  name: string;
  /** Official site — becomes schema.org `sameAs`. */
  url: string;
  role: "Client" | "Delivery partner" | "Convenor" | "Employer";
}

/**
 * The long-form write-up behind a project card.
 *
 * Present only on work with a real story to tell — a project whose `caseStudy`
 * is null simply has no `/projects/<slug>` page, and `generateStaticParams`
 * never emits a route for it.
 *
 * Everything here is traceable to something verified: the projects themselves,
 * the clients' own published write-ups, or the live sites. Nothing in this file
 * is invented — the FAQ answers and stats in particular are drawn only from
 * facts stated elsewhere in the same entry.
 */
export interface CaseStudy {
  /** Who it was built for. `null` for in-house products. */
  client: string | null;
  /** Human-readable delivery window, e.g. "2025" or "2023 – 2024". */
  year: string;
  role: string;
  /** ISO 8601. Drives `article:published_time` and schema `datePublished`. */
  publishedDate: string;
  /**
   * ISO 8601. Drives `article:modified_time`, schema `dateModified`, and the
   * sitemap's `lastmod` — which is why it is a real date and not `new Date()`.
   */
  updatedDate: string;
  /** One or two sentences directly under the page title. */
  overview: string;
  /**
   * Three standalone sentences, each true on its own out of context. An answer
   * engine quotes the sentence, not the section, so these do not begin with
   * "It" or "The project".
   */
  takeaways: string[];
  stats: Stat[];
  problem: string;
  solution: string;
  features: string[];
  outcomes: string[];
  /** Feeds both the rendered accordion and the page's `FAQPage` node. */
  faqs: Faq[];
  sources: Source[];
  entities: NamedEntity[];
  /** A third-party write-up (e.g. the client's own case study), if one exists. */
  externalCaseStudy: string | null;
}

export interface Project {
  /** URL segment for `/projects/<slug>`. Must be unique across `projects`. */
  slug: string;
  title: string;
  description: string;
  image: string | null;
  stacks: string[];
  live: string | null;
  repo: string | null;
  category: "professional" | "personal";
  /**
   * schema.org type for this project. An application and a marketing site are
   * genuinely different things; collapsing both to `CreativeWork` throws away
   * precision a crawler can use.
   */
  schemaType: "SoftwareApplication" | "WebSite" | "CreativeWork";
  /** `null` means card-only — no detail page is generated. */
  caseStudy: CaseStudy | null;
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
  employerUrl: "https://arits.tech",
  github: "https://github.com/Shafin580",
  linkedin: "https://www.linkedin.com/in/shafin580/",
  resume: "/files/Shafin Ahmed - Resume.pdf",
  photo: "/img/Shafin-Ahmed.jpeg",
  logo: "/img/logo.svg",
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

/**
 * Shared organisation records.
 *
 * Every `url` here was checked to resolve before it was written down — these
 * become schema.org `sameAs` values, and a `sameAs` pointing at a dead host is
 * worse than no `sameAs` at all.
 */
const ARITS: NamedEntity = { name: "ARITS Limited", url: "https://arits.tech", role: "Employer" };
const ASIA_FOUNDATION = "https://asiafoundation.org/";
const BONHISHIKHA = "https://unlearngender.com/";

/** Every case study on this site was written up on the same day. */
const CASE_STUDY_DATE = "2026-08-04";

export const projects: Project[] = [
  {
    slug: "humr",
    title: "HumR",
    description:
      "Multi-company HR platform (humr.work) covering the full employment lifecycle across three Next.js apps that share one login. Built SSO across subdomains via encrypted cookie sharing, a Turborepo package graph, a dynamic form builder, and attendance clock in/out.",
    image: "/img/humr-image.png",
    stacks: ["Next.js 15", "TypeScript", "Turborepo", "Cryptography", "TanStack Query", "ShadCN UI"],
    // Dev environment, behind a login. Kept deliberately: the build-time ping in
    // lib/link-status.ts drops the button, the schema `sameAs`, and the llms.txt
    // line by itself if the host goes away, so a torn-down dev box cannot leave
    // a dead link behind.
    live: "https://dev-hrms-app.aritsltd.com/",
    repo: null,
    category: "professional",
    schemaType: "SoftwareApplication",
    caseStudy: {
      client: null,
      year: "2024 – present",
      role: "Frontend Lead",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        "HumR is ARITS Limited's in-house HR suite: a multi-tenant, permission-gated system that runs a company's entire employment lifecycle — from onboarding through payroll disbursement — across three separate web applications that behave like one product.",
      takeaways: [
        "HumR splits HR into three independently deployable Next.js applications — core HR, attendance, and payroll — that share one login and one company context.",
        "A single JWT session travels across subdomains in encrypted cookies, so moving between the three apps never asks the user to sign in again.",
        "Auth, the design system, and the form and report builders are Turborepo workspace packages, so a fix lands once and reaches all three apps.",
      ],
      stats: [
        { value: "3", label: "web applications, one session" },
        { value: "7", label: "modules across the platform" },
        { value: "4", label: "permission personas" },
      ],
      problem:
        "HR software is rarely one workflow. Core HR, time-and-attendance, and payroll each have their own domain model, release cadence, and permission surface, and cramming them into a single application produces a codebase nobody can ship independently. Splitting them into separate apps solves that — but only if a user never notices the seam: one login, one company context, one design language across all three.",
      solution:
        "Three independent Next.js applications sit on a shared Turborepo package graph — auth, design system, ShadCN primitives, form builder, and report builder are all workspace packages, so a fix lands once and propagates. The apps share a single JWT session through encrypted cookies scoped across subdomains, and the active company travels in the URL as an encrypted identifier, so deep links stay valid across app boundaries without leaking tenant ids. Permission gating is advisory on the frontend and enforced by the backend, which keeps the UI honest without making it the security boundary.",
      features: [
        "Subdomain SSO — one login carries across all three apps via encrypted cookie sharing",
        "Multi-company tenancy with a company switcher and encrypted company id in every route",
        "Dynamic form builder — employee creation renders from a server-supplied schema rather than a fixed form",
        "Weekly routine and shift/schedule builder with clock in/out and attendance claims",
        "Payroll cycles: salary structure, disbursement, tax, loans, reimbursements, and PF ledger",
        "Report builder producing dynamic cross-module reports",
        "Turborepo workspace packages shared across every app (auth, design system, form and report builders)",
      ],
      outcomes: [
        "Three apps ship on independent release cycles while presenting a single product to the user",
        "Shared packages removed the duplicated auth, theming, and table code the split would otherwise have created",
        "Permission-gated UI mirrors backend enforcement, so no screen renders an action the API will reject",
      ],
      faqs: [
        {
          question: "What is HumR?",
          answer:
            "HumR is a multi-company, permission-gated Human Resource Management System built in-house at ARITS Limited. It covers the full employment lifecycle — onboarding, organisation structure, attendance, leave, payroll, and compliance — across three web applications that share a single authentication session.",
        },
        {
          question: "How does single sign-on work across the three HumR apps?",
          answer:
            "The three apps share one JWT session carried in encrypted cookies scoped across subdomains. The active company travels in the URL as an encrypted identifier, so a deep link stays valid when a user crosses from core HR into attendance or payroll without re-authenticating or leaking the tenant id.",
        },
        {
          question: "Why is HumR three applications instead of one?",
          answer:
            "Core HR, attendance, and payroll have separate domain models, release cadences, and permission surfaces. Keeping them as three Next.js apps lets each ship independently; a shared Turborepo package graph for auth, the design system, and the form and report builders is what keeps them feeling like one product.",
        },
        {
          question: "What was Shafin Ahmed's role on HumR?",
          answer:
            "Frontend Lead. The work covered the subdomain SSO flow with encrypted cookie sharing, the Turborepo shared-package architecture, the dynamic form builder, the weekly routine builder, and attendance clock in/out.",
        },
      ],
      sources: [],
      entities: [ARITS],
      externalCaseStudy: null,
    },
  },
  {
    slug: "oporajita",
    title: "Oporajita",
    description:
      "Real-time data and collaboration dashboard for The Asia Foundation's Oporajita initiative, used by 15 partner organisations across Bangladesh's garment sector. Replaced scattered spreadsheets with one shared, standardised system.",
    image: "/img/oporajita.png",
    stacks: ["Next.js", "TypeScript", "Service-Oriented Architecture", "Elasticsearch", "Docker", "TanStack Query"],
    live: null,
    repo: null,
    category: "professional",
    schemaType: "SoftwareApplication",
    caseStudy: {
      client: "The Asia Foundation",
      year: "2025",
      role: "Frontend Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        "A programme management dashboard for the Oporajita initiative — a Collective Impact programme in Bangladesh's garment sector where 15 partner organisations work toward shared goals but had no shared view of them.",
      takeaways: [
        "Oporajita gives 15 partner organisations in Bangladesh's garment sector one standardised view of a programme they previously tracked in fifteen different spreadsheets.",
        "Standardising what partners submit makes cross-partner comparison a property of the system rather than a manual reconciliation step before every report.",
        "The Asia Foundation's Oporajita dashboard was delivered by ARITS Limited in an eight-week cycle running from UX design through deployment.",
      ],
      stats: [
        { value: "15", label: "partner organisations" },
        { value: "8", label: "weeks, design to deployment" },
        { value: "4", label: "core capabilities" },
      ],
      problem:
        "Every partner collected data differently, so no one could see the whole programme. Fifteen organisations meant fifteen spreadsheet conventions, fifteen reporting formats, and no way to answer a question about the initiative as a whole without a manual reconciliation pass. Donor reporting was slow and decisions rested on whichever partner's numbers happened to be at hand.",
      solution:
        "A service-oriented dashboard that standardises what partners submit and then makes the aggregate legible. Submissions run through one schema, so cross-partner comparison is a property of the system rather than an act of cleanup. On top of that sits a report builder for donors and project teams, a collaboration tracker that surfaces where partners are already working together, and an archive that keeps every historical submission reviewable rather than overwritten.",
      features: [
        "Standardised dashboards giving every partner the same cross-programme view",
        "Report builder producing donor and project-team reports without manual collation",
        "Collaboration tracker surfacing joint activities across the 15 partner organisations",
        "Historical data archive — every submission stays reviewable rather than being overwritten",
        "Search-optimised analytics over document and relational stores with a caching layer",
      ],
      outcomes: [
        "Partners now work from one shared system instead of scattered spreadsheets",
        "Achievements are monitored continuously rather than reconstructed at reporting time",
        "Decisions rest on data the whole network can see",
        "Delivered in an 8-week cycle from UX design through deployment",
      ],
      faqs: [
        {
          question: "What is the Oporajita web application?",
          answer:
            "It is a real-time data and collaboration dashboard built for The Asia Foundation's Oporajita initiative, used by 15 partner organisations working in Bangladesh's garment sector under a Collective Impact model. It standardises how partners submit data and gives the whole network one shared view of programme progress.",
        },
        {
          question: "What problem did Oporajita solve?",
          answer:
            "Every partner collected data differently, so nobody could see the whole programme. Fifteen organisations meant fifteen spreadsheet conventions and no way to answer a question about the initiative as a whole without a manual reconciliation pass. The dashboard replaced that with one schema every submission runs through.",
        },
        {
          question: "How long did Oporajita take to build?",
          answer:
            "An eight-week cycle, running from UX design through to deployment.",
        },
        {
          question: "What technology is Oporajita built on?",
          answer:
            "A service-oriented architecture with an API-driven backend and a modern web frontend, backed by document and relational data stores, search-optimised analytics, and a caching layer.",
        },
      ],
      sources: [
        {
          label: "Oporajita Web Application — case study",
          url: "https://arits.tech/our-work/oporajita-web-application",
          publisher: "ARITS Limited",
        },
        {
          label: "The Asia Foundation",
          url: ASIA_FOUNDATION,
          publisher: "The Asia Foundation",
        },
      ],
      entities: [
        { name: "The Asia Foundation", url: ASIA_FOUNDATION, role: "Client" },
        ARITS,
      ],
      externalCaseStudy: "https://arits.tech/our-work/oporajita-web-application",
    },
  },
  {
    slug: "bullwip",
    title: "Bullwip",
    description:
      "Full-stack rental onboarding platform for the UK housing market. Responsive Next.js frontend with TanStack Query over a Laravel API, with cookie-encrypted session management.",
    image: null,
    stacks: ["Next.js 16", "TypeScript", "Laravel", "PostgreSQL", "Elasticsearch", "Docker"],
    live: null,
    repo: null,
    category: "professional",
    schemaType: "SoftwareApplication",
    caseStudy: {
      client: "UK property management client",
      year: "2024 – present",
      role: "Full-Stack Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        "A property management and rental onboarding SaaS for the UK housing market, built end to end — Next.js frontend, Laravel API, PostgreSQL, and Elasticsearch for search.",
      takeaways: [
        "Bullwip models rental onboarding as durable server-side state, so a half-finished application is a first-class record rather than an unsaved browser draft.",
        "Landlords, agents, and tenants each see a different slice of the same tenancy, kept consistent through TanStack Query cache coordination rather than page reloads.",
        "Elasticsearch backs property and applicant search at a data size where relational queries had stopped feeling interactive.",
      ],
      stats: [
        { value: "3", label: "parties per tenancy" },
        { value: "2", label: "data stores: PostgreSQL + Elasticsearch" },
      ],
      problem:
        "Rental onboarding is a long, stateful, document-heavy process shared between landlords, agents, and tenants. Each party sees a different slice, drops out mid-flow, and returns days later expecting to resume exactly where they left off. A form-per-page approach breaks down: state has to survive the session, and every party's view has to stay consistent with the same underlying tenancy.",
      solution:
        "The onboarding flow is modelled as durable server-side state rather than client form state, so a half-finished application is a first-class record rather than an unsaved draft. TanStack Query handles cache invalidation across the parties viewing the same tenancy, so an agent's update is reflected without a reload. Sessions are carried in encrypted cookies, and Elasticsearch backs property and applicant search where relational queries were too slow to feel interactive.",
      features: [
        "Multi-party rental onboarding flow with resumable, server-persisted progress",
        "Encrypted cookie session management shared across the app",
        "Elasticsearch-backed property and applicant search",
        "Laravel REST API over PostgreSQL, containerised with Docker",
        "Responsive Next.js frontend with TanStack Query cache coordination",
      ],
      outcomes: [
        "Applications survive drop-off — parties resume mid-flow instead of restarting",
        "Search stays interactive at a data size where relational queries did not",
        "Containerised deployment cut release time substantially against the previous manual process",
      ],
      faqs: [
        {
          question: "What is Bullwip?",
          answer:
            "Bullwip is a property management and rental onboarding platform for the UK housing market, built end to end with a Next.js frontend, a Laravel API, PostgreSQL, and Elasticsearch for search.",
        },
        {
          question: "Why is rental onboarding state stored on the server rather than in the browser?",
          answer:
            "Onboarding is long, document-heavy, and shared between landlords, agents, and tenants, each of whom drops out mid-flow and returns days later. Holding progress as durable server-side state makes a half-finished application a real record that any party can resume, instead of a browser draft that disappears with the session.",
        },
        {
          question: "Why does Bullwip use Elasticsearch alongside PostgreSQL?",
          answer:
            "PostgreSQL holds the tenancy data, but property and applicant search stopped feeling interactive at the data sizes involved. Elasticsearch backs those search paths specifically, leaving the relational store to do what it is good at.",
        },
      ],
      sources: [],
      entities: [ARITS],
      externalCaseStudy: null,
    },
  },
  {
    slug: "datafast",
    title: "Datafast",
    description:
      "Full-stack data management desktop application wrapped with Electron. Web automation via Puppeteer, a Next.js frontend, and a Laravel backend — built entirely from scratch.",
    image: null,
    stacks: ["Next.js 14", "TypeScript", "Laravel", "MySQL", "Electron", "Puppeteer", "Docker"],
    live: null,
    repo: null,
    category: "professional",
    schemaType: "SoftwareApplication",
    caseStudy: {
      client: null,
      year: "2023 – 2024",
      role: "Full-Stack Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        "A desktop data management tool that collects, normalises, and manages records from sources that only exist as web pages — shipped as an Electron app so it runs on an operator's machine with their own credentials.",
      takeaways: [
        "Datafast runs Puppeteer automation locally inside an Electron shell, under the operator's own browser session, because the target sources were session-bound and rejected datacentre traffic.",
        "Collected records flow into a Laravel API over MySQL for normalisation and deduplication, which keeps the desktop client a thin driver and leaves the data somewhere auditable.",
        "The application was built from scratch end to end — desktop shell, Next.js frontend, Laravel API, and schema.",
      ],
      stats: [
        { value: "4", label: "layers built from scratch" },
      ],
      problem:
        "The data the team needed was locked in third-party web interfaces with no API. Doing it by hand was slow and error-prone; doing it from a server was worse, because the sources were session-bound and treated datacentre traffic as hostile. The work had to run where the operator already was, on their machine, under their session.",
      solution:
        "Electron wraps a Next.js frontend and drives Puppeteer locally, so automation runs in the operator's own browser context rather than from a server. Collected records flow into a Laravel API over MySQL where they are normalised and deduplicated, which keeps the desktop client a thin driver and leaves the data model somewhere it can be queried and audited. Docker keeps the backend reproducible across environments.",
      features: [
        "Electron desktop shell around a Next.js frontend",
        "Puppeteer automation running locally, under the operator's own session",
        "Laravel + MySQL backend for normalisation, deduplication, and querying",
        "Data management UI for reviewing, correcting, and exporting collected records",
        "Dockerised backend for reproducible environments",
      ],
      outcomes: [
        "Replaced a manual collection process with a repeatable, reviewable one",
        "Automation runs under operator sessions, avoiding the blocks server-side collection hit",
        "Built from scratch end to end — desktop shell, frontend, API, and schema",
      ],
      faqs: [
        {
          question: "What is Datafast?",
          answer:
            "Datafast is a desktop data management application that collects, normalises, and manages records from third-party sources that exist only as web pages. It ships as an Electron app wrapping a Next.js frontend, with a Laravel and MySQL backend.",
        },
        {
          question: "Why is Datafast a desktop app rather than a server-side job?",
          answer:
            "The source systems were session-bound and treated datacentre traffic as hostile, so server-side collection was blocked. Running inside Electron on the operator's own machine means the automation executes under their existing browser session, which is the only context the sources accept.",
        },
        {
          question: "What does the backend do if the automation runs locally?",
          answer:
            "The Laravel and MySQL backend normalises and deduplicates everything the desktop client collects. Keeping that server-side leaves the desktop app a thin driver and puts the data somewhere it can be queried, corrected, and audited.",
        },
      ],
      sources: [],
      entities: [ARITS],
      externalCaseStudy: null,
    },
  },
  {
    slug: "shaathi",
    title: "Shaathi",
    description:
      "Website for Shaathi Foundation, which manufactures affordable reusable sanitary napkins and runs menstrual health education across Bangladesh. Next.js frontend with an SEO-first content architecture.",
    image: "/img/shaathi.png",
    stacks: ["Next.js", "TypeScript", "Headless CMS", "SSG/SSR", "Tailwind CSS", "SEO"],
    live: "https://shaathi.com.bd",
    repo: null,
    category: "professional",
    schemaType: "WebSite",
    caseStudy: {
      client: "Shaathi Foundation",
      year: "2025",
      role: "Frontend Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        "Shaathi Foundation tackles period poverty in Bangladesh by manufacturing affordable reusable sanitary napkins and running menstrual hygiene education. The site has to sell a product, explain three social programmes, and hold up as an advocacy document — at once.",
      takeaways: [
        "Shaathi Foundation states that roughly 89% of Bangladesh's female population cannot afford sanitary napkins, and the site is built so that argument leads rather than sits beneath a product catalogue.",
        "Three reusable napkin lines — Shiuli, Jaba, and Shapla — are presented as the concrete answer to period poverty rather than as a storefront.",
        "Pages are statically generated with optimised imagery because most of the audience reads the site on a mid-range phone over a mobile connection.",
      ],
      stats: [
        { value: "89%", label: "of women in Bangladesh cannot afford napkins" },
        { value: "20,000", label: "women received free period kits" },
        { value: "8", label: "divisions covered" },
        { value: "3", label: "reusable product lines" },
      ],
      problem:
        "Roughly 89% of Bangladesh's female population cannot afford sanitary napkins. That statistic is the whole argument, and a site that buries it under a product catalogue fails the organisation. But Shaathi also genuinely sells three product lines and runs three distinct programmes, so a pure campaign site fails just as badly. The information architecture had to carry commerce and advocacy without either one flattening the other.",
      solution:
        "The narrative leads and the catalogue supports it: the scale of period poverty frames the landing experience, and the product lines — Shiuli, Jaba, and Shapla — appear as the concrete answer to it rather than as a storefront. Programmes get their own space so Safe Haven, economic empowerment, and health education can each be explained properly instead of compressed into one 'what we do' block. Everything is statically generated with optimised images, because a large share of the audience reads it on a mid-range phone over a mobile connection.",
      features: [
        "Product pages for the Shiuli, Jaba, and Shapla reusable napkin lines",
        "Dedicated sections for the three programmes: Safe Haven pad bank, women's economic empowerment, and menstrual health education",
        "Impact storytelling across the eight divisions Shaathi operates in",
        "Statically generated pages with optimised imagery for mobile-first, bandwidth-constrained readers",
        "Structured metadata so the organisation's mission surfaces in search and answer engines",
      ],
      outcomes: [
        "Commerce and advocacy live on one site without either diluting the other",
        "Programme work is explained in its own right rather than compressed into a single page",
        "Fast on mid-range phones, which is where the audience actually reads it",
      ],
      faqs: [
        {
          question: "What does Shaathi Foundation do?",
          answer:
            "Shaathi Foundation manufactures and distributes affordable reusable sanitary napkins in Bangladesh and runs menstrual hygiene education alongside them. Its programmes include the Safe Haven pad bank for schoolgirls, women's economic empowerment, and menstrual health education, operating across eight divisions.",
        },
        {
          question: "Why does the Shaathi site lead with statistics instead of products?",
          answer:
            "Roughly 89% of Bangladesh's female population cannot afford sanitary napkins, and that figure is the organisation's entire argument. Burying it under a catalogue would fail the advocacy half of the brief, so the scale of period poverty frames the landing experience and the three product lines appear as the answer to it.",
        },
        {
          question: "What are Shiuli, Jaba, and Shapla?",
          answer:
            "They are Shaathi Foundation's three lines of reusable, eco-friendly sanitary napkins.",
        },
        {
          question: "Why is the Shaathi site statically generated?",
          answer:
            "A large share of the audience reads it on a mid-range phone over a mobile connection. Static generation with optimised imagery keeps the pages fast on exactly those devices, which is where the content actually has to work.",
        },
      ],
      sources: [
        {
          label: "Shaathi Foundation",
          url: "https://shaathi.com.bd",
          publisher: "Shaathi Foundation",
        },
      ],
      entities: [
        { name: "Shaathi Foundation", url: "https://shaathi.com.bd", role: "Client" },
        ARITS,
      ],
      externalCaseStudy: null,
    },
  },
  {
    slug: "calternatives",
    title: "calternatives.org",
    description:
      "SEO-first headless CMS site for the Centre for Alternatives, an independent research and policy forum. WordPress with GraphQL and ACF behind a Next.js frontend — 65% improvement in search visibility and 70% faster development.",
    image: "/img/calternatives.png",
    stacks: ["Next.js 14", "Headless WordPress", "GraphQL", "ACF", "SSG/SSR", "Docker"],
    live: "https://www.calternatives.org",
    repo: null,
    category: "professional",
    schemaType: "WebSite",
    caseStudy: {
      client: "Centre for Alternatives",
      year: "2023",
      role: "Frontend Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        'The Centre for Alternatives is an independent research and policy forum established in 2003, publishing under the line "Ideas begin here". Its output — publications, the Bangladesh Peace Observatory, events, a fellowship programme — needed a site the researchers could run themselves.',
      takeaways: [
        "Moving calternatives.org to headless WordPress with GraphQL and ACF produced a 65% improvement in search visibility and 70% faster development on subsequent content work.",
        "Keeping WordPress as the editing surface meant the Centre's researchers needed no retraining, while Next.js took over delivery entirely.",
        "Each route picks static generation or server rendering by how often its content actually changes, so crawlers get complete HTML on the first request rather than a hydration shell.",
      ],
      stats: [
        { value: "65%", label: "improvement in search visibility" },
        { value: "70%", label: "faster development speed" },
        { value: "2003", label: "the forum's founding year" },
      ],
      problem:
        "A research organisation publishes constantly and cannot file a ticket for every post. But the people publishing are researchers, not developers, so the editing surface had to be WordPress-familiar. Meanwhile the whole point of publishing research is being found, and the previous site was not: search visibility was the actual deliverable, not a nice-to-have.",
      solution:
        "WordPress stays as the editing surface — familiar to the team, no retraining — but only as a headless content source queried over GraphQL, with Advanced Custom Fields giving each content type a real shape instead of a soup of post meta. Next.js renders it, choosing per route between static generation for stable pages and server rendering for anything that changes, so crawlers get complete HTML on first request rather than a hydration shell.",
      features: [
        "Headless WordPress with GraphQL and ACF — familiar editing, decoupled delivery",
        "Per-route SSG/SSR strategy chosen by how often the content actually changes",
        "Structured content types for publications, projects, events, and the fellowship programme",
        "Bangladesh Peace Observatory section with its own content model",
        "Idea submission flow for community contributions",
        "Dockerised build and deploy",
      ],
      outcomes: [
        "65% improvement in search visibility",
        "70% faster development speed on subsequent content work",
        "Researchers publish directly, with no developer in the loop",
      ],
      faqs: [
        {
          question: "What is the Centre for Alternatives?",
          answer:
            "The Centre for Alternatives is an independent, non-governmental research, deliberative, and policy forum established in 2003, promoting alternative thinking on society, the state, and the world. Its work spans publications, the Bangladesh Peace Observatory, events, and a fellowship programme.",
        },
        {
          question: "Why headless WordPress rather than a rebuild on a different CMS?",
          answer:
            "The people publishing are researchers, not developers. Keeping WordPress as the editing surface meant no retraining, while querying it over GraphQL with Advanced Custom Fields let Next.js own delivery and gave every content type a real shape instead of a soup of post meta.",
        },
        {
          question: "What results did the calternatives.org rebuild produce?",
          answer:
            "A 65% improvement in search visibility and a 70% increase in development speed on subsequent content work, with researchers able to publish directly and no developer in the loop.",
        },
      ],
      sources: [
        {
          label: "Centre for Alternatives",
          url: "https://www.calternatives.org",
          publisher: "Centre for Alternatives",
        },
      ],
      entities: [
        { name: "Centre for Alternatives", url: "https://www.calternatives.org", role: "Client" },
        ARITS,
      ],
      externalCaseStudy: null,
    },
  },
  {
    slug: "arits",
    title: "ARITS Limited",
    description:
      "Corporate site for ARITS Limited — a custom software firm in Dhaka and London with 400+ delivered projects. Headless WordPress with GraphQL and ACF, achieving a 45% improvement in search engine performance.",
    image: "/img/arits-image.png",
    stacks: ["Next.js", "TypeScript", "Headless WordPress", "GraphQL", "ACF", "TanStack Query"],
    live: "https://arits.tech",
    repo: null,
    category: "professional",
    schemaType: "WebSite",
    caseStudy: {
      client: "ARITS Limited",
      year: "2023 – 2025",
      role: "Frontend Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        'ARITS Limited builds custom software from offices in Dhaka and London, with more than ten years of operation and 400+ delivered projects behind the line "Build reliable software, faster." Its own site has to demonstrate the claim, not just make it.',
      takeaways: [
        "The ARITS corporate site rebuild produced a 45% improvement in search engine performance.",
        "Case studies are a structured content model rather than free-text pages, so every engagement renders consistently and stays comparable to the others.",
        "Headless WordPress with GraphQL and ACF lets the marketing team publish services and case studies without engineering involvement.",
      ],
      stats: [
        { value: "45%", label: "improvement in search performance" },
        { value: "400+", label: "projects delivered by ARITS" },
        { value: "10+", label: "years in operation" },
        { value: "2", label: "offices: Dhaka and London" },
      ],
      problem:
        "A software firm's website is a credibility test it either passes or fails in the first few seconds. Slow, bloated, or thin on evidence and the pitch collapses. It also has to keep pace with sales: new case studies, new service lines, new positioning, all landing on a marketing team's schedule rather than an engineering one.",
      solution:
        "Headless WordPress with GraphQL and ACF gives the marketing team full control of services and case studies while the delivery layer stays a fast Next.js frontend. Case studies get a first-class content model rather than being free-text pages, so each one renders consistently and stays comparable. The stack doubles as a demonstration: the site's own performance and search numbers are part of the argument it is making.",
      features: [
        "Headless WordPress + GraphQL + ACF authoring for services and case studies",
        "Structured case-study content model rendering consistently across every engagement",
        "Service pages spanning web, mobile, QA, DevOps, staff augmentation, MVP, and AI/ML",
        "Next.js frontend with TanStack Query for client-side data needs",
        "Metadata and structured data tuned for search visibility",
      ],
      outcomes: [
        "45% improvement in search engine performance",
        "Marketing publishes case studies and service pages without engineering involvement",
        "The site's own speed became part of the sales argument",
      ],
      faqs: [
        {
          question: "What is ARITS Limited?",
          answer:
            "ARITS Limited is a custom software development company with offices in Dhaka, Bangladesh and London, UK. It has more than ten years of operation and over 400 delivered projects, covering software and web development, mobile apps, QA, DevOps, staff augmentation, MVP development, and AI and machine learning.",
        },
        {
          question: "Why does a software company's own website need a structured case-study model?",
          answer:
            "Case studies written as free-text pages drift apart in shape and stop being comparable. Modelling them as a real content type in ACF means every engagement renders consistently, and the marketing team can publish a new one without engineering involvement.",
        },
        {
          question: "What did the ARITS site rebuild achieve?",
          answer:
            "A 45% improvement in search engine performance, and a publishing workflow where marketing ships case studies and service pages directly.",
        },
      ],
      sources: [
        {
          label: "ARITS Limited",
          url: "https://arits.tech",
          publisher: "ARITS Limited",
        },
      ],
      entities: [ARITS],
      externalCaseStudy: null,
    },
  },
  {
    slug: "sheraa",
    title: "SheRAA",
    description:
      "Website for SheRAA — the Women's Climate Resilience & Adaptation Alliance, convened by The Asia Foundation and Bonhishikha — amplifying women's leadership in climate action across Bangladesh.",
    image: "/img/sheraa.png",
    stacks: ["Next.js", "TypeScript", "Headless WordPress", "GraphQL", "ACF", "TanStack Query"],
    live: "https://sheraa.network",
    repo: null,
    category: "professional",
    schemaType: "WebSite",
    caseStudy: {
      client: "The Asia Foundation & Bonhishikha",
      year: "2024",
      role: "Frontend Engineer",
      publishedDate: CASE_STUDY_DATE,
      updatedDate: CASE_STUDY_DATE,
      overview:
        "SheRAA is an alliance working toward inclusive climate change programming in Bangladesh — a country ranked 8th globally for climate vulnerability, where climate disasters fall hardest on women through increased labour, displacement, reduced mobility, and lost access to resources.",
      takeaways: [
        "SheRAA is the Women's Climate Resilience & Adaptation Alliance, convened by The Asia Foundation and Bonhishikha to push for inclusive climate change programming in Bangladesh.",
        "The site's information architecture splits three audiences — prospective members, existing members, and researchers or press — so each has a direct path from the landing page.",
        "Impact Stories are a first-class content type documenting local adaptation practice, which keeps women's own expertise as the alliance's substance rather than as illustration.",
      ],
      stats: [
        { value: "8th", label: "Bangladesh's global climate-vulnerability rank" },
        { value: "2", label: "convening organisations" },
      ],
      problem:
        "An alliance site has a coordination problem before it has a design problem. Members need a directory, the coalition needs a joining path, and the substance — impact stories, publications, news — has to be findable by people who arrived for one of those three reasons and not the others. The framing matters too: the argument is women's leadership and local adaptation practice, not women as victims, and the site had to hold that line while still stating the vulnerability plainly.",
      solution:
        "The information architecture separates the three audiences — prospective members, existing members, and researchers or press — so each has a clear path from the landing page. Impact stories are treated as a first-class content type documenting local adaptation practices, which puts women's own expertise at the centre rather than in a sidebar. Headless WordPress with GraphQL and ACF lets the coalition publish stories, publications, and events without a developer.",
      features: [
        "Member directory and a Join Us path for prospective coalition members",
        "Impact Stories as a first-class content type documenting local adaptation practice",
        "Publications and News & Events sections, coalition-editable",
        "Headless WordPress + GraphQL + ACF authoring, Next.js delivery",
        "Metadata and structured data for research and press discoverability",
      ],
      outcomes: [
        "Three distinct audiences each get a direct path from the landing page",
        "The coalition publishes stories and publications without developer involvement",
        "Local adaptation expertise is presented as the alliance's substance, not as illustration",
      ],
      faqs: [
        {
          question: "What is SheRAA?",
          answer:
            "SheRAA is the Women's Climate Resilience & Adaptation Alliance, a coalition convened by The Asia Foundation and Bonhishikha that works toward inclusive climate change programming in Bangladesh and amplifies women's leadership in climate action.",
        },
        {
          question: "Why does the SheRAA site treat impact stories as a content type of their own?",
          answer:
            "The alliance's argument is women's leadership and local adaptation practice, not women as victims. Modelling impact stories as a first-class content type rather than blog posts keeps that documented expertise at the centre of the site instead of in a sidebar.",
        },
        {
          question: "Who can join SheRAA?",
          answer:
            "The site carries a member directory and a Join Us path for prospective coalition members; the alliance is aimed at organisations working on inclusive climate programming in Bangladesh.",
        },
      ],
      sources: [
        {
          label: "SheRAA — Women's Climate Resilience & Adaptation Alliance",
          url: "https://sheraa.network",
          publisher: "SheRAA",
        },
        { label: "The Asia Foundation", url: ASIA_FOUNDATION, publisher: "The Asia Foundation" },
        { label: "Bonhishikha — unlearn gender", url: BONHISHIKHA, publisher: "Bonhishikha" },
      ],
      entities: [
        { name: "The Asia Foundation", url: ASIA_FOUNDATION, role: "Convenor" },
        { name: "Bonhishikha", url: BONHISHIKHA, role: "Convenor" },
        ARITS,
      ],
      externalCaseStudy: null,
    },
  },
  {
    slug: "weather-app",
    title: "Weather App",
    description:
      "A simple weather application that lets users enter a city name and view current weather conditions via the OpenWeatherMap API.",
    image: "/img/weatherAppSS.png",
    stacks: ["React.js", "OpenWeatherMap"],
    live: "https://weatherappshafindev.netlify.app/",
    repo: "https://github.com/Shafin580/react-weather-app",
    category: "personal",
    schemaType: "CreativeWork",
    caseStudy: null,
  },
  {
    slug: "keeper-app",
    title: "Keeper App",
    description:
      "A React application for creating, managing, and deleting personal notes and to-do list items.",
    image: "/img/keeperSS.png",
    stacks: ["React.js", "JavaScript"],
    live: "https://keepershafindev.netlify.app/",
    repo: "https://github.com/Shafin580/react-keeper-app",
    category: "personal",
    schemaType: "CreativeWork",
    caseStudy: null,
  },
  {
    slug: "fence-jumper",
    title: "Fence Jumper",
    description:
      "A browser-based side-scroller game built with vanilla JavaScript and the p5.js creative coding library.",
    image: "/img/fenceJumperSS.png",
    stacks: ["JavaScript", "p5.js"],
    live: "https://shafin580.github.io/fenceJumper.github.io/",
    repo: "https://github.com/Shafin580/fenceJumper.github.io",
    category: "personal",
    schemaType: "CreativeWork",
    caseStudy: null,
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
      "Shafin Ahmed is a Full-Stack Software Engineer based in Dhaka, Bangladesh, with 4+ years of experience building production-grade web applications. He currently works as a Software Engineer at ARITS Limited, where he has progressed from intern to engineer since 2022, leading frontend architecture on products including HumR (an in-house multi-company HR platform), a UK rental platform, and multiple client-facing websites.",
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
      "Notable work includes HumR, an in-house multi-company HR platform with subdomain SSO and a dynamic form builder; Oporajita, a real-time programme dashboard for The Asia Foundation used by 15 partner organisations; Bullwip, a rental onboarding platform for the UK housing market; Datafast, an Electron desktop app with Puppeteer automation; and SEO-first headless WordPress sites including calternatives.org, arits.tech, sheraa.network and shaathi.com.bd.",
  },
  {
    question: "How many years of experience does Shafin Ahmed have?",
    answer:
      "Over 4 years. He joined ARITS Limited as an internship trainee in June 2022, became a Junior Software Engineer in September 2022, and was promoted to Software Engineer in June 2024.",
  },
  {
    question: "Does Shafin Ahmed work with international clients?",
    answer:
      "Yes. His work includes Bullwip for the UK housing market, the Oporajita programme dashboard for The Asia Foundation, and calternatives.org — all delivered remotely from Dhaka, Bangladesh.",
  },
  {
    question: "What is Shafin Ahmed's educational background?",
    answer:
      "A BSc in Computer Science & Engineering from American International University-Bangladesh (January 2018 – April 2022), graduating with a GPA of 3.58 / 4.0. His thesis covered machine learning for sentence-level sentiment detection. He also holds a Responsive Web Development certification from CodersTrust (March 2020).",
  },
];

export const professionalProjects = projects.filter((p) => p.category === "professional");
export const personalProjects = projects.filter((p) => p.category === "personal");

/**
 * Projects with a write-up, in the order they appear on the homepage.
 *
 * This is the authority for which `/projects/<slug>` routes exist —
 * `generateStaticParams`, the sitemap, and the prev/next navigation all read
 * from it, so a project gains or loses a detail page purely by gaining or
 * losing its `caseStudy`.
 */
export const caseStudyProjects = projects.filter((p) => p.caseStudy !== null);

/** Flat list of every skill, used for schema.org `knowsAbout`. */
export const allSkills: string[] = Object.values(skills).flat();

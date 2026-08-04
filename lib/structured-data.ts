import {
  allSkills,
  certification,
  education,
  experience,
  faqs,
  profile,
  projects,
  type NamedEntity,
  type Project,
} from "@/lib/portfolio-data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { LinkState } from "@/lib/link-status";

/**
 * One linked `@graph` rather than a pile of disconnected schema blobs — the
 * `@id` cross-references are what let a crawler resolve "the person", "the
 * page" and "the projects" into a single entity instead of three guesses.
 *
 * Everything is derived from lib/portfolio-data.ts, so the structured data
 * cannot drift away from what is rendered on the page.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;
const ORG_ID = `${SITE_URL}/#arits`;

/** Canonical `@id` for a project, so the homepage list and its own page agree. */
const projectId = (project: Project) => `${SITE_URL}/projects/${project.slug}#project`;

/**
 * Stable `@id` for a named organisation, derived from its official URL.
 *
 * The same organisation appears across several case studies (ARITS on all of
 * them, The Asia Foundation on two). Deriving the id from the URL means every
 * page refers to the *same* entity rather than minting a fresh anonymous node
 * each time — which is the difference between a crawler resolving
 * "The Asia Foundation" and it guessing.
 */
const entityId = (entity: NamedEntity) =>
  `${SITE_URL}/#org-${entity.url.replace(/^https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, "").toLowerCase()}`;

function organizationNode(entity: NamedEntity) {
  return {
    "@type": "Organization",
    "@id": entityId(entity),
    name: entity.name,
    url: entity.url,
    sameAs: [entity.url],
  };
}

/**
 * A project as a schema.org node.
 *
 * The `@type` comes from `project.schemaType` — an application and a marketing
 * site are genuinely different things, and collapsing both to `CreativeWork`
 * throws away precision a crawler can use.
 *
 * `url` points at our own case-study page when one exists — that is the
 * canonical page *about* the work. The client's live site is a different
 * resource, so it goes in `sameAs`, still gated on the build-time liveness
 * ping. Projects with no case study keep the older behaviour of using the live
 * site as `url`, since there is nothing else to point at.
 */
function projectNode(project: Project, isLive: boolean) {
  const live = project.live && isLive ? project.live : undefined;
  const caseStudyUrl = project.caseStudy ? absoluteUrl(`/projects/${project.slug}`) : undefined;

  return {
    "@type": project.schemaType,
    "@id": projectId(project),
    name: project.title,
    description: project.description,
    keywords: project.stacks.join(", "),
    ...(caseStudyUrl ? { url: caseStudyUrl } : live ? { url: live } : {}),
    ...(caseStudyUrl && live ? { sameAs: [live] } : {}),
    ...(project.repo ? { codeRepository: project.repo } : {}),
    ...(project.image ? { image: absoluteUrl(project.image) } : {}),
    creator: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}

/**
 * The `@graph` for a single `/projects/<slug>` page.
 *
 * Beyond the work itself it carries: every organisation named on the page as a
 * resolvable `Organization` with `sameAs`; the external documents backing the
 * page's claims as `citation`; a `FAQPage` whose questions are the *same array*
 * the accordion renders; and a `BreadcrumbList` that mirrors the visible trail
 * item for item — Google grants the breadcrumb rich result on that
 * correspondence, so the two must never be edited apart.
 */
export function buildProjectStructuredData(project: Project, isLive: boolean) {
  const study = project.caseStudy;
  const pageUrl = absoluteUrl(`/projects/${project.slug}`);

  if (!study) {
    return {
      "@context": "https://schema.org",
      "@graph": [projectNode(project, isLive)],
    };
  }

  // The client is the subject of the work; everyone else named is a mention.
  const client = study.entities.find((e) => e.name === study.client) ?? study.entities[0];
  const mentions = study.entities.filter((e) => e !== client);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.name,
        jobTitle: profile.title,
        url: SITE_URL,
      },
      ...study.entities.map(organizationNode),
      {
        ...projectNode(project, isLive),
        abstract: study.overview,
        datePublished: study.publishedDate,
        dateModified: study.updatedDate,
        ...(client ? { sponsor: { "@id": entityId(client) }, about: { "@id": entityId(client) } } : {}),
        ...(mentions.length ? { mentions: mentions.map((e) => ({ "@id": entityId(e) })) } : {}),
        ...(study.sources.length
          ? {
              citation: study.sources.map((source) => ({
                "@type": "CreativeWork",
                name: source.label,
                url: source.url,
                publisher: { "@type": "Organization", name: source.publisher },
              })),
            }
          : {}),
        ...(study.externalCaseStudy
          ? { subjectOf: { "@type": "CreativeWork", url: study.externalCaseStudy } }
          : {}),
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${project.title} — Case Study`,
        description: study.overview,
        datePublished: study.publishedDate,
        dateModified: study.updatedDate,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": projectId(project) },
        // The project screenshot, not the OG card: `generateImageMetadata`
        // gives the card a hashed URL that cannot be constructed here, and a
        // `primaryImageOfPage` pointing at a 404 is worse than none.
        ...(project.image ? { primaryImageOfPage: absoluteUrl(project.image) } : {}),
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        inLanguage: "en",
        // Points assistants at the two blocks written to be read aloud: the
        // one-paragraph overview and the standalone takeaway sentences.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable='overview']", "[data-speakable='takeaways']"],
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/#projects` },
          { "@type": "ListItem", position: 3, name: project.title, item: pageUrl },
        ],
      },
      ...(study.faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              isPartOf: { "@id": `${pageUrl}#webpage` },
              mainEntity: study.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };
}

export function buildStructuredData(linkStatus: Record<string, LinkState>) {
  const current = experience[0];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.name,
        jobTitle: profile.title,
        description: profile.tagline,
        url: SITE_URL,
        email: `mailto:${profile.email}`,
        image: absoluteUrl(profile.photo),
        sameAs: [profile.github, profile.linkedin],
        knowsAbout: allSkills,
        knowsLanguage: ["English", "Bengali"],
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.locality,
          addressRegion: profile.region,
          addressCountry: profile.country,
        },
        homeLocation: {
          "@type": "Place",
          name: `${profile.locality}, ${profile.countryName}`,
        },
        worksFor: { "@id": ORG_ID },
        hasOccupation: {
          "@type": "Occupation",
          name: profile.title,
          occupationalCategory: "15-1252.00", // O*NET: Software Developers
          skills: allSkills.join(", "),
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: education.institution,
          address: {
            "@type": "PostalAddress",
            addressLocality: profile.locality,
            addressCountry: profile.country,
          },
        },
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: education.degree,
            credentialCategory: "degree",
            educationalLevel: "Bachelor's Degree",
            recognizedBy: { "@type": "CollegeOrUniversity", name: education.institution },
            validIn: { "@type": "Country", name: profile.countryName },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: certification.name,
            credentialCategory: "certificate",
            recognizedBy: { "@type": "Organization", name: certification.issuer },
            dateCreated: certification.dateISO,
          },
        ],
        workExample: projects.map((project) =>
          projectNode(project, Boolean(project.live) && linkStatus[project.live!] === "alive"),
        ),
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: profile.employer,
        url: profile.employerUrl,
        employee: { "@id": PERSON_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: `${profile.name} — ${profile.title}`,
        description: profile.tagline,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": PAGE_ID,
        url: SITE_URL,
        name: `${profile.name} — ${profile.title}`,
        description: profile.tagline,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
        primaryImageOfPage: absoluteUrl("/opengraph-image"),
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        name: `Projects by ${profile.name}`,
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: projectNode(
            project,
            Boolean(project.live) && linkStatus[project.live!] === "alive",
          ),
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        isPartOf: { "@id": PAGE_ID },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "EmployeeRole",
        roleName: current.role,
        startDate: current.startDate,
        "@id": `${SITE_URL}/#current-role`,
      },
    ],
  };
}

import {
  allSkills,
  certification,
  education,
  experience,
  faqs,
  profile,
  projects,
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

function projectNode(project: Project, linkStatus: Record<string, LinkState>) {
  const live = project.live && linkStatus[project.live] === "alive" ? project.live : undefined;

  return {
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    keywords: project.stacks.join(", "),
    ...(live ? { url: live } : {}),
    ...(project.repo ? { codeRepository: project.repo } : {}),
    ...(project.image ? { image: absoluteUrl(project.image) } : {}),
    creator: { "@id": PERSON_ID },
    inLanguage: "en",
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
        workExample: projects.map((project) => projectNode(project, linkStatus)),
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
          item: projectNode(project, linkStatus),
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

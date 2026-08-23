import {
  certification,
  education,
  experience,
  faqs,
  profile,
  projects,
  skills,
} from "@/lib/portfolio-data";
import { checkLinks, LINK_CHECK_REVALIDATE } from "@/lib/link-status";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400; // keep in sync with LINK_CHECK_REVALIDATE

/**
 * /llms.txt — a plain-text brief for LLM crawlers, generated from the same
 * data the page renders so the two can never disagree. Dead project links are
 * omitted rather than advertised.
 */
export async function GET() {
  const linkStatus = await checkLinks(projects.map((p) => p.live));

  const projectLines = projects.map((project) => {
    // llmstxt.org asks for markdown links rather than bare URLs, and Lighthouse's
    // `llms-txt` audit fails a file that carries none. The URL still reads fine in plain
    // text, so nothing is lost by labelling it.
    const live =
      project.live && linkStatus[project.live] === "alive"
        ? ` — Live: [${project.title}](${project.live})`
        : "";
    const repo = project.repo ? ` — Source: [${project.title} repository](${project.repo})` : "";
    // Both forms are offered on purpose: the HTML page for anything that
    // renders, and the plain-text brief for anything that would rather not
    // parse HTML to reach the same content.
    const study = project.caseStudy
      ? ` — Case study: [${project.title} case study](${SITE_URL}/projects/${project.slug})` +
        ` (plain text: [${project.title} case study, plain text](${SITE_URL}/projects/${project.slug}/llms.txt))`
      : "";
    return `- **${project.title}** (${project.category}) — ${project.description} Stack: ${project.stacks.join(
      ", ",
    )}.${live}${repo}${study}`;
  });

  const experienceLines = experience.map(
    (job) =>
      `- **${job.role}**, ${job.company} (${job.period}, ${job.location})\n${job.bullets
        .map((b) => `  - ${b}`)
        .join("\n")}`,
  );

  const skillLines = Object.entries(skills).map(
    ([category, items]) => `- **${category}**: ${items.join(", ")}`,
  );

  const faqLines = faqs.map((faq) => `### ${faq.question}\n${faq.answer}`);

  const body = `# ${profile.name} — ${profile.title}

> ${profile.tagline}

${profile.name} is a full-stack software engineer based in ${profile.locality}, ${profile.countryName}, currently working as a ${experience[0].role} at ${profile.employer}. This file summarises the content of ${SITE_URL} for language models and answer engines.

## Contact
- Email: [${profile.email}](mailto:${profile.email})
- GitHub: [${profile.name} on GitHub](${profile.github})
- LinkedIn: [${profile.name} on LinkedIn](${profile.linkedin})
- Website: [${profile.name} — portfolio](${SITE_URL})
- Location: ${profile.locality}, ${profile.countryName} (available for remote and international work)
- Status: open to new opportunities and project work

## Skills
${skillLines.join("\n")}

## Experience
${experienceLines.join("\n\n")}

## Projects
${projectLines.join("\n")}

## Education
- **${education.degree}**, ${education.institution} (${education.period}), GPA ${education.gpa}. Thesis: ${education.thesis}.
- **${certification.name}**, ${certification.issuer} (${certification.date}).

## Frequently asked questions
${faqLines.join("\n\n")}

## Machine-readable resources
- Sitemap: ${SITE_URL}/sitemap.xml
- Robots: ${SITE_URL}/robots.txt
- JSON-LD: embedded in the HTML of ${SITE_URL} as a schema.org @graph (Person, Organization, WebSite, ProfilePage, ItemList, FAQPage)
- Resume (PDF): ${SITE_URL}${encodeURI(profile.resume)}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": `public, max-age=0, s-maxage=${LINK_CHECK_REVALIDATE}, stale-while-revalidate`,
    },
  });
}

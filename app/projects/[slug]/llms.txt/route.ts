import { notFound } from "next/navigation";
import { caseStudyProjects, profile } from "@/lib/portfolio-data";
import { checkLinks, LINK_CHECK_REVALIDATE } from "@/lib/link-status";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const revalidate = 86400; // keep in sync with LINK_CHECK_REVALIDATE
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.slug }));
}

/**
 * /projects/<slug>/llms.txt — the full case study as plain text.
 *
 * The HTML page carries the same content wrapped in layout, animation, and
 * theming that a language model has to strip before it can read anything. This
 * route hands over the substance directly, generated from the same
 * `lib/portfolio-data.ts` entry the page renders, so the two cannot disagree.
 * Linked from the page via `alternates.types` and from the site-wide
 * `/llms.txt`.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseStudyProjects.find((p) => p.slug === slug);

  if (!project?.caseStudy) notFound();

  const study = project.caseStudy;
  const pageUrl = absoluteUrl(`/projects/${project.slug}`);

  // Same build-time liveness gate the page and the schema use — a dead link is
  // omitted rather than advertised.
  const linkStatus = await checkLinks([project.live]);
  const live = project.live && linkStatus[project.live] === "alive" ? project.live : null;

  const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

  const sections = [
    `# ${project.title} — Case Study`,
    ``,
    `> ${study.overview}`,
    ``,
    `Canonical page: ${pageUrl}`,
    `Author: ${profile.name}, ${profile.title} (${SITE_URL})`,
    study.client ? `Client: ${study.client}` : `Client: in-house product at ${profile.employer}`,
    `Timeline: ${study.year}`,
    `Role: ${study.role}`,
    `Published: ${study.publishedDate} · Updated: ${study.updatedDate}`,
    live ? `Live site: ${live}` : null,
    project.repo ? `Source: ${project.repo}` : null,
    study.externalCaseStudy ? `Client write-up: ${study.externalCaseStudy}` : null,
    ``,
    `## Key takeaways`,
    bullets(study.takeaways),
    study.stats.length
      ? `\n## Key figures\n${study.stats.map((s) => `- ${s.value} — ${s.label}`).join("\n")}`
      : null,
    ``,
    `## The problem`,
    study.problem,
    ``,
    `## The approach`,
    study.solution,
    ``,
    `## What it does`,
    bullets(study.features),
    ``,
    `## Stack`,
    project.stacks.join(", "),
    ``,
    `## Outcome`,
    bullets(study.outcomes),
    study.faqs.length
      ? `\n## Frequently asked questions\n${study.faqs
          .map((faq) => `### ${faq.question}\n${faq.answer}`)
          .join("\n\n")}`
      : null,
    study.entities.length
      ? `\n## Organisations named\n${study.entities
          .map((entity) => `- ${entity.name} (${entity.role}) — ${entity.url}`)
          .join("\n")}`
      : null,
    study.sources.length
      ? `\n## Sources\n${study.sources
          .map((source) => `- ${source.label} — ${source.publisher} — ${source.url}`)
          .join("\n")}`
      : null,
    ``,
    `---`,
    `Full project index: ${SITE_URL}/llms.txt`,
  ];

  const body = `${sections.filter((line) => line !== null).join("\n")}\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": `public, max-age=0, s-maxage=${LINK_CHECK_REVALIDATE}, stale-while-revalidate`,
    },
  });
}

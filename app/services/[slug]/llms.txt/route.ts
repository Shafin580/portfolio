import { notFound } from "next/navigation";
import {
  caseStudyProjects,
  formatOfferPrice,
  platformProfiles,
  profile,
  services,
  servicesCheckedDate,
} from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";

// Nothing here depends on the request, so every slug is built once at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

/**
 * /services/<slug>/llms.txt — one service as plain text: what is included, the
 * track record behind it, every live marketplace listing with its starting
 * price, and the FAQ. Generated from the same `lib/portfolio-data.ts` entry the
 * HTML page renders, so the two cannot disagree. Linked from the page via
 * `alternates.types` and from the site-wide `/llms.txt`.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) notFound();

  const pageUrl = absoluteUrl(`/services/${service.slug}`);
  const related = caseStudyProjects.filter((p) => service.relatedProjects.includes(p.slug));
  const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

  const sections = [
    `# ${service.headline}`,
    ``,
    `> ${service.summary}`,
    ``,
    `- Canonical page: [${service.headline}](${pageUrl})`,
    `- Provider: [${profile.name}](${SITE_URL}), ${profile.title}, ${profile.locality}, ${profile.countryName}`,
    `- Listings checked: ${servicesCheckedDate}`,
    ``,
    `## Where to hire`,
    service.offers
      .map(
        (offer) =>
          `- **${platformProfiles[offer.platform].name}** — from ${formatOfferPrice(offer)}: [${offer.title}](${offer.url})`,
      )
      .join("\n"),
    ``,
    `## What you get`,
    bullets(service.deliverables),
    ``,
    `## Track record`,
    bullets(service.proof),
    related.length
      ? `\nRelated case studies:\n${related
          .map((p) => `- [${p.title}](${absoluteUrl(`/projects/${p.slug}`)})`)
          .join("\n")}`
      : null,
    ``,
    `## Stack`,
    service.stacks.join(", "),
    ``,
    `## Frequently asked questions`,
    service.faqs.map((faq) => `### ${faq.question}\n${faq.answer}`).join("\n\n"),
    ``,
    `---`,
    `All services: ${SITE_URL}/services — full index: ${SITE_URL}/llms.txt`,
  ];

  const body = `${sections.filter((line) => line !== null).join("\n")}\n`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

import { caseStudyProjects, profile } from "@/lib/portfolio-data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.slug }));
}

/**
 * Per-project `alt` text.
 *
 * A static `export const alt` would put the same string on all eight cards.
 * `generateImageMetadata` is the documented hook for varying it per route —
 * the returned `id` becomes the argument to the default export below.
 */
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseStudyProjects.find((p) => p.slug === slug);
  const client = project?.caseStudy?.client;

  return [
    {
      // Constant, not the slug: there is exactly one card per route, and `id`
      // only has to be unique *within* the route. Deriving it from `params`
      // fails during page-data collection, when the segment is not yet bound.
      id: "og",
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
      alt: project
        ? `${project.title} case study${client ? ` for ${client}` : ""} by ${profile.name}`
        : `Case study by ${profile.name}`,
    },
  ];
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = caseStudyProjects.find((p) => p.slug === slug);

  // The route only generates for known slugs, but the root card is a sane
  // fallback rather than a failed image response.
  if (!project?.caseStudy) {
    return renderOgCard({
      title: profile.name,
      subtitle: profile.title,
      body: profile.tagline,
      chips: ["Next.js", "TypeScript", "Laravel"],
    });
  }

  return renderOgCard({
    eyebrow: "Case study",
    title: project.title,
    subtitle: project.caseStudy.client ?? `${profile.employer} · in-house`,
    body: project.description,
    chips: project.stacks.slice(0, 5),
  });
}

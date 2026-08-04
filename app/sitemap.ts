import type { MetadataRoute } from "next";
import { caseStudyProjects } from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/**
 * `lastModified` comes from the content, never from `new Date()`.
 *
 * A `lastmod` that changes on every build is a `lastmod` crawlers learn to
 * ignore — it claims the whole site changed every time CI ran. Each case study
 * reports its own `updatedDate`, and the root reports the newest of them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const projectEntries = caseStudyProjects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.caseStudy!.updatedDate),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const newest = caseStudyProjects
    .map((project) => project.caseStudy!.updatedDate)
    .sort()
    .at(-1);

  return [
    {
      url: SITE_URL,
      lastModified: newest ? new Date(newest) : undefined,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectEntries,
  ];
}

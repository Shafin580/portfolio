import type { MetadataRoute } from "next";
import { caseStudyProjects, services } from "@/lib/portfolio-data";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/**
 * `lastModified` comes from the content, never from `new Date()`.
 *
 * A `lastmod` that changes on every build is a `lastmod` crawlers learn to
 * ignore — it claims the whole site changed every time CI ran. Each case study
 * and service reports its own `updatedDate`; the root and the services hub
 * report the newest of the entries they list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const projectEntries = caseStudyProjects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.caseStudy!.updatedDate),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const serviceEntries = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: new Date(service.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newestService = services
    .map((service) => service.updatedDate)
    .sort()
    .at(-1);

  const newest = [...caseStudyProjects.map((project) => project.caseStudy!.updatedDate), newestService]
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  return [
    {
      url: SITE_URL,
      lastModified: newest ? new Date(newest) : undefined,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: newestService ? new Date(newestService) : undefined,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...serviceEntries,
    ...projectEntries,
  ];
}

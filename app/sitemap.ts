import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shafinwebology.com";
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
  ];
}

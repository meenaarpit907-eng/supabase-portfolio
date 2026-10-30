import type { MetadataRoute } from "next";
import { getPortfolioContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const { projects, profile } = await getPortfolioContent();

  return [
    { url: site, lastModified: new Date(profile.updated_at), changeFrequency: "weekly", priority: 1 },
    ...projects.map((project) => ({
      url: `${site}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}

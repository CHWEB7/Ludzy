import type { MetadataRoute } from "next";
import { fetchPublishedBlogs } from "@/lib/blogs-db";
import { localAreas } from "@/lib/local-seo";
import { previousEvents } from "@/lib/events-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ludzy.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const areaPages: MetadataRoute.Sitemap = localAreas.map((area) => ({
    url: `${SITE_URL}/areas/${area.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const eventPages: MetadataRoute.Sitemap = previousEvents.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const publishedBlogs = await fetchPublishedBlogs();
  const blogPages: MetadataRoute.Sitemap = (publishedBlogs ?? []).map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: blog.published_at ?? blog.updated_at ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...areaPages, ...eventPages, ...blogPages];
}

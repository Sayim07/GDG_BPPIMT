import type { MetadataRoute } from "next";
import { ALL_EVENTS } from "@/data/all-events";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bppimtgdg.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/certificate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/social`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const eventRoutes: MetadataRoute.Sitemap = ALL_EVENTS.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: event.date ? new Date(event.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}

import type { MetadataRoute } from "next";
import { cards } from "@/lib/tarot";
import { scenarioList } from "@/lib/reading-scenarios";

const base = "https://tarot.realizemylife.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/card-meanings", "/fortune-cookie", "/about", "/privacy"];
  const cardRoutes = cards.map((card) => `/card-meanings/${card.slug}`);
  const readingRoutes = Array.from(new Set(scenarioList(false).map((reading) => `/reading/${reading.id}`)));

  return [...staticRoutes, ...cardRoutes, ...readingRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/card-meanings/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/reading/") ? 0.8 : 0.7,
  }));
}

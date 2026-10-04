import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { href, locales, routes, type RouteKey } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(routes) as RouteKey[];
  return keys.flatMap((key) =>
    locales.map((lang) => ({
      url: `${site.url}${href(lang, key)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: key === "home" ? 1 : key === "distributors" ? 0.9 : key === "privacy" ? 0.2 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${href(l, key)}`])),
      },
    })),
  );
}

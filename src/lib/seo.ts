import type { Metadata } from "next";
import { site } from "@/data/site";
import { href, locales, type Locale, type RouteKey } from "@/i18n/config";

const OG_LOCALE: Record<Locale, string> = { es: "es_PE", en: "en_US" };

/**
 * Metadatos completos de una página: canonical, hreflang, Open Graph (WhatsApp,
 * Facebook, LinkedIn) y Twitter/X, con su imagen de vista previa propia
 * (public/og/{lang}-{key}.jpg, 1200×630, generada por scripts/optimize-assets.py).
 */
export function pageMetadata({
  lang,
  key,
  title,
  description,
  absoluteTitle = false,
}: {
  lang: Locale;
  key: RouteKey;
  title: string;
  description: string;
  /** true en la portada: el título no lleva el sufijo " | D'Cora Hogar" */
  absoluteTitle?: boolean;
}): Metadata {
  const url = href(lang, key);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const image = {
    url: `/og/${lang}-${key}.jpg`,
    width: 1200,
    height: 630,
    alt: fullTitle,
    type: "image/jpeg",
  };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l === "es" ? "es-PE" : "en", href(l, key)])),
        "x-default": href("es", key),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

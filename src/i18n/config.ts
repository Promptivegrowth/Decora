export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/**
 * Rutas públicas por idioma. La carpeta interna en src/app/[lang] usa el slug en español;
 * el proxy reescribe los slugs en inglés hacia esa carpeta.
 */
export const routes = {
  home: { es: "", en: "" },
  about: { es: "nosotros", en: "about" },
  products: { es: "productos", en: "products" },
  distributors: { es: "quiero-ser-distribuidor", en: "become-a-distributor" },
  contact: { es: "contacto", en: "contact" },
  privacy: { es: "privacidad", en: "privacy" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function href(locale: Locale, key: RouteKey, hash?: string) {
  const slug = routes[key][locale];
  return `/${locale}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Busca la ruta a partir de un slug en cualquier idioma. */
export function routeFromSlug(slug: string): RouteKey | undefined {
  return (Object.keys(routes) as RouteKey[]).find(
    (k) => routes[k].es === slug || routes[k].en === slug,
  );
}

/** Convierte la URL actual al otro idioma conservando la página. */
export function switchLocalePath(pathname: string, target: Locale) {
  const [, , slug = "", ...rest] = pathname.split("/");
  const key = routeFromSlug(slug) ?? "home";
  const base = href(target, key);
  return rest.length ? `${base}/${rest.join("/")}` : base;
}

import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, routes, type Locale } from "@/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && hasLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) if (hasLocale(lang)) return lang;
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = "", slug = "", ...rest] = pathname.split("/");

  // Sin idioma en la URL → redirigir al preferido
  if (!hasLocale(first)) {
    const locale = preferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  if (!slug) return NextResponse.next();

  const entry = Object.values(routes).find((r) => r.es === slug || r.en === slug);
  if (!entry) return NextResponse.next();

  const publicSlug = entry[first];
  const suffix = rest.length ? `/${rest.join("/")}` : "";

  // Slug de otro idioma (p. ej. /en/nosotros) → redirigir al slug correcto
  if (slug !== publicSlug) {
    const url = request.nextUrl.clone();
    url.pathname = `/${first}/${publicSlug}${suffix}`;
    return NextResponse.redirect(url, 308);
  }

  // Slug público en inglés → reescribir a la carpeta interna (en español)
  if (entry.es !== slug) {
    const url = request.nextUrl.clone();
    url.pathname = `/${first}/${entry.es}${suffix}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/i18n/config";

function rememberLocale(l: Locale) {
  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
}

export function LangSwitch({
  lang,
  label,
  tone = "light",
  className = "",
}: {
  lang: Locale;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const pathname = usePathname() ?? `/${lang}`;
  return (
    <div
      role="group"
      aria-label={label}
      className={`relative flex items-center rounded-full p-1 text-[0.7rem] font-bold tracking-[0.14em] ring-1 ring-inset transition-colors duration-500 ${
        tone === "light" ? "ring-cream/30 text-cream" : "ring-navy/15 text-navy"
      } ${className}`}
    >
      {locales.map((l) => {
        const active = l === lang;
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            onClick={() => rememberLocale(l)}
            scroll={false}
            className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors duration-300 ${
              active ? "text-navy" : "opacity-70 hover:opacity-100"
            }`}
          >
            {active && <span className="absolute inset-0 -z-10 rounded-full bg-gold" aria-hidden />}
            {l}
          </Link>
        );
      })}
    </div>
  );
}

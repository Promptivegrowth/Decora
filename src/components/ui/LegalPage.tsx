import Link from "next/link";
import { ArrowRight, BookOpen, Lock, ShieldCheck } from "lucide-react";
import { site } from "@/data/site";
import { href, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { PageHero } from "./PageHero";

type Legal = {
  title: string;
  updated: string;
  intro: string;
  sections: { id: string; h: string; lead?: string[]; list?: string[]; p?: string[] }[];
};

const fill = (s: string) =>
  s
    .replaceAll("{legalName}", site.legalName)
    .replaceAll("{ruc}", site.ruc || "—")
    .replaceAll("{address}", site.fiscalAddress || "Lima, Perú")
    .replaceAll("{phone}", site.phoneDisplay);

/** Página legal con índice lateral (privacidad, seguridad). */
export function LegalPage({
  lang,
  dict,
  data,
  current,
  image,
}: {
  lang: Locale;
  dict: Dictionary;
  data: Legal;
  current: RouteKey;
  image: string;
}) {
  const related: { key: RouteKey; label: string; Icon: typeof Lock }[] = [
    { key: "privacy", label: dict.footer.privacy, Icon: Lock },
    { key: "security", label: dict.footer.security, Icon: ShieldCheck },
    { key: "complaints", label: dict.footer.complaints, Icon: BookOpen },
  ];
  return (
    <>
      <PageHero
        eyebrow={dict.footer.legal}
        title={data.title}
        text={data.updated}
        image={image}
        crumbs={[{ label: dict.nav.home, href: href(lang, "home") }, { label: data.title }]}
      />
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <nav aria-label={data.title} className="hidden rounded-[1.5rem] p-6 ring-1 ring-navy/10 lg:block">
                <ol className="space-y-2.5 text-sm">
                  {data.sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex gap-3 text-navy/70 transition-colors hover:text-teal">
                        <span className="font-display text-xs font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                        {s.h}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <ul className="space-y-2">
                {related
                  .filter((r) => r.key !== current)
                  .map(({ key, label, Icon }) => (
                    <li key={key}>
                      <Link
                        href={href(lang, key)}
                        className="group flex items-center gap-3 rounded-2xl bg-navy p-4 text-sm font-semibold text-cream transition-colors hover:bg-teal"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{label}</span>
                        <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <p className="text-lg leading-relaxed text-navy/80">{fill(data.intro)}</p>
            <div className="mt-12 space-y-12">
              {data.sections.map((s, i) => (
                <article key={s.id} id={s.id} className="scroll-mt-28 border-t border-navy/10 pt-10">
                  <h2 className="flex items-baseline gap-3 text-2xl sm:text-3xl">
                    <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                    {s.h}
                  </h2>
                  {s.lead?.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed text-navy/75">
                      {fill(p)}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="mt-4 space-y-2.5">
                      {s.list.map((li) => (
                        <li key={li} className="flex gap-3 leading-relaxed text-navy/75">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          {fill(li)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.p?.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed text-navy/75">
                      {fill(p)}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

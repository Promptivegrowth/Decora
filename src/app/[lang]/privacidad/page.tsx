import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.privacy.title,
    description: d.meta.privacy.description,
    alternates: { canonical: href(lang, "privacy") },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacidad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  return (
    <>
      <PageHero
        eyebrow={d.footer.privacy}
        title={d.privacy.title}
        text={d.privacy.updated}
        image="/images/oficina.webp"
        crumbs={[{ label: d.nav.home, href: href(lang, "home") }, { label: d.privacy.title }]}
      />
      <section className="py-20 sm:py-28">
        <div className="container-x max-w-3xl space-y-10">
          {d.privacy.sections.map((s, i) => (
            <article key={s.h}>
              <h2 className="flex items-baseline gap-3 text-2xl">
                <span className="font-display text-sm text-gold">0{i + 1}</span>
                {s.h}
              </h2>
              <p className="mt-3 leading-relaxed text-navy/75">{s.p}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

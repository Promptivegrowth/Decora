import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Clock, Lock, ShieldCheck } from "lucide-react";
import { site } from "@/data/site";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ComplaintForm } from "@/components/forms/ComplaintForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/libro-de-reclamaciones">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.complaints.title,
    description: d.meta.complaints.description,
    alternates: {
      canonical: href(lang, "complaints"),
      languages: { es: href("es", "complaints"), en: href("en", "complaints") },
    },
  };
}

export default async function ComplaintsPage({ params }: PageProps<"/[lang]/libro-de-reclamaciones">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const t = d.complaints;

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        image="/images/mostrador.webp"
        crumbs={[{ label: d.nav.home, href: href(lang, "home") }, { label: t.hero.title }]}
      />

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-28">
              <Reveal>
                <div className="relative overflow-hidden rounded-[1.75rem] bg-navy p-7 text-cream">
                  <div className="slats pointer-events-none absolute inset-0 text-cream/15" aria-hidden />
                  <BookOpen className="relative h-9 w-9 text-gold" />
                  <p className="relative mt-5 font-display text-2xl font-bold">{t.hero.title}</p>
                  <dl className="relative mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="text-xs tracking-wide text-cream/50 uppercase">{t.provider.legalName}</dt>
                      <dd className="font-semibold">{site.legalName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-wide text-cream/50 uppercase">{t.provider.ruc}</dt>
                      <dd className="font-semibold">{site.ruc || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-wide text-cream/50 uppercase">{t.provider.address}</dt>
                      <dd className="font-semibold">{site.fiscalAddress || site.country[lang]}</dd>
                    </div>
                  </dl>
                  <span className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" aria-hidden />
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="space-y-4 rounded-[1.75rem] p-6 ring-1 ring-navy/10">
                  {[
                    { Icon: ShieldCheck, title: t.fields.reclamo, text: t.fields.reclamoText },
                    { Icon: ShieldCheck, title: t.fields.queja, text: t.fields.quejaText },
                    { Icon: Clock, title: "", text: t.notes[1] },
                  ].map(({ Icon, title, text }) => (
                    <div key={text} className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm leading-relaxed text-navy/70">
                        {title && <span className="font-semibold text-navy">{title}: </span>}
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <Link
                  href={href(lang, "privacy")}
                  className="flex items-center gap-2 px-2 text-sm font-semibold text-teal hover:text-forest"
                >
                  <Lock className="h-4 w-4" />
                  {d.footer.privacy}
                </Link>
              </Reveal>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ComplaintForm lang={lang} t={t} forms={d.forms} whatsappMessage={d.common.whatsappGreeting} />
          </div>
        </div>
      </section>
    </>
  );
}

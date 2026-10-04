import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Building, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@/data/site";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.contact.title,
    description: d.meta.contact.description,
    alternates: { canonical: href(lang, "contact"), languages: { es: href("es", "contact"), en: href("en", "contact") } },
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const c = d.contact.channels;

  const channels = [
    { Icon: Phone, label: c.phone, value: site.phoneDisplay, link: `tel:+${site.whatsapp}` },
    site.email ? { Icon: Mail, label: c.email, value: site.email, link: `mailto:${site.email}` } : null,
    { Icon: MapPin, label: c.location, value: site.address || site.country[lang], link: site.mapsUrl || undefined },
    site.hours[lang] ? { Icon: Clock, label: c.hours, value: site.hours[lang] } : null,
    { Icon: Building, label: c.company, value: site.legalName },
  ].filter(Boolean) as { Icon: typeof Phone; label: string; value: string; link?: string }[];

  return (
    <>
      <PageHero
        eyebrow={d.contact.hero.eyebrow}
        title={d.contact.hero.title}
        text={d.contact.hero.text}
        image="/images/oficina.webp"
        crumbs={[{ label: d.nav.home, href: href(lang, "home") }, { label: d.nav.contact }]}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <Reveal>
              <a
                href={whatsappLink(d.common.whatsappGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-[1.75rem] bg-teal p-8 text-cream"
              >
                <div className="slats pointer-events-none absolute inset-0 text-cream/20" aria-hidden />
                <span className="relative flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold text-navy">
                    <WhatsAppIcon className="h-7 w-7" />
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <span className="relative mt-8 block eyebrow text-gold">{c.whatsapp}</span>
                <span className="relative mt-2 block font-display text-3xl font-bold">{site.phoneDisplay}</span>
                <span className="relative mt-2 block text-cream/75">{c.whatsappText}</span>
              </a>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-[1.75rem] ring-1 ring-navy/10">
                <p className="eyebrow border-b border-navy/10 px-7 py-5 text-teal">{c.title}</p>
                <ul className="divide-y divide-navy/10">
                  {channels.map(({ Icon, label, value, link }) => {
                    const inner = (
                      <>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold tracking-wide text-navy/50 uppercase">{label}</span>
                          <span className="block break-words font-semibold">{value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={label}>
                        {link ? (
                          <a href={link} className="flex items-center gap-4 px-7 py-5 transition-colors hover:bg-teal/5">
                            {inner}
                          </a>
                        ) : (
                          <div className="flex items-center gap-4 px-7 py-5">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
                <Image src="/images/fachada.webp" alt="D'Cora Hogar" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
              </div>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="rounded-[2rem] bg-cream p-6 shadow-[0_40px_80px_-50px_rgb(18_29_44/0.55)] ring-1 ring-navy/10 sm:p-10">
              <h2 className="text-3xl sm:text-4xl">{d.contact.form.title}</h2>
              <p className="mt-2 mb-8 text-navy/65">{d.contact.form.text}</p>
              <ContactForm lang={lang} t={d.forms} whatsappMessage={d.common.whatsappGreeting} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

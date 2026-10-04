import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, Hammer, Palette, Rocket, Store } from "lucide-react";
import { whatsappLink } from "@/data/site";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, ShadeReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/ui/VideoCard";
import { Faq } from "@/components/ui/Faq";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DistributorForm } from "@/components/forms/DistributorForm";
import { Pitch } from "@/components/home/Pitch";

export async function generateMetadata({ params }: PageProps<"/[lang]/quiero-ser-distribuidor">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.distributors.title,
    description: d.meta.distributors.description,
    alternates: {
      canonical: href(lang, "distributors"),
      languages: { es: href("es", "distributors"), en: href("en", "distributors") },
    },
  };
}

const challengeImages = ["/images/medidas.webp", "/images/muestrario.webp", "/images/cotizacion.webp", "/images/taller-corte.webp"];
const whoIcons = [Palette, Store, Hammer, Rocket, Building2];

export default async function DistributorsPage({ params }: PageProps<"/[lang]/quiero-ser-distribuidor">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const t = d.distributors;
  const labels = { play: d.common.playVideo, pause: d.common.pauseVideo, mute: d.common.mute, unmute: d.common.unmute };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        text={t.hero.text}
        image="/images/capacitacion.webp"
        crumbs={[{ label: d.nav.home, href: href(lang, "home") }, { label: d.nav.distributor }]}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#postular" className="btn btn-gold">
            {t.hero.primary}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href={whatsappLink(d.common.whatsappDistributor)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
            <WhatsAppIcon className="h-4 w-4" />
            {t.hero.secondary}
          </a>
        </div>
      </PageHero>

      {/* El verdadero reto */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.challenge.eyebrow} title={t.challenge.title} />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.challenge.items.map((it, i) => (
              <Reveal as="li" key={it.title} delay={i * 0.08} className="group">
                <ShadeReveal className="aspect-[4/5] rounded-[1.5rem]" delay={i * 0.08} shade={i % 2 ? "bg-navy" : "bg-teal"}>
                  <Image src={challengeImages[i]} alt={it.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" aria-hidden />
                  <span className="absolute top-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-sm font-bold text-navy">
                    {i + 1}
                  </span>
                  <span className="absolute inset-x-5 bottom-5 text-cream">
                    <span className="block font-display text-xl font-bold">{it.title}</span>
                    <span className="mt-1 block text-sm text-cream/75">{it.text}</span>
                  </span>
                </ShadeReveal>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Pitch lang={lang} t={d.home.pitch} />

      {/* Perfiles */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={t.who.eyebrow} title={t.who.title} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {t.who.items.map((w, i) => {
              const Icon = whoIcons[i];
              return (
                <Reveal as="li" key={w.title} delay={i * 0.06}>
                  <div className="group relative h-full overflow-hidden rounded-[1.5rem] p-7 ring-1 ring-navy/10 transition-colors duration-500 hover:text-cream">
                    <span className="absolute inset-0 -translate-y-full bg-teal transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0" aria-hidden />
                    <span className="relative">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal/10 text-teal transition-colors duration-500 group-hover:bg-gold group-hover:text-navy">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-6 block font-display text-lg font-bold">{w.title}</span>
                      <span className="mt-2 block text-sm text-navy/65 transition-colors duration-500 group-hover:text-cream/75">{w.text}</span>
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Pasos */}
      <section className="relative overflow-hidden bg-teal py-24 text-cream sm:py-32">
        <div className="slats pointer-events-none absolute inset-0 text-cream/[0.12]" aria-hidden />
        <div className="container-x relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow={t.steps.eyebrow} title={t.steps.title} tone="light" />
              <Reveal delay={0.2}>
                <div className="mx-auto mt-10 max-w-[300px] lg:mx-0">
                  <VideoCard
                    src="/videos/mariela.mp4"
                    poster="/videos/mariela-poster.webp"
                    name={d.home.videos.mariela.name}
                    role={d.home.videos.mariela.role}
                    labels={labels}
                  />
                </div>
              </Reveal>
            </div>
          </div>
          <ol className="relative lg:col-span-7 lg:col-start-6">
            <span className="absolute top-2 bottom-2 left-[1.6rem] w-px bg-cream/20" aria-hidden />
            {t.steps.items.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06} className="relative flex gap-6 pb-12 last:pb-0">
                <span className="relative z-10 grid h-[3.2rem] w-[3.2rem] shrink-0 place-items-center rounded-full bg-gold font-display font-bold text-navy ring-8 ring-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-2.5">
                  <h3 className="text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-md text-cream/75">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Formulario */}
      <section id="postular" className="scroll-mt-20 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t.form.eyebrow} title={t.form.title} text={t.form.text} />
            <Reveal delay={0.15}>
              <a
                href={whatsappLink(d.common.whatsappDistributor)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 flex items-center gap-4 rounded-2xl bg-navy p-5 text-cream"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-navy">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm text-cream/70">{d.home.cta.eyebrow}</span>
                  <span className="block font-semibold">{d.contact.channels.whatsapp}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative mt-5 hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block">
                <Image src="/images/oficina.webp" alt="" fill sizes="30vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="rounded-[2rem] bg-cream p-6 shadow-[0_40px_80px_-50px_rgb(18_29_44/0.55)] ring-1 ring-navy/10 sm:p-10">
              <DistributorForm lang={lang} t={d.forms} whatsappMessage={d.common.whatsappDistributor} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[color-mix(in_oklab,var(--color-teal)_6%,var(--color-cream))] py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
            <Reveal delay={0.1}>
              <Link href={href(lang, "contact")} className="btn btn-ghost-dark mt-8">
                {d.nav.contact}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <Faq items={t.faq.items} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

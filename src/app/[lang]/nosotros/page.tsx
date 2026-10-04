import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Compass, Handshake, Heart, ShieldCheck, Sparkles, Target, Timer, TrendingUp } from "lucide-react";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, ShadeReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/ui/VideoCard";
import { Process } from "@/components/home/Process";
import { FinalCta } from "@/components/home/FinalCta";

export async function generateMetadata({ params }: PageProps<"/[lang]/nosotros">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.about.title,
    description: d.meta.about.description,
    alternates: { canonical: href(lang, "about"), languages: { es: href("es", "about"), en: href("en", "about") } },
  };
}

const valueIcons = [Handshake, ShieldCheck, Heart, Timer, TrendingUp];

export default async function AboutPage({ params }: PageProps<"/[lang]/nosotros">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  const a = d.about;
  const labels = {
    play: d.common.playVideo,
    pause: d.common.pauseVideo,
    mute: d.common.mute,
    unmute: d.common.unmute,
  };

  return (
    <>
      <PageHero
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        text={a.hero.text}
        image="/images/fachada.webp"
        crumbs={[{ label: d.nav.home, href: href(lang, "home") }, { label: d.nav.about }]}
      />

      {/* Historia */}
      <section id="historia" className="scroll-mt-24 py-24 sm:py-32">
        <div className="container-x grid items-start gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow={a.story.eyebrow} title={a.story.title} />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-navy/75 sm:text-lg">
              {a.story.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <p className="mt-10 border-l-4 border-gold pl-6 font-display text-2xl leading-snug font-bold text-teal sm:text-3xl">
                “{a.story.highlight}”
              </p>
            </Reveal>
          </div>
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <ShadeReveal className="col-span-2 aspect-[16/10] rounded-[1.75rem]">
                <Image src="/images/mostrador.webp" alt={a.story.eyebrow} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </ShadeReveal>
              <ShadeReveal className="aspect-square rounded-[1.5rem]" delay={0.1} shade="bg-navy">
                <Image src="/images/showroom.webp" alt="Showroom D'Cora Hogar" fill sizes="25vw" className="object-cover" />
              </ShadeReveal>
              <ShadeReveal className="aspect-square rounded-[1.5rem]" delay={0.2} shade="bg-forest">
                <Image src="/images/equipo-dcora.webp" alt="Equipo D'Cora Hogar" fill sizes="25vw" className="object-cover" />
              </ShadeReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Propósito */}
      <section id="proposito" className="relative scroll-mt-24 overflow-hidden bg-navy py-24 text-cream sm:py-32">
        <div className="slats pointer-events-none absolute inset-0 text-cream/[0.12]" aria-hidden />
        <div className="container-x relative">
          <SectionHeading eyebrow={a.purpose.eyebrow} title={`${a.purpose.mission.title} · ${a.purpose.vision.title}`} tone="light" />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              { ...a.purpose.mission, Icon: Target },
              { ...a.purpose.vision, Icon: Compass },
            ].map(({ title, text, Icon }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <article className="relative h-full overflow-hidden rounded-[1.75rem] bg-teal p-8 sm:p-10">
                  <Icon className="h-9 w-9 text-gold" />
                  <h3 className="mt-6 text-3xl">{title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-cream/80">{text}</p>
                  <span className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" aria-hidden />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h3 className="eyebrow mt-20 flex items-center gap-3 text-gold">
              <Sparkles className="h-4 w-4" />
              {a.purpose.valuesTitle}
            </h3>
          </Reveal>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[1.5rem] bg-cream/10 sm:grid-cols-2 lg:grid-cols-5">
            {a.purpose.values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <Reveal as="li" key={v.title} delay={i * 0.06} className="bg-navy p-7">
                  <Icon className="h-6 w-6 text-gold" />
                  <p className="mt-5 font-display text-lg font-bold">{v.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{v.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Proceso */}
      <Process t={d.home.process} id="proceso" />

      {/* Importación + video Joel */}
      <section className="bg-[color-mix(in_oklab,var(--color-teal)_6%,var(--color-cream))] py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={a.import.eyebrow} title={a.import.title} text={a.import.text} />
            <div className="mt-10 grid grid-cols-3 gap-3">
              {["/images/seleccion-rollos.webp", "/images/almacen.webp", "/images/fabricacion.webp"].map((src, i) => (
                <ShadeReveal key={src} delay={i * 0.1} className="aspect-[3/4] rounded-2xl" shade={i === 1 ? "bg-navy" : "bg-teal"}>
                  <Image src={src} alt="" fill sizes="(max-width:1024px) 33vw, 20vw" className="object-cover" />
                </ShadeReveal>
              ))}
            </div>
          </div>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="mx-auto max-w-[340px]">
              <VideoCard
                src="/videos/joel.mp4"
                poster="/videos/joel-poster.webp"
                name={d.home.videos.joel.name}
                role={d.home.videos.joel.role}
                labels={labels}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="scroll-mt-24 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={a.team.eyebrow} title={a.team.title} text={a.team.text} />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {a.team.members.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <article className="group h-full overflow-hidden rounded-[1.75rem] bg-cream ring-1 ring-navy/10">
                  <div className="relative aspect-[4/3.6] overflow-hidden">
                    <Image
                      src={i === 0 ? "/images/mariela.webp" : "/images/joel.webp"}
                      alt={`${m.name}, ${m.role}`}
                      fill
                      sizes="(max-width:1024px) 100vw, 33vw"
                      className={`object-cover transition-transform duration-[1.4s] group-hover:scale-105 ${i === 0 ? "object-[50%_45%]" : "object-top"}`}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" aria-hidden />
                    <div className="absolute bottom-5 left-6 text-cream">
                      <p className="font-display text-2xl font-bold">{m.name}</p>
                      <p className="eyebrow mt-1 text-gold">{m.role}</p>
                    </div>
                  </div>
                  <p className="p-6 text-[0.95rem] leading-relaxed text-navy/75 sm:p-7">“{m.quote}”</p>
                </article>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <article className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-teal p-7 text-cream">
                <Image src="/images/taller-fabricacion.webp" alt="" fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover opacity-60 transition-transform duration-[1.4s] group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-teal via-teal/70 to-transparent" aria-hidden />
                <div className="relative">
                  <p className="font-display text-2xl font-bold">{a.team.crew}</p>
                  <p className="mt-2 text-cream/75">{a.team.crewText}</p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta lang={lang} t={d.home.cta} whatsappMessage={d.common.whatsappDistributor} />
    </>
  );
}

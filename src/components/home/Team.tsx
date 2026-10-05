import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Reveal, ShadeReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const groupImages = ["/images/reales/equipo-comercial.webp", "/images/reales/equipo-taller.webp"];

/** Equipo: gerencia + equipos comercial y de taller (fotos reales). */
export function Team({ lang, t, showCta = true }: { lang: Locale; t: Dictionary["home"]["team"]; showCta?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-[color-mix(in_oklab,var(--color-teal)_6%,var(--color-cream))] py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />
          {showCta && (
            <Reveal>
              <Link href={href(lang, "about", "equipo")} className="btn btn-ghost-dark shrink-0">
                {t.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          )}
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Gerencia */}
          <Reveal className="lg:col-span-4">
            <figure className="group relative h-full min-h-[460px] overflow-hidden rounded-[1.75rem] bg-teal">
              <div className="absolute inset-0">
                <ShadeReveal className="h-full w-full" shade="bg-navy">
                  <Image
                    src="/images/reales/fundadores.webp"
                    alt={t.leadersNames}
                    fill
                    sizes="(max-width:1024px) 100vw, 33vw"
                    className="object-cover object-[50%_62%] transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                </ShadeReveal>
              </div>
              <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" aria-hidden />
              <figcaption className="absolute inset-x-6 bottom-6 text-cream">
                <span className="eyebrow text-gold">{t.leaders}</span>
                <span className="mt-1 block font-display text-2xl font-bold">{t.leadersNames}</span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Equipos */}
          <div className="grid gap-5 lg:col-span-8">
            {t.groups.map((g, i) => (
              <Reveal key={g.title} delay={0.08 * (i + 1)}>
                <figure className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-[16/7.5]">
                  <div className="absolute inset-0">
                    <ShadeReveal className="h-full w-full" shade={i ? "bg-forest" : "bg-teal"} delay={0.1 * i}>
                      <Image
                        src={groupImages[i]}
                        alt={g.title}
                        fill
                        sizes="(max-width:1024px) 100vw, 66vw"
                        className={`object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105 ${
                          i ? "object-[50%_70%]" : "object-[50%_55%]"
                        }`}
                      />
                    </ShadeReveal>
                  </div>
                  <span className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/25 to-transparent" aria-hidden />
                  <figcaption className="absolute top-5 left-5 max-w-sm text-cream sm:top-7 sm:left-7">
                    <span className="flex items-center gap-2 font-display text-lg font-bold sm:text-xl">
                      <span className="h-px w-6 bg-gold" aria-hidden />
                      {g.title}
                    </span>
                    <span className="mt-1 hidden text-sm text-cream/75 sm:block">{g.text}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

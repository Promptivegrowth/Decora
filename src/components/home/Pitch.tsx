import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, Boxes, GraduationCap, Headset, Quote, Timer, Wrench } from "lucide-react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const benefitIcons = [Wrench, GraduationCap, Headset, Boxes, BadgePercent, Timer];

export function Pitch({ lang, t }: { lang: Locale; t: Dictionary["home"]["pitch"] }) {
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-cream sm:py-32">
      <div className="slats pointer-events-none absolute inset-0 text-cream/[0.14]" aria-hidden />
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} tone="light" />
            <Reveal delay={0.2}>
              <figure className="relative mt-10 overflow-hidden rounded-2xl bg-teal p-7">
                <Quote className="h-7 w-7 text-gold" />
                <blockquote className="mt-3 text-[0.95rem] leading-relaxed text-cream/90">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-cream/15 pt-5">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-gold">
                    <Image
                      src="/images/reales/mariela-retrato.webp"
                      alt=""
                      fill
                      sizes="128px"
                      className="origin-[50%_20%] scale-[1.8] object-cover object-[50%_20%]"
                    />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-cream">Mariela</span>
                    <span className="eyebrow mt-0.5 block text-gold">{t.quoteBy}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.25}>
              <Link href={href(lang, "distributors")} className="btn btn-gold mt-8">
                {t.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-[1.75rem] bg-cream/10 sm:grid-cols-2 lg:col-span-7">
          {t.benefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <Reveal as="li" key={b.title} delay={(i % 2) * 0.08} className="group relative bg-navy p-8 sm:p-10">
                <span
                  className="absolute inset-x-0 top-0 h-0 bg-teal transition-[height] duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:h-full"
                  aria-hidden
                />
                <span className="relative">
                  <span className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-navy">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-sm font-bold text-cream/25">0{i + 1}</span>
                  </span>
                  <span className="mt-8 block font-display text-xl font-bold">{b.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-cream/65 group-hover:text-cream/85">{b.text}</span>
                </span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

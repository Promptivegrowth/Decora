import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Audience({ lang, t }: { lang: Locale; t: Dictionary["home"]["audience"] }) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Distribuidores: el foco del negocio */}
          <Reveal className="lg:col-span-7">
            <Link
              href={href(lang, "distributors")}
              className="group relative flex h-full min-h-[520px] flex-col justify-end overflow-hidden rounded-[2rem] bg-teal p-7 text-cream sm:p-10"
            >
              <Image
                src="/images/capacitacion.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover opacity-50 transition-transform duration-[1.6s] ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-teal via-teal/80 to-teal/10" aria-hidden />
              {/* Cortina que baja al pasar el cursor */}
              <span
                className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-forest/70 transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100"
                aria-hidden
              />
              <span className="relative">
                <span className="eyebrow inline-flex rounded-full bg-gold px-3 py-1.5 text-navy">{t.distributor.tag}</span>
                <span className="mt-5 block max-w-md font-display text-3xl leading-tight font-bold sm:text-4xl">
                  {t.distributor.title}
                </span>
                <span className="mt-4 block max-w-lg text-cream/80">{t.distributor.text}</span>
                <span className="mt-6 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {t.distributor.points.map((p) => (
                    <span key={p} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gold" />
                      {p}
                    </span>
                  ))}
                </span>
                <span className="btn btn-gold mt-8">
                  {t.distributor.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </Reveal>

          {/* Cliente final */}
          <Reveal className="lg:col-span-5" delay={0.12}>
            <Link
              href={href(lang, "contact")}
              className="group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[2rem] bg-cream ring-1 ring-navy/10"
            >
              <span className="relative block h-60 overflow-hidden sm:h-72">
                <Image
                  src="/images/showroom.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                />
              </span>
              <span className="flex flex-1 flex-col p-7 sm:p-9">
                <span className="eyebrow text-teal">{t.client.tag}</span>
                <span className="mt-3 block font-display text-2xl leading-tight font-bold sm:text-3xl">{t.client.title}</span>
                <span className="mt-3 block text-navy/70">{t.client.text}</span>
                <span className="mt-5 flex flex-wrap gap-2">
                  {t.client.points.map((p) => (
                    <span key={p} className="rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal">
                      {p}
                    </span>
                  ))}
                </span>
                <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-teal">
                  {t.client.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

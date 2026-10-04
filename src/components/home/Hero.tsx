"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { useSiteReady } from "@/lib/ready";
import { Counter } from "@/components/ui/Counter";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * VIDEO DEL HERO: reemplazar /public/videos/hero.mp4 (+ hero.webm y hero-poster.webp)
 * por el video definitivo. Recomendado: 1920×1080, 10–20 s, sin audio, H.264 ≤ 6 MB.
 */
const HERO_VIDEO = { mp4: "/videos/hero.mp4", webm: "/videos/hero.webm", poster: "/videos/hero-poster.webp" };

export function Hero({
  lang,
  t,
  stats,
}: {
  lang: Locale;
  t: Dictionary["home"]["hero"];
  stats: { value: number; suffix: string; label: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const ready = useSiteReady();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => undefined);
  }, []);

  const lines = [t.titleA, t.titleB, t.titleC];
  const show = ready ? "show" : "hide";

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-cream">
      <motion.div style={{ y: videoY }} className="absolute inset-0 -z-20">
        <video
          ref={video}
          className="h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_VIDEO.poster}
          aria-hidden
        >
          <source src={HERO_VIDEO.webm} type="video/webm" />
          <source src={HERO_VIDEO.mp4} type="video/mp4" />
        </video>
      </motion.div>
      {/* Capas de color de marca sobre el video */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/80 to-teal/30" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-transparent to-navy/60" aria-hidden />
      <div className="slats pointer-events-none absolute inset-0 -z-10 text-cream/25" aria-hidden />

      {/* Cortina que se recoge al terminar el preloader */}
      <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-4" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={i}
            className="relative bg-navy"
            initial={{ y: "0%" }}
            animate={ready ? { y: "-101%" } : undefined}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.06 * i }}
          >
            <span className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" />
          </motion.div>
        ))}
      </div>

      {/* Cadena de accionamiento decorativa */}
      <motion.div
        aria-hidden
        className="absolute top-0 right-6 hidden h-[46%] w-[3px] sm:right-10 md:block"
        initial={{ scaleY: 0 }}
        animate={ready ? { scaleY: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE, delay: 0.9 }}
        style={{
          transformOrigin: "top",
          backgroundImage: "radial-gradient(circle, var(--color-gold) 1.3px, transparent 1.7px)",
          backgroundSize: "3px 9px",
        }}
      >
        <span className="absolute -bottom-4 left-1/2 h-5 w-2.5 -translate-x-1/2 rounded-full bg-gold" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: fade }} className="container-x relative flex flex-1 flex-col justify-center pt-[calc(var(--header-h)+3rem)] pb-12 lg:pt-[calc(var(--header-h)+5rem)]">
        <motion.p
          className="eyebrow flex items-center gap-3 text-gold"
          variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          initial="hide"
          animate={show}
          transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
        >
          <span className="h-px w-10 bg-gold" aria-hidden />
          {t.eyebrow}
        </motion.p>

        <h1 className="mt-6 max-w-5xl text-[2.7rem] leading-[1] font-bold xs:text-5xl sm:text-7xl lg:text-[5.6rem]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 1 ? "text-gold" : ""}`}
                variants={{ hide: { y: "110%" }, show: { y: "0%" } }}
                initial="hide"
                animate={show}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
          variants={{ hide: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          initial="hide"
          animate={show}
          transition={{ duration: 0.9, ease: EASE, delay: 1 }}
        >
          {t.text}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          variants={{ hide: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          initial="hide"
          animate={show}
          transition={{ duration: 0.9, ease: EASE, delay: 1.12 }}
        >
          <Link href={href(lang, "distributors")} className="btn btn-gold">
            {t.primary}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={href(lang, "products")} className="btn btn-ghost-light">
            {t.secondary}
          </Link>
        </motion.div>

        <motion.ul
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/75"
          variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }}
          initial="hide"
          animate={show}
          transition={{ duration: 0.9, delay: 1.3 }}
        >
          {t.badges.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/20 text-gold">
                <Check className="h-3 w-3" />
              </span>
              {b}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Indicadores */}
      <motion.div
        className="relative z-[5]"
        variants={{ hide: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
        initial="hide"
        animate={show}
        transition={{ duration: 1, ease: EASE, delay: 1.35 }}
      >
        <div className="container-x">
          <dl className="grid grid-cols-2 border-t border-cream/15 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-5 pr-4 sm:py-7 ${i % 2 === 1 ? "pl-4 sm:pl-6" : ""} ${
                  i > 0 ? "lg:border-l lg:border-cream/15 lg:pl-6" : ""
                } ${i === 1 ? "border-l border-cream/15" : ""} ${i === 3 ? "border-l border-cream/15" : ""} ${
                  i > 1 ? "border-t border-cream/15 lg:border-t-0" : ""
                }`}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-bold text-gold sm:text-4xl">
                    {ready ? <Counter value={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-cream/65 sm:text-sm">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </section>
  );
}

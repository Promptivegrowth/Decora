"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const images = [
  "/images/reales/stock-telas.webp",
  "/images/almacen.webp",
  "/images/reales/camiseta-rack.webp",
  "/images/reales/taller-mesa.webp",
  "/images/mostrador.webp",
];

export function Process({ t, id }: { t: Dictionary["home"]["process"]; id?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id={id} className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <ol ref={ref} className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6">
          {/* Línea de progreso (cordón) */}
          <div className="absolute top-0 bottom-0 left-[1.35rem] w-px bg-navy/10 lg:hidden" aria-hidden>
            <motion.div className="h-full w-full origin-top bg-gold" style={{ scaleY: line }} />
          </div>
          <div className="absolute top-[1.35rem] left-0 hidden h-px w-full bg-navy/10 lg:block" aria-hidden>
            <motion.div className="h-full w-full origin-left bg-gold" style={{ scaleX: line }} />
          </div>

          {t.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="relative pl-16 lg:pl-0">
              <span className="absolute top-0 left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-teal font-display text-sm font-bold text-gold ring-8 ring-cream lg:relative">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="group mt-0 overflow-hidden rounded-2xl lg:mt-7">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={images[i]}
                    alt={s.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 20vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </div>
              </div>
              <h3 className="mt-5 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

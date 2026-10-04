"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useSiteReady } from "@/lib/ready";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Cabecera de páginas internas: fondo oscuro con foto real y lamas animadas. */
export function PageHero({
  eyebrow,
  title,
  text,
  image,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: string;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-navy pt-[calc(var(--header-h)+5rem)] pb-20 text-cream sm:pb-28 lg:pt-[calc(var(--header-h)+8rem)]">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/40" aria-hidden />
      <div className="slats pointer-events-none absolute inset-0 -z-10 text-cream/20" aria-hidden />
      {/* Lamas que se recogen al cargar */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="flex-1 origin-top bg-navy"
            initial={{ scaleY: 1 }}
            animate={ready ? { scaleY: 0 } : undefined}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i }}
          />
        ))}
      </div>

      <div className="container-x">
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-cream/60">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-cream">
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
              </li>
            ))}
          </ol>
        </motion.nav>
        <motion.p
          className="eyebrow mt-8 flex items-center gap-3 text-gold"
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
        >
          <span className="h-px w-8 bg-gold" aria-hidden />
          {eyebrow}
        </motion.p>
        <h1 className="mt-5 max-w-4xl text-[2.4rem] leading-[1.04] sm:text-6xl lg:text-7xl">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              animate={ready ? { y: 0 } : undefined}
              transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
            >
              {title}
            </motion.span>
          </span>
        </h1>
        {text && (
          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
          >
            {text}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          >
            {children}
          </motion.div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" aria-hidden />
    </section>
  );
}

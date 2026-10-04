"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { markReady } from "@/lib/ready";

const MIN_MS = 1500;
const MAX_MS = 4500;

/**
 * Preloader: la pantalla es una cortina roller cerrada. Mientras carga, el isotipo
 * se "llena" de dorado y la cadena lateral avanza; al terminar, la cortina se
 * enrolla hacia arriba y descubre la web.
 */
export function Preloader({ label }: { label: string }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let loaded = false;
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      window.setTimeout(() => setDone(true), reduce ? 0 : 380);
    };

    const tick = () => {
      const t = performance.now() - start;
      setProgress((p) => {
        const target = loaded ? 100 : Math.min(90, (t / MIN_MS) * 82);
        return Math.max(p, Math.round(p + (target - p) * 0.12));
      });
      if ((loaded && t >= MIN_MS) || t >= MAX_MS) finish();
      else raf = requestAnimationFrame(tick);
    };

    const onLoad = () => {
      Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 800))]).then(
        () => (loaded = true),
      );
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    if (reduce) {
      loaded = true;
    }
    raf = requestAnimationFrame(tick);
    document.documentElement.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    markReady();
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          id="preloader"
          role="status"
          aria-live="polite"
          aria-label={label}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy text-cream"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Lamas sutiles del tejido */}
          <div className="slats pointer-events-none absolute inset-0 text-cream/40" aria-hidden />

          <div className="relative flex flex-col items-center">
            <div className="relative h-[120px] w-[108px] sm:h-[150px] sm:w-[135px]">
              {/* Isotipo base */}
              <Image
                src="/brand/isotipo-crema.webp"
                alt=""
                width={323}
                height={360}
                priority
                unoptimized
                className="absolute inset-0 h-full w-full object-contain opacity-15"
              />
              {/* Isotipo dorado que se revela como una cortina bajando */}
              <Image
                src="/brand/isotipo-dorado.webp"
                alt=""
                width={323}
                height={360}
                priority
                unoptimized
                className="absolute inset-0 h-full w-full object-contain transition-[clip-path] duration-200 ease-out"
                style={{ clipPath: `inset(0 0 ${100 - progress}% 0)` }}
              />
            </div>
            <motion.img
              src="/brand/wordmark-crema.webp"
              alt="D'Cora Hogar"
              className="mt-6 h-auto w-[170px] sm:w-[210px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
            <div className="mt-8 flex w-48 items-center gap-3">
              <span className="relative h-px flex-1 overflow-hidden bg-cream/15">
                <span
                  className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </span>
              <span className="w-10 text-right font-display text-xs tabular-nums tracking-[0.2em] text-gold">
                {String(progress).padStart(2, "0")}
              </span>
            </div>
            <p className="eyebrow mt-4 text-cream/50">{label}</p>
          </div>

          {/* Cadena de accionamiento */}
          <div
            aria-hidden
            className="absolute top-0 right-[8%] h-[62%] w-[3px] sm:right-[12%]"
            style={{
              backgroundImage: "radial-gradient(circle, var(--color-gold) 1.2px, transparent 1.6px)",
              backgroundSize: "3px 9px",
              backgroundPositionY: `${progress * 1.8}px`,
            }}
          >
            <span className="absolute -bottom-3 left-1/2 h-4 w-2 -translate-x-1/2 rounded-full bg-gold" />
          </div>

          {/* Barra inferior (contrapeso del roller) */}
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gold" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

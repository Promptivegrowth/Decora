"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { markReady } from "@/lib/ready";

const MIN_MS = 1500;
const MAX_MS = 4500;

const ROLL = [0.76, 0, 0.24, 1] as const;

/**
 * Preloader: la pantalla es una cortina roller cerrada. Mientras carga, el isotipo
 * se "llena" de dorado y la cadena avanza. Al terminar, la cadena se jala hacia
 * abajo (la cortina cede un poco, como un roller real al destrabarse) y luego
 * la cortina se enrolla hacia arriba y descubre la web.
 */
export function Preloader({ label }: { label: string }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "pull" | "done">("loading");
  const done = phase === "done";

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
      if (reduce) setPhase("done");
      else window.setTimeout(() => setPhase("pull"), 260);
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
          initial={false}
          animate={phase === "pull" ? { y: [0, 0, 26, 0] } : { y: 0 }}
          exit={{ y: "-100%" }}
          transition={
            phase === "pull"
              ? { duration: 1.2, times: [0, 0.2, 0.62, 1], ease: ["linear", "easeIn", "easeOut"] }
              : { duration: 1.05, ease: ROLL }
          }
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

          {/* Cadena de accionamiento: avanza con la carga y al final se jala hacia abajo */}
          <motion.div
            aria-hidden
            className="absolute -top-40 right-[8%] h-[calc(62%+10rem)] w-[3px] sm:right-[12%]"
            initial={false}
            animate={phase === "pull" ? { y: [0, -14, 190, 150] } : { y: 0 }}
            transition={
              phase === "pull"
                ? { duration: 1.2, times: [0, 0.2, 0.62, 1], ease: ["easeOut", "easeIn", "easeOut"] }
                : { duration: 0.3 }
            }
            onAnimationComplete={() => phase === "pull" && setPhase("done")}
            style={{
              backgroundImage: "radial-gradient(circle, var(--color-gold) 1.2px, transparent 1.6px)",
              backgroundSize: "3px 9px",
              backgroundPositionY: `${progress * 1.8}px`,
            }}
          >
            {/* Contrapeso / tirador */}
            <span className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <span className="h-2 w-[3px] bg-gold" />
              <span className="h-6 w-3 rounded-full bg-gold shadow-[0_0_18px_rgb(218_179_111/0.45)]" />
            </span>
          </motion.div>

          {/* Barra inferior (contrapeso del roller) */}
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gold" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronsUpDown } from "lucide-react";
import { useCallback, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Metrics = { light: number; view: number; uv: number; privacy: number; cover: number };

/** Valores referenciales por tipo de tela (0–100). cover = opacidad visual del tejido. */
const METRICS: Record<string, Metrics> = {
  "screen-1": { light: 18, view: 15, uv: 99, privacy: 90, cover: 0.86 },
  "screen-3": { light: 28, view: 30, uv: 97, privacy: 80, cover: 0.76 },
  "screen-5": { light: 38, view: 45, uv: 95, privacy: 65, cover: 0.66 },
  "screen-10": { light: 55, view: 65, uv: 90, privacy: 45, cover: 0.5 },
  "screen-16": { light: 70, view: 80, uv: 84, privacy: 30, cover: 0.36 },
  "duo-open": { light: 60, view: 50, uv: 90, privacy: 45, cover: 0.6 },
  "duo-closed": { light: 10, view: 3, uv: 99, privacy: 95, cover: 0.97 },
  blackout: { light: 0, view: 0, uv: 100, privacy: 100, cover: 1 },
};

export function LightLab({ lang, t }: { lang: Locale; t: Dictionary["home"]["lab"] }) {
  const [fabric, setFabric] = useState("screen-5");
  const [duoOpen, setDuoOpen] = useState(true);
  const [height, setHeight] = useState(72);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const key = fabric === "duo" ? (duoOpen ? "duo-open" : "duo-closed") : fabric;
  const m = METRICS[key];
  const current = t.fabrics.find((f) => f.id === fabric)!;
  // Efecto en el ambiente: cuánto oscurece la habitación según tela y altura
  const dim = ((100 - m.light) / 100) * (height / 100);

  const setFromPointer = useCallback((clientY: number) => {
    const r = windowRef.current?.getBoundingClientRect();
    if (!r) return;
    const pct = ((clientY - r.top) / r.height) * 100;
    setHeight(Math.round(Math.min(100, Math.max(6, pct))));
  }, []);

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromPointer(e.clientY);
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromPointer(e.clientY);
  };
  const onUp = () => (dragging.current = false);

  const level = (v: number) => t.levels[Math.min(4, Math.floor(v / 20.0001))];

  const metricRows: { label: string; value: number; display: string }[] = [
    { label: t.metrics.light, value: m.light, display: level(m.light) },
    { label: t.metrics.view, value: m.view, display: level(m.view) },
    { label: t.metrics.privacy, value: m.privacy, display: level(m.privacy) },
    { label: t.metrics.uv, value: m.uv, display: `${m.uv}%` },
  ];

  const isBlackout = fabric === "blackout";
  const fabricColor = isBlackout ? "#d6c6a5" : "#e9dfc7";

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" id="laboratorio">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

          <Reveal delay={0.1}>
            <div role="radiogroup" aria-label={t.eyebrow} className="mt-9 flex flex-wrap gap-2">
              {t.fabrics.map((f) => {
                const active = f.id === fabric;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFabric(f.id)}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                      active ? "text-cream" : "text-navy ring-1 ring-navy/15 ring-inset hover:ring-teal"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="lab-pill"
                        className="absolute inset-0 -z-0 rounded-full bg-teal"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <AnimatePresence>
            {fabric === "duo" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 inline-flex rounded-full bg-teal/10 p-1 text-xs font-semibold">
                  {[
                    [true, t.duoOpen],
                    [false, t.duoClosed],
                  ].map(([v, label]) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setDuoOpen(v as boolean)}
                      aria-pressed={duoOpen === v}
                      className={`rounded-full px-3 py-1.5 transition-colors ${duoOpen === v ? "bg-teal text-cream" : "text-teal"}`}
                    >
                      {label as string}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Reveal delay={0.15}>
            <div className="mt-8 rounded-2xl bg-navy p-6 text-cream">
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm text-cream/80"
                >
                  <span className="font-semibold text-gold">{current.label}: </span>
                  {current.note}
                </motion.p>
              </AnimatePresence>
              <dl className="mt-5 space-y-4">
                {metricRows.map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs">
                      <dt className="text-cream/70">{r.label}</dt>
                      <dd className="font-semibold text-gold">{r.display}</dd>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/10">
                      <motion.div
                        className="h-full rounded-full bg-gold"
                        initial={false}
                        animate={{ width: `${Math.max(2, r.value)}%` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Link href={`${href(lang, "products")}?c=telas`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-forest">
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Escena */}
        <Reveal className="lg:col-span-7" delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] bg-[color-mix(in_oklab,var(--color-gold)_22%,var(--color-cream))] p-6 sm:p-10">
            {/* Penumbra del ambiente */}
            <div
              className="pointer-events-none absolute inset-0 z-20 bg-navy transition-opacity duration-700"
              style={{ opacity: dim * 0.55 }}
              aria-hidden
            />
            {/* Haz de luz en el piso */}
            <div
              className="pointer-events-none absolute inset-x-[12%] bottom-0 z-10 h-[22%] bg-gradient-to-b from-gold/60 to-transparent blur-xl transition-opacity duration-700"
              style={{ opacity: 1 - dim }}
              aria-hidden
            />

            <div className="relative z-0 mx-auto max-w-[560px]">
              {/* Marco de ventana */}
              <div className="rounded-xl bg-forest p-3 shadow-[0_40px_60px_-30px_rgb(18_29_44/0.6)] sm:p-4">
                <div
                  ref={windowRef}
                  className="relative aspect-[4/3.4] touch-none overflow-hidden rounded-md select-none"
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                >
                  <Exterior />
                  {/* Montantes */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-2.5 -translate-x-1/2 bg-forest" aria-hidden />
                  <div className="pointer-events-none absolute inset-x-0 top-[46%] h-2.5 bg-forest" aria-hidden />

                  {/* Cortina */}
                  <div
                    className="absolute inset-x-0 top-0 cursor-ns-resize transition-[height] duration-150 ease-out"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="absolute inset-0 transition-[opacity,background-color] duration-700"
                      style={{
                        backgroundColor: fabricColor,
                        opacity: fabric === "duo" ? 1 : m.cover,
                        backgroundImage:
                          fabric === "duo"
                            ? `repeating-linear-gradient(to bottom, ${fabricColor} 0 18px, ${
                                duoOpen ? "rgb(233 223 199 / 0.32)" : fabricColor
                              } 18px 36px)`
                            : isBlackout
                              ? "linear-gradient(90deg, rgb(18 29 44 / 0.08), transparent 30%, rgb(18 29 44 / 0.12))"
                              : "repeating-linear-gradient(90deg, rgb(18 29 44 / 0.08) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgb(18 29 44 / 0.06) 0 1px, transparent 1px 3px)",
                      }}
                    />
                    {fabric === "duo" && (
                      <div
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{
                          backgroundColor: "transparent",
                          backgroundImage: `repeating-linear-gradient(to bottom, rgb(18 29 44 / 0.06) 0 18px, transparent 18px 36px)`,
                        }}
                      />
                    )}
                    {/* Barra inferior + tirador */}
                    <div className="absolute inset-x-0 bottom-0 h-3 bg-navy">
                      <span className="absolute inset-x-0 top-0 h-[2px] bg-gold/70" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 grid h-9 w-9 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-gold text-navy shadow-lg ring-4 ring-cream/40">
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </div>
                  {/* Tubo superior */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-cream to-gold" aria-hidden />
                </div>
              </div>
              {/* Cadena */}
              <div
                aria-hidden
                className="absolute top-4 -right-3 w-[3px] transition-[height] duration-150 sm:-right-4"
                style={{
                  height: `${30 + (100 - height) * 0.5}%`,
                  backgroundImage: "radial-gradient(circle, var(--color-navy) 1.3px, transparent 1.7px)",
                  backgroundSize: "3px 8px",
                }}
              >
                <span className="absolute -bottom-3 left-1/2 h-4 w-2 -translate-x-1/2 rounded-full bg-navy" />
              </div>
              {/* Repisa */}
              <div className="mx-[-4%] mt-0 h-3 rounded-b-md bg-forest/90" aria-hidden />
            </div>

            <div className="relative z-30 mx-auto mt-6 flex max-w-[560px] items-center gap-4">
              <label htmlFor="lab-height" className="shrink-0 text-xs font-semibold text-navy/70">
                {t.shadeLabel}
              </label>
              <input
                id="lab-height"
                type="range"
                min={6}
                max={100}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-teal"
              />
              <span className="w-10 text-right text-xs font-bold tabular-nums text-teal">{height}%</span>
            </div>
            <p className="relative z-30 mt-2 text-center text-xs text-navy/55">{t.hint}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Vista exterior ilustrada con colores de la marca. */
function Exterior() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF6E6" />
          <stop offset="0.6" stopColor="#f3e3bd" />
          <stop offset="1" stopColor="#DAB36F" />
        </linearGradient>
        <radialGradient id="sun" cx="0.72" cy="0.3" r="0.35">
          <stop offset="0" stopColor="#FBF6E6" stopOpacity="1" />
          <stop offset="0.25" stopColor="#FBF6E6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FBF6E6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="340" fill="url(#sky)" />
      <rect width="400" height="340" fill="url(#sun)" />
      <circle cx="290" cy="100" r="26" fill="#FBF6E6" />
      <g fill="#144C42" opacity="0.35">
        <rect x="0" y="190" width="60" height="150" />
        <rect x="70" y="160" width="46" height="180" />
        <rect x="126" y="205" width="70" height="135" />
        <rect x="206" y="150" width="40" height="190" />
        <rect x="256" y="185" width="64" height="155" />
        <rect x="330" y="170" width="70" height="170" />
      </g>
      <g fill="#1C3F26" opacity="0.55">
        <rect x="20" y="250" width="80" height="90" />
        <rect x="110" y="235" width="56" height="105" />
        <rect x="176" y="262" width="90" height="78" />
        <rect x="276" y="240" width="54" height="100" />
        <rect x="340" y="255" width="60" height="85" />
      </g>
      <g fill="#FBF6E6" opacity="0.5">
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x={28 + (i % 6) * 62} y={262 + Math.floor(i / 6) * 22} width="10" height="8" />
        ))}
      </g>
      <path d="M0 312c60-14 120-14 200-6s140 6 200-4v38H0z" fill="#1C3F26" opacity="0.8" />
    </svg>
  );
}

"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, productColors, type Product, type ProductColor } from "@/data/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { ProductVisual } from "./ProductVisual";

/** Vista detallada de un producto: galería de fotos reales, colores y cotización. */
export function ProductDetail({
  product,
  initialColor,
  lang,
  t,
  inQuote,
  onAdd,
  onClose,
}: {
  product: Product | null;
  initialColor?: string;
  lang: Locale;
  t: Dictionary["products"];
  inQuote: boolean;
  onAdd: (id: string, color?: string) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {product && (
        <Panel
          key={product.id}
          p={product}
          initialColor={initialColor}
          lang={lang}
          t={t}
          inQuote={inQuote}
          onAdd={onAdd}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

function Panel({
  p,
  initialColor,
  lang,
  t,
  inQuote,
  onAdd,
  onClose,
}: {
  p: Product;
  initialColor?: string;
  lang: Locale;
  t: Dictionary["products"];
  inQuote: boolean;
  onAdd: (id: string, color?: string) => void;
  onClose: () => void;
}) {
  const [color, setColor] = useState<string | undefined>(initialColor ?? p.colors[0]);
  const photos = useMemo(() => p.photos ?? [], [p.photos]);
  const colorPhoto = color ? p.colorPhotos?.[color as ProductColor] : undefined;
  const [index, setIndex] = useState(() => Math.max(0, colorPhoto ? photos.indexOf(colorPhoto) : 0));
  const [added, setAdded] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const category = categories.find((c) => c.id === p.category);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (photos.length ? (i + 1) % photos.length : 0));
      if (e.key === "ArrowLeft") setIndex((i) => (photos.length ? (i - 1 + photos.length) % photos.length : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, photos.length]);

  const pickColor = (c: string) => {
    setColor(c);
    const cp = p.colorPhotos?.[c as ProductColor];
    if (cp && photos.includes(cp)) setIndex(photos.indexOf(cp));
  };

  const current = photos[index];

  return (
    <motion.div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.button
        type="button"
        aria-label={t.detail.close}
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={p.name[lang]}
        className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-[1.75rem] bg-cream outline-none sm:rounded-[1.75rem] md:grid-cols-2 md:overflow-hidden"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Galería */}
        <div className="relative bg-navy md:min-h-[560px]">
          <div className="relative aspect-square md:absolute md:inset-0 md:aspect-auto">
            {current ? (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Image src={current} alt={p.name[lang]} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0">
                <ProductVisual product={p} color={color} />
                <span className="absolute right-4 bottom-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-navy">
                  {t.card.photoSoon}
                </span>
              </div>
            )}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t.detail.prev}
                  onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-navy shadow transition hover:bg-gold"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={t.detail.next}
                  onClick={() => setIndex((i) => (i + 1) % photos.length)}
                  className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-navy shadow transition hover:bg-gold"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-navy/80 to-transparent p-4 pt-10">
                  {photos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      aria-label={`${t.detail.photo} ${i + 1}`}
                      aria-current={i === index}
                      onClick={() => setIndex(i)}
                      className={`relative h-14 w-14 overflow-hidden rounded-lg ring-2 transition ${
                        i === index ? "ring-gold" : "opacity-70 ring-cream/30 hover:opacity-100"
                      }`}
                    >
                      <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="flex flex-col p-6 sm:p-9 md:max-h-[92svh] md:overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow text-teal">
              {category?.name[lang]} · {p.group[lang]}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.detail.close}
              className="-mt-2 -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-navy/15 transition hover:bg-navy hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{p.name[lang]}</h2>
          <p className="mt-4 leading-relaxed text-navy/75">{p.description[lang]}</p>

          <dl className="mt-6 divide-y divide-navy/10 border-y border-navy/10 text-sm">
            {p.spec && (
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-navy/55">{t.detail.spec}</dt>
                <dd className="text-right font-semibold">{p.spec[lang]}</dd>
              </div>
            )}
            {p.variants && (
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-navy/55">{t.card.variants}</dt>
                <dd className="text-right font-semibold">{p.variants.join(" · ")}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-navy/55">{t.detail.colorsAvailable}</dt>
              <dd className="text-right font-semibold">
                {p.colors.length ? p.colors.map((c) => productColors[c][lang]).join(", ") : t.card.noColors}
              </dd>
            </div>
          </dl>

          {p.colors.length > 1 && (
            <div className="mt-6">
              <p className="text-[0.7rem] font-semibold tracking-wide text-navy/50 uppercase">
                {t.card.colors}: <span className="text-navy">{color ? productColors[color as ProductColor][lang] : ""}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={t.card.colors}>
                {p.colors.map((c) => {
                  const pc = productColors[c];
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={c === color}
                      aria-label={pc[lang]}
                      title={pc[lang]}
                      onClick={() => pickColor(c)}
                      className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-cream transition ${
                        c === color ? "ring-2 ring-teal" : "ring-1 ring-navy/20 hover:ring-teal/60"
                      }`}
                      style={{
                        background:
                          pc.hex === "transparent" ? "repeating-conic-gradient(#e9dfc7 0 25%, #FBF6E6 0 50%) 50%/8px 8px" : pc.hex,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={() => {
                onAdd(p.id, color);
                setAdded(true);
              }}
              className={`btn w-full ${inQuote || added ? "btn-navy" : "btn-teal"}`}
            >
              {inQuote || added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {inQuote || added ? t.card.added : t.card.add}
            </button>
            <p className="mt-3 text-center text-xs text-navy/50">{t.detail.note}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

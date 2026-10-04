"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ClipboardList, Plus, Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { categories, productColors, products, type CategoryId, type Product } from "@/data/products";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { categoryIcons } from "@/components/ui/icons";
import { ProductVisual } from "./ProductVisual";
import { useQuote } from "./QuoteProvider";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function Catalog({ lang, t }: { lang: Locale; t: Dictionary["products"] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = params.get("c");
  const [cat, setCat] = useState<CategoryId | "all">(
    categories.some((c) => c.id === initial) ? (initial as CategoryId) : "all",
  );
  // Si cambia ?c= (p. ej. desde el megamenú estando en esta página), se sincroniza el filtro
  const [prevParam, setPrevParam] = useState(initial);
  if (initial !== prevParam) {
    setPrevParam(initial);
    setCat(categories.some((c) => c.id === initial) ? (initial as CategoryId) : "all");
  }
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query);
  const quote = useQuote();

  const selectCat = (c: CategoryId | "all") => {
    setCat(c);
    const url = c === "all" ? pathname : `${pathname}?c=${c}`;
    router.replace(url, { scroll: false });
  };

  const list = useMemo(() => {
    const nq = normalize(q.trim());
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!nq) return true;
      const hay = normalize(
        [p.name.es, p.name.en, p.group.es, p.group.en, p.spec?.es ?? "", ...p.colors.map((c) => `${productColors[c].es} ${productColors[c].en}`)].join(" "),
      );
      return nq.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [cat, q]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, []);

  return (
    <section className="relative py-14 sm:py-20" id="catalogo">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Filtros */}
        <aside className="min-w-0 lg:col-span-3">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.filters.search}
                aria-label={t.filters.search}
                className="field !rounded-full !pl-11"
              />
            </div>
            <nav aria-label="Categorías" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
              {(["all", ...categories.map((c) => c.id)] as const).map((id) => {
                const active = cat === id;
                const c = categories.find((x) => x.id === id);
                const Icon = c ? categoryIcons[c.id] : ClipboardList;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectCat(id)}
                    aria-pressed={active}
                    className={`relative flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-semibold transition-colors lg:rounded-xl lg:px-4 lg:py-3 ${
                      active ? "text-cream" : "text-navy ring-1 ring-navy/10 ring-inset hover:bg-teal/5 lg:ring-0"
                    }`}
                  >
                    {active && (
                      <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-teal lg:rounded-xl" transition={{ type: "spring", stiffness: 380, damping: 34 }} />
                    )}
                    <Icon className={`relative h-4 w-4 ${active ? "text-gold" : "text-teal"}`} />
                    <span className="relative flex-1 whitespace-nowrap">{c ? c.name[lang] : t.filters.all}</span>
                    <span className={`relative text-xs ${active ? "text-cream/70" : "text-navy/40"}`}>
                      {c ? counts.get(c.id) : products.length}
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="hidden overflow-hidden rounded-2xl bg-navy p-6 text-cream lg:block">
              <p className="font-display text-lg font-bold">{t.help.title}</p>
              <p className="mt-2 text-sm text-cream/70">{t.help.text}</p>
              <Link href={href(lang, "contact")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                {t.help.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <div className="min-w-0 lg:col-span-9">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              {cat !== "all" && (
                <p className="max-w-xl text-sm text-navy/65">{categories.find((c) => c.id === cat)?.description[lang]}</p>
              )}
              <p className="mt-1 text-xs font-semibold tracking-wide text-teal" aria-live="polite">
                {t.filters.results.replace("{n}", String(list.length))}
              </p>
            </div>
            {(cat !== "all" || query) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  selectCat("all");
                }}
                className="flex shrink-0 items-center gap-1 text-xs font-semibold text-navy/60 hover:text-teal"
              >
                <X className="h-3.5 w-3.5" />
                {t.filters.reset}
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy/20 p-12 text-center text-navy/60">{t.filters.empty}</div>
          ) : (
            <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((p) => (
                  <ProductCard key={p.id} p={p} lang={lang} t={t} inQuote={quote.has(p.id)} onAdd={quote.add} />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>

      {/* Barra de cotización flotante */}
      <AnimatePresence>
        {quote.count > 0 && !quote.isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2"
          >
            <button
              type="button"
              onClick={quote.open}
              className="flex items-center gap-3 rounded-full bg-navy py-2.5 pr-3 pl-5 text-sm font-semibold text-cream shadow-[0_20px_40px_-12px_rgb(18_29_44/0.6)] ring-1 ring-gold/40"
            >
              <ClipboardList className="h-4 w-4 text-gold" />
              {t.quote.open}
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-gold px-2 text-xs text-navy">{quote.count}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProductCard({
  p,
  lang,
  t,
  inQuote,
  onAdd,
}: {
  p: Product;
  lang: Locale;
  t: Dictionary["products"];
  inQuote: boolean;
  onAdd: (id: string, color?: string) => void;
}) {
  const [color, setColor] = useState<string | undefined>(p.colors[0]);
  const [flash, setFlash] = useState(false);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-cream ring-1 ring-navy/10 transition-shadow duration-500 hover:shadow-[0_30px_50px_-30px_rgb(18_29_44/0.5)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <div className="h-full w-full transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]">
          <ProductVisual product={p} color={color} />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-cream/90 px-2.5 py-1 text-[0.68rem] font-bold tracking-wide text-teal uppercase backdrop-blur">
          {p.group[lang]}
        </span>
        {p.spec && (
          <span className="absolute right-3 bottom-3 rounded-full bg-navy/85 px-2.5 py-1 text-[0.68rem] font-semibold text-cream backdrop-blur">
            {p.spec[lang]}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.05rem] leading-snug">{p.name[lang]}</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy/65">{p.description[lang]}</p>

        <div className="mt-4">
          {p.colors.length > 0 ? (
            <div>
              <p className="text-[0.7rem] font-semibold tracking-wide text-navy/50 uppercase">
                {t.card.colors}: <span className="text-navy">{color ? productColors[color as keyof typeof productColors][lang] : ""}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={t.card.colors}>
                {p.colors.map((c) => {
                  const pc = productColors[c];
                  const active = c === color;
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={pc[lang]}
                      title={pc[lang]}
                      onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-cream transition ${
                        active ? "ring-2 ring-teal" : "ring-1 ring-navy/20 hover:ring-teal/60"
                      }`}
                      style={{
                        background:
                          pc.hex === "transparent"
                            ? "repeating-conic-gradient(#e9dfc7 0 25%, #FBF6E6 0 50%) 50%/8px 8px"
                            : pc.hex,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ) : p.variants ? (
            <p className="text-xs text-navy/60">
              <span className="font-semibold text-navy/50 uppercase">{t.card.variants}: </span>
              {p.variants.join(" · ")}
            </p>
          ) : (
            <p className="text-xs text-navy/50">{t.card.noColors}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            onAdd(p.id, color);
            setFlash(true);
            window.setTimeout(() => setFlash(false), 1400);
          }}
          className={`btn mt-5 w-full !py-3 ${inQuote ? "btn-navy" : "btn-ghost-dark"}`}
        >
          {flash || inQuote ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {flash || inQuote ? t.card.added : t.card.add}
        </button>
      </div>
    </motion.li>
  );
}

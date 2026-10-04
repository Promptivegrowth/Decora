"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ClipboardList, Minus, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { productColors, products } from "@/data/products";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Consent, Field, FormFeedback, Honeypot, Submit, SuccessPanel, useLeadForm } from "@/components/forms/FormKit";
import { ProductVisual } from "./ProductVisual";
import { useQuote } from "./QuoteProvider";

const byId = new Map(products.map((p) => [p.id, p]));

export function QuoteDrawer({
  lang,
  t,
  forms,
  whatsappMessage,
}: {
  lang: Locale;
  t: Dictionary["products"]["quote"];
  forms: Dictionary["forms"];
  whatsappMessage: string;
}) {
  const q = useQuote();
  const panelRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(
    () =>
      q.items
        .map((it, index) => ({ ...it, index, product: byId.get(it.id) }))
        .filter((l) => l.product),
    [q.items],
  );

  const extra = useCallback(
    () => ({
      items: lines.map((l) => ({
        id: l.id,
        name: l.product!.name.es,
        color: l.color ? productColors[l.color as keyof typeof productColors]?.es : undefined,
        qty: l.qty,
      })),
    }),
    [lines],
  );
  const { errors, status, setStatus, onSubmit } = useLeadForm("quote", lang, extra, q.clear);

  useEffect(() => {
    if (!q.isOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && q.close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [q.isOpen, q]);

  return (
    <AnimatePresence>
      {q.isOpen && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={q.close}
          />
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="absolute top-0 right-0 flex h-full w-full max-w-[480px] flex-col bg-cream shadow-2xl outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <header className="flex items-center justify-between bg-navy px-6 py-5 text-cream">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-display text-lg font-bold">{t.title}</p>
                  <p className="text-xs text-cream/60">
                    {q.count} {t.items}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={q.close}
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-cream/20 hover:bg-cream/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="h-1 bg-gold" />

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {status === "success" ? (
                <SuccessPanel t={forms} onAgain={() => setStatus("idle")} />
              ) : lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="slats grid h-24 w-24 place-items-center rounded-2xl bg-teal text-cream/40">
                    <ClipboardList className="h-9 w-9 text-gold" />
                  </div>
                  <p className="mt-6 max-w-xs text-navy/70">{t.empty}</p>
                  <Link href={href(lang, "products")} onClick={q.close} className="btn btn-teal mt-6">
                    {t.browse}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {lines.map((l) => {
                        const p = l.product!;
                        return (
                          <motion.li
                            key={`${l.id}-${l.index}`}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            className="flex gap-3 rounded-xl border border-navy/10 bg-cream p-3"
                          >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                              <ProductVisual product={p} color={l.color} small />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">{p.name[lang]}</p>
                              {p.colors.length > 1 && (
                                <label className="mt-1 flex items-center gap-2 text-xs text-navy/60">
                                  {t.color}
                                  <select
                                    value={l.color ?? ""}
                                    onChange={(e) => q.update(l.index, { color: e.target.value || undefined })}
                                    className="rounded-md border border-navy/15 bg-cream px-2 py-1 text-xs text-navy"
                                  >
                                    <option value="">—</option>
                                    {p.colors.map((c) => (
                                      <option key={c} value={c}>
                                        {productColors[c][lang]}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              )}
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center rounded-full ring-1 ring-navy/15">
                                  <button
                                    type="button"
                                    className="grid h-7 w-7 place-items-center"
                                    aria-label="-1"
                                    onClick={() => q.update(l.index, { qty: Math.max(1, l.qty - 1) })}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <input
                                    aria-label={t.qty}
                                    value={l.qty}
                                    inputMode="numeric"
                                    onChange={(e) => {
                                      const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
                                      q.update(l.index, { qty: Number.isFinite(n) && n > 0 ? Math.min(n, 99999) : 1 });
                                    }}
                                    className="w-10 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
                                  />
                                  <button
                                    type="button"
                                    className="grid h-7 w-7 place-items-center"
                                    aria-label="+1"
                                    onClick={() => q.update(l.index, { qty: l.qty + 1 })}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => q.remove(l.index)}
                                  className="flex items-center gap-1 text-xs text-navy/50 hover:text-forest"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  {t.remove}
                                </button>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                  <button type="button" onClick={q.clear} className="mt-3 text-xs font-semibold text-navy/50 hover:text-forest">
                    {t.clear}
                  </button>

                  <form noValidate onSubmit={onSubmit} className="relative mt-8 grid gap-4 border-t border-navy/10 pt-6">
                    <p className="text-sm text-navy/70">{t.intro}</p>
                    <Honeypot />
                    <Field t={forms} name="name" label={forms.name} error={errors.name} autoComplete="name" required />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field t={forms} name="phone" label={forms.phone} type="tel" error={errors.phone} autoComplete="tel" required />
                      <Field t={forms} name="email" label={forms.email} type="email" error={errors.email} autoComplete="email" required />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field t={forms} name="company" label={forms.company} autoComplete="organization" />
                      <Field t={forms} name="city" label={forms.city} autoComplete="address-level2" />
                    </div>
                    <Field t={forms} name="message" label={forms.message} as="textarea" rows={3} />
                    <Consent t={forms} lang={lang} error={errors.consent} />
                    <FormFeedback t={forms} status={status} onReset={() => setStatus("idle")} whatsappMessage={whatsappMessage} />
                    <Submit t={forms} status={status} label={t.send} />
                  </form>
                </>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

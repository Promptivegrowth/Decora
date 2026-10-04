import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories, products, type CategoryId } from "@/data/products";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { ProductVisual } from "@/components/products/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryIcons } from "@/components/ui/icons";

/** Producto representativo por categoría para la ilustración */
const featured: Record<CategoryId, { id: string; color?: string }> = {
  telas: { id: "tela-duo-screen", color: "crema" },
  sistemas: { id: "mecanismo-rolleasse-kit" },
  perfileria: { id: "tubo-aluminio-38" },
  motorizacion: { id: "motor-raex-electrico" },
  rieles: { id: "riel-hotelero" },
  accesorios: { id: "cadena-plastica", color: "crema" },
};

export function Solutions({ lang, t }: { lang: Locale; t: Dictionary["home"]["solutions"] }) {
  const base = href(lang, "products");
  return (
    <section className="relative bg-[color-mix(in_oklab,var(--color-teal)_6%,var(--color-cream))] py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />
          <Reveal>
            <Link href={base} className="btn btn-ghost-dark shrink-0">
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const Icon = categoryIcons[c.id];
            const f = featured[c.id];
            const product = products.find((p) => p.id === f.id)!;
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <Reveal as="li" key={c.id} delay={(i % 3) * 0.08}>
                <Link
                  href={`${base}?c=${c.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-cream ring-1 ring-navy/10 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(18_29_44/0.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
                      <ProductVisual product={product} color={f.color} />
                    </div>
                    {/* Cortina con la descripción */}
                    <div className="absolute inset-0 flex -translate-y-full flex-col justify-end bg-navy/92 p-6 text-cream transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0">
                      <p className="text-sm leading-relaxed text-cream/85">{c.description[lang]}</p>
                      <span className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" />
                    </div>
                    <span className="absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
                      {count} {t.items}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-4 p-6">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-lg font-bold">{c.name[lang]}</span>
                      <span className="block text-sm text-navy/60">{c.short[lang]}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-teal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

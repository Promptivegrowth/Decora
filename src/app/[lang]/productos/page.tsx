import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHero } from "@/components/ui/PageHero";
import { Catalog } from "@/components/products/Catalog";
import { LightLab } from "@/components/home/LightLab";
import { FinalCta } from "@/components/home/FinalCta";

export async function generateMetadata({ params }: PageProps<"/[lang]/productos">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.products.title,
    description: d.meta.products.description,
    alternates: { canonical: href(lang, "products"), languages: { es: href("es", "products"), en: href("en", "products") } },
  };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/productos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  return (
    <>
      <PageHero
        eyebrow={d.products.hero.eyebrow}
        title={d.products.hero.title}
        text={d.products.hero.text}
        image="/images/reales/stock-telas.webp"
        crumbs={[{ label: d.nav.home, href: href(lang, "home") }, { label: d.nav.solutions }]}
      />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Catalog lang={lang} t={d.products} />
      </Suspense>
      <div className="border-t border-navy/10">
        <LightLab lang={lang} t={d.home.lab} />
      </div>
      <FinalCta lang={lang} t={d.home.cta} whatsappMessage={d.common.whatsappDistributor} />
    </>
  );
}

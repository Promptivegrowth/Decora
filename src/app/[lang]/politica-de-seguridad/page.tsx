import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LegalPage } from "@/components/ui/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/politica-de-seguridad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.security.title,
    description: d.meta.security.description,
    alternates: { canonical: href(lang, "security"), languages: { es: href("es", "security"), en: href("en", "security") } },
  };
}

export default async function SecurityPage({ params }: PageProps<"/[lang]/politica-de-seguridad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  return <LegalPage lang={lang} dict={d} data={d.security} current="security" image="/images/almacen-rollos.webp" />;
}

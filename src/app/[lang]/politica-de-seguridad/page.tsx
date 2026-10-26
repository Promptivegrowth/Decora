import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/politica-de-seguridad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata({ lang, key: "security", title: d.meta.security.title, description: d.meta.security.description });
}

export default async function SecurityPage({ params }: PageProps<"/[lang]/politica-de-seguridad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  return <LegalPage lang={lang} dict={d} data={d.security} current="security" image="/images/almacen-rollos.webp" />;
}

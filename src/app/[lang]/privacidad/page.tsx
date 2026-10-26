import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata({ lang, key: "privacy", title: d.meta.privacy.title, description: d.meta.privacy.description });
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacidad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);
  return <LegalPage lang={lang} dict={d} data={d.privacy} current="privacy" image="/images/oficina.webp" />;
}

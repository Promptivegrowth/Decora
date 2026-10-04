import { notFound } from "next/navigation";
import { fabricCount, productCount } from "@/data/products";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Hero } from "@/components/home/Hero";
import { Audience } from "@/components/home/Audience";
import { Solutions } from "@/components/home/Solutions";
import { LightLab } from "@/components/home/LightLab";
import { Pitch } from "@/components/home/Pitch";
import { Process } from "@/components/home/Process";
import { VideoStory } from "@/components/home/VideoStory";
import { Gallery } from "@/components/home/Gallery";
import { FinalCta } from "@/components/home/FinalCta";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const h = dict.home;

  const stats = h.stats.map((s) => ({
    value: Number(s.value.replace("{products}", String(Math.floor(productCount / 5) * 5)).replace("{fabrics}", String(fabricCount))),
    suffix: s.suffix,
    label: s.label,
  }));

  return (
    <>
      <Hero lang={lang} t={h.hero} stats={stats} />
      <Audience lang={lang} t={h.audience} />
      <Solutions lang={lang} t={h.solutions} />
      <LightLab lang={lang} t={h.lab} />
      <Pitch lang={lang} t={h.pitch} />
      <Process t={h.process} />
      <VideoStory t={h.videos} common={dict.common} />
      <Gallery t={h.gallery} />
      <FinalCta lang={lang} t={h.cta} whatsappMessage={dict.common.whatsappDistributor} />
    </>
  );
}

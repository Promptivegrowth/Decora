import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { whatsappLink } from "@/data/site";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta({
  lang,
  t,
  whatsappMessage,
}: {
  lang: Locale;
  t: Dictionary["home"]["cta"];
  whatsappMessage: string;
}) {
  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-20 text-cream sm:px-12 sm:py-28">
        <div className="slats pointer-events-none absolute inset-0 text-cream/[0.14]" aria-hidden />
        <Logo
          color="dorado"
          layout="icon"
          alt=""
          className="pointer-events-none absolute -right-10 -bottom-16 h-auto w-[260px] opacity-[0.08] sm:w-[420px]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-gold">{t.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-4xl leading-[1.05] sm:text-6xl">{t.title}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/75">{t.text}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href={href(lang, "distributors", "postular")} className="btn btn-gold">
                {t.primary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                <WhatsAppIcon className="h-4 w-4" />
                {t.secondary}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

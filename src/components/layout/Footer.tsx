import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen, Mail, MapPin } from "lucide-react";
import { categories } from "@/data/products";
import { site, whatsappLink } from "@/data/site";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/ui/BrandIcons";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const f = dict.footer;
  const nav = dict.nav;
  const socials = [
    { url: site.social.facebook, Icon: FacebookIcon, label: "Facebook" },
    { url: site.social.instagram, Icon: InstagramIcon, label: "Instagram" },
    { url: site.social.tiktok, Icon: TikTokIcon, label: "TikTok" },
    { url: site.social.youtube, Icon: YouTubeIcon, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="relative overflow-hidden bg-navy text-cream">
      <div className="slats pointer-events-none absolute inset-0 text-cream/[0.12]" aria-hidden />

      {/* Franja distribuidores */}
      <div className="relative border-b border-cream/10">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-bold sm:text-3xl">{f.distributorTitle}</p>
            <p className="mt-1 text-cream/65">{f.distributorText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={href(lang, "distributors", "postular")} className="btn btn-gold">
              {nav.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappLink(dict.common.whatsappDistributor)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {dict.common.whatsapp}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo color="dorado" layout="stacked" className="h-auto w-44" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/65">{f.tagline}</p>
          <Link
            href={href(lang, "complaints")}
            className="group mt-6 inline-flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-navy transition-colors hover:bg-gold"
          >
            <BookOpen className="h-6 w-6 text-teal" />
            <span className="leading-tight">
              <span className="block text-sm font-bold">{f.complaints}</span>
              <span className="block text-[0.7rem] text-navy/60">{site.legalName}</span>
            </span>
          </Link>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map(({ url, Icon, label }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-cream/20 transition-colors hover:bg-gold hover:text-navy"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label={f.navigation} className="lg:col-span-2">
          <p className="eyebrow mb-5 text-gold">{f.navigation}</p>
          <ul className="space-y-3 text-sm text-cream/75">
            {(
              [
                ["home", nav.home],
                ["about", nav.about],
                ["products", nav.solutions],
                ["distributors", nav.distributor],
                ["contact", nav.contact],
              ] as const
            ).map(([k, label]) => (
              <li key={k}>
                <Link href={href(lang, k)} className="transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={f.solutions} className="lg:col-span-3">
          <p className="eyebrow mb-5 text-gold">{f.solutions}</p>
          <ul className="space-y-3 text-sm text-cream/75">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`${href(lang, "products")}?c=${c.id}`} className="transition-colors hover:text-gold">
                  {c.name[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-5 text-gold">{f.contact}</p>
          <ul className="space-y-4 text-sm text-cream/75">
            <li>
              <a
                href={whatsappLink(dict.common.whatsappGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <WhatsAppIcon className="h-4 w-4 text-gold" />
                {site.phoneDisplay}
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 break-all transition-colors hover:text-gold">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  {site.email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{site.address || site.country[lang]}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
            {site.ruc ? ` · RUC ${site.ruc}` : ""} · {f.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href={href(lang, "privacy")} className="transition-colors hover:text-gold">
              {f.privacy}
            </Link>
            <Link href={href(lang, "security")} className="transition-colors hover:text-gold">
              {f.security}
            </Link>
            <Link href={href(lang, "complaints")} className="transition-colors hover:text-gold">
              {f.complaints}
            </Link>
            <a href="#top" className="flex items-center gap-2 transition-colors hover:text-gold">
              {f.backTop}
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-gold" aria-hidden />
    </footer>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, ClipboardList, Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { categories } from "@/data/products";
import { site, whatsappLink } from "@/data/site";
import { href, routeFromSlug, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { categoryIcons, needIcons } from "@/components/ui/icons";
import { useQuote } from "@/components/products/QuoteProvider";
import { LangSwitch } from "./LangSwitch";

type Props = { lang: Locale; nav: Dictionary["nav"]; common: Dictionary["common"] };
type Panel = "about" | "solutions" | null;

const ROLL = [0.76, 0, 0.24, 1] as const;

export function Header({ lang, nav, common }: Props) {
  const pathname = usePathname() ?? "";
  const slug = pathname.split("/")[2] ?? "";
  const current: RouteKey | null = slug ? (routeFromSlug(slug) ?? null) : "home";
  const [panel, setPanel] = useState<Panel>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastY = useRef(0);
  const quote = useQuote();
  const ids = { about: useId(), solutions: useId(), mobile: useId() };

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Cerrar menús al cambiar de página
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacción a la navegación
    setPanel(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 420);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openPanel = useCallback((p: Panel) => {
    window.clearTimeout(closeTimer.current);
    setPanel(p);
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPanel(null), 160);
  }, []);

  const solid = scrolled || panel !== null;
  const light = !solid && !mobileOpen; // texto claro sobre hero oscuro
  const showHeader = !hidden || panel !== null || mobileOpen;

  const linkCls = (active: boolean) =>
    `relative flex items-center gap-1.5 px-1 py-2 text-[0.82rem] font-semibold tracking-wide transition-colors duration-300 after:absolute after:inset-x-1 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100 ${
      active ? "after:scale-x-100" : "after:scale-x-0"
    }`;

  return (
    <>
      <a
        href="#contenido"
        className="fixed top-2 left-2 z-[120] -translate-y-20 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy focus:translate-y-0"
      >
        {common.skip}
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: showHeader ? 0 : "-100%" }}
        transition={{ duration: 0.5, ease: ROLL }}
        onPointerLeave={scheduleClose}
      >
        {/* Barra superior */}
        <div
          className={`hidden overflow-hidden bg-navy text-cream/75 transition-[max-height] duration-500 lg:block ${
            scrolled ? "max-h-0" : "max-h-10"
          }`}
        >
          <div className="container-x flex h-9 items-center justify-between text-[0.72rem] tracking-wide">
            <ul className="flex items-center gap-6">
              {nav.topbar.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink(common.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream transition-colors hover:text-gold"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-gold" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Barra principal */}
        <div
          className={`relative transition-[background-color,box-shadow,color] duration-500 ${
            solid || mobileOpen
              ? "bg-cream/95 text-navy shadow-[0_10px_40px_-20px_rgb(18_29_44/0.35)] backdrop-blur-xl"
              : "bg-transparent text-cream"
          }`}
        >
          <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
            <Link href={href(lang, "home")} className="relative z-10 block shrink-0" aria-label="D'Cora Hogar — inicio">
              <span className="relative block h-9 w-[150px] sm:h-10 sm:w-[168px]">
                <Logo
                  color="crema"
                  priority
                  className={`absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500 ${
                    light ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Logo
                  color="azul"
                  priority
                  alt=""
                  className={`absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500 ${
                    light ? "opacity-0" : "opacity-100"
                  }`}
                />
              </span>
            </Link>

            {/* Navegación escritorio */}
            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-7 xl:gap-9">
                <li>
                  <Link href={href(lang, "home")} className={linkCls(current === "home")} onPointerEnter={scheduleClose}>
                    {nav.home}
                  </Link>
                </li>
                <li onPointerEnter={() => openPanel("about")}>
                  <button
                    type="button"
                    className={linkCls(current === "about")}
                    aria-expanded={panel === "about"}
                    aria-controls={ids.about}
                    onClick={() => setPanel(panel === "about" ? null : "about")}
                  >
                    {nav.about}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${panel === "about" ? "rotate-180" : ""}`}
                    />
                  </button>
                </li>
                <li onPointerEnter={() => openPanel("solutions")}>
                  <button
                    type="button"
                    className={linkCls(current === "products")}
                    aria-expanded={panel === "solutions"}
                    aria-controls={ids.solutions}
                    onClick={() => setPanel(panel === "solutions" ? null : "solutions")}
                  >
                    {nav.solutions}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        panel === "solutions" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </li>
                <li>
                  <Link
                    href={href(lang, "distributors")}
                    className={linkCls(current === "distributors")}
                    onPointerEnter={scheduleClose}
                  >
                    {nav.distributor}
                  </Link>
                </li>
                <li>
                  <Link href={href(lang, "contact")} className={linkCls(current === "contact")} onPointerEnter={scheduleClose}>
                    {nav.contact}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              <LangSwitch lang={lang} label={common.language} tone={light ? "light" : "dark"} className="hidden sm:flex" />
              <button
                type="button"
                onClick={quote.open}
                className={`relative grid h-10 w-10 place-items-center rounded-full ring-1 ring-inset transition-colors duration-300 ${
                  light ? "ring-cream/30 hover:bg-cream/10" : "ring-navy/15 hover:bg-navy/5"
                }`}
                aria-label={`${nav.quote} (${quote.count})`}
              >
                <ClipboardList className="h-[18px] w-[18px]" />
                <AnimatePresence>
                  {quote.count > 0 && (
                    <motion.span
                      key={quote.count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-navy"
                    >
                      {quote.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <Link href={href(lang, "distributors", "postular")} className="btn btn-gold hidden !py-2.5 md:inline-flex">
                {nav.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${
                  light ? "bg-cream/10 ring-1 ring-cream/30 ring-inset" : "bg-navy text-cream"
                }`}
                aria-expanded={mobileOpen}
                aria-controls={ids.mobile}
                aria-label={mobileOpen ? common.close : common.menu}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Indicador de scroll: el "cordón" dorado */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold"
            style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
          />

          {/* Megamenús (se despliegan como una cortina) */}
          <AnimatePresence>
            {panel && (
              <motion.div
                key={panel}
                id={panel === "about" ? ids.about : ids.solutions}
                className="absolute inset-x-0 top-full hidden border-t border-navy/10 bg-cream text-navy shadow-[0_30px_60px_-30px_rgb(18_29_44/0.45)] lg:block"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.55, ease: ROLL }}
                onPointerEnter={() => openPanel(panel)}
              >
                {panel === "solutions" ? (
                  <SolutionsPanel lang={lang} nav={nav} />
                ) : (
                  <AboutPanel lang={lang} nav={nav} />
                )}
                <div className="h-1.5 bg-gold" aria-hidden />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Menú móvil: una cortina que baja */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id={ids.mobile}
            className="fixed inset-0 z-[45] flex flex-col bg-navy pt-[var(--header-h)] text-cream lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: ROLL }}
          >
            <div className="slats pointer-events-none absolute inset-0 text-cream/30" aria-hidden />
            <MobileMenu lang={lang} nav={nav} common={common} current={current} />
            <div className="h-2 shrink-0 bg-gold" aria-hidden />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SolutionsPanel({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const base = href(lang, "products");
  return (
    <div className="container-x grid grid-cols-12 gap-10 py-10">
      <div className="col-span-5">
        <p className="eyebrow mb-5 text-teal">{nav.mega.byCategory}</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
          {categories.map((c, i) => {
            const Icon = categoryIcons[c.id];
            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.04, duration: 0.4 }}
              >
                <Link href={`${base}?c=${c.id}`} className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-teal/[0.06]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{c.name[lang]}</span>
                    <span className="block text-xs leading-snug text-navy/60">{c.short[lang]}</span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
        <Link href={base} className="mt-5 ml-3 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-forest">
          {nav.mega.catalogCta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="col-span-3 border-l border-navy/10 pl-8">
        <p className="eyebrow mb-5 text-teal">{nav.mega.byNeed}</p>
        <ul className="space-y-1">
          {nav.mega.needs.map((n, i) => {
            const Icon = needIcons[i];
            return (
              <li key={n.label}>
                <Link href={`${base}?c=${n.filter}`} className="group flex items-start gap-3 rounded-lg py-2">
                  <Icon className="mt-0.5 h-4 w-4 text-gold" />
                  <span>
                    <span className="block text-sm font-semibold transition-colors group-hover:text-teal">{n.label}</span>
                    <span className="block text-xs text-navy/55">{n.text}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Link
        href={href(lang, "distributors")}
        className="group relative col-span-4 flex min-h-[290px] flex-col justify-end overflow-hidden rounded-2xl bg-teal p-7 text-cream"
      >
        <Image
          src="/images/reales/corte-perfiles.webp"
          alt=""
          fill
          sizes="400px"
          className="object-cover opacity-45 transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" aria-hidden />
        <span className="relative">
          <span className="eyebrow text-gold">{nav.mega.featuredEyebrow}</span>
          <span className="mt-2 block font-display text-2xl leading-tight font-bold">{nav.mega.featuredTitle}</span>
          <span className="mt-2 block text-sm text-cream/75">{nav.mega.featuredText}</span>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
            {nav.mega.featuredCta}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </Link>
    </div>
  );
}

function AboutPanel({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  return (
    <div className="container-x grid grid-cols-12 gap-10 py-10">
      <div className="col-span-4">
        <p className="eyebrow mb-3 text-teal">{nav.aboutMenu.title}</p>
        <p className="font-display text-3xl leading-tight font-bold">D&rsquo;Cora Hogar</p>
        <Link
          href={href(lang, "about")}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-forest"
        >
          {nav.about}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="col-span-5 grid grid-cols-2 gap-2">
        {nav.aboutMenu.items.map((it, i) => (
          <motion.li
            key={it.hash}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          >
            <Link
              href={href(lang, "about", it.hash)}
              className="group block h-full rounded-xl border border-navy/10 p-4 transition-colors hover:border-teal hover:bg-teal hover:text-cream"
            >
              <span className="font-display text-xs font-bold text-gold">0{i + 1}</span>
              <span className="mt-1 block text-sm font-semibold">{it.label}</span>
              <span className="mt-1 block text-xs text-navy/55 transition-colors group-hover:text-cream/70">{it.text}</span>
            </Link>
          </motion.li>
        ))}
      </ul>
      <div className="relative col-span-3 overflow-hidden rounded-2xl">
        <Image src="/images/reales/fundadores.webp" alt="" fill sizes="320px" className="object-cover object-[50%_62%]" />
      </div>
    </div>
  );
}

function MobileMenu({
  lang,
  nav,
  common,
  current,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
  common: Dictionary["common"];
  current: RouteKey | null;
}) {
  const [open, setOpen] = useState<"about" | "solutions" | null>(null);
  const items: { key: RouteKey; label: string; sub?: "about" | "solutions" }[] = [
    { key: "home", label: nav.home },
    { key: "about", label: nav.about, sub: "about" },
    { key: "products", label: nav.solutions, sub: "solutions" },
    { key: "distributors", label: nav.distributor },
    { key: "contact", label: nav.contact },
  ];
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto">
      <nav aria-label="Móvil" className="container-x flex-1 py-6">
        <ul className="divide-y divide-cream/10">
          {items.map((it, i) => (
            <motion.li
              key={it.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {it.sub ? (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-left font-display text-2xl font-bold"
                    aria-expanded={open === it.sub}
                    onClick={() => setOpen(open === it.sub ? null : it.sub!)}
                  >
                    <span className={current === it.key ? "text-gold" : ""}>{it.label}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${open === it.sub ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === it.sub && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <li>
                          <Link href={href(lang, it.key)} className="flex items-center gap-2 py-2 text-sm font-semibold text-gold">
                            {it.sub === "solutions" ? nav.mega.catalogCta : nav.about}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </li>
                        {it.sub === "solutions"
                          ? categories.map((c) => {
                              const Icon = categoryIcons[c.id];
                              return (
                                <li key={c.id}>
                                  <Link
                                    href={`${href(lang, "products")}?c=${c.id}`}
                                    className="flex items-center gap-3 py-2.5 text-cream/80"
                                  >
                                    <Icon className="h-4 w-4 text-gold" />
                                    {c.name[lang]}
                                  </Link>
                                </li>
                              );
                            })
                          : nav.aboutMenu.items.map((a) => (
                              <li key={a.hash}>
                                <Link href={href(lang, "about", a.hash)} className="block py-2.5 text-cream/80">
                                  {a.label}
                                </Link>
                              </li>
                            ))}
                        <li className="h-3" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={href(lang, it.key)}
                  className={`block py-4 font-display text-2xl font-bold ${current === it.key ? "text-gold" : ""}`}
                >
                  {it.label}
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>
      <motion.div
        className="container-x space-y-4 pb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="grid gap-3 xs:grid-cols-2">
          <Link href={href(lang, "distributors", "postular")} className="btn btn-gold whitespace-nowrap">
            {nav.cta}
          </Link>
          <a
            href={whatsappLink(common.whatsappGreeting)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-light"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {common.whatsapp}
          </a>
        </div>
        <div className="flex items-center justify-between">
          <a href={`tel:+${site.whatsapp}`} className="flex items-center gap-2 text-sm text-cream/70">
            <Phone className="h-4 w-4 text-gold" />
            {site.phoneDisplay}
          </a>
          <LangSwitch lang={lang} label={common.language} tone="light" />
        </div>
      </motion.div>
    </div>
  );
}

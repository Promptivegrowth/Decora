import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { site } from "@/data/site";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { QuoteProvider } from "@/components/products/QuoteProvider";
import { QuoteDrawer } from "@/components/products/QuoteDrawer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#144C42",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.siteTitle, template: `%s | ${site.name}` },
    description: dict.meta.siteDescription,
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: lang === "es" ? "es_PE" : "en_US",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
    },
    twitter: { card: "summary_large_image" },
    alternates: { languages: { es: "/es", en: "/en", "x-default": "/es" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/logo-dorado.webp`,
    telephone: site.phoneDisplay,
    ...(site.email ? { email: site.email } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Lima", addressCountry: "PE" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneDisplay,
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
  };

  return (
    <html lang={lang} className={`${montserrat.variable}`} id="top" suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`#preloader{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <QuoteProvider>
          <Preloader label={dict.common.loading} />
          <Header lang={lang} nav={dict.nav} common={dict.common} />
          <main id="contenido">{children}</main>
          <Footer lang={lang} dict={dict} />
          <WhatsAppFloat label={dict.common.writeUs} message={dict.common.whatsappGreeting} />
          <QuoteDrawer
            lang={lang}
            t={dict.products.quote}
            forms={dict.forms}
            whatsappMessage={dict.common.whatsappGreeting}
          />
        </QuoteProvider>
      </body>
    </html>
  );
}

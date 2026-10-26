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
    keywords: dict.meta.keywords,
    applicationName: site.name,
    authors: [{ name: site.legalName, url: site.url }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "business",
    formatDetection: { telephone: true, email: true, address: true },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // Google Search Console: pegar el código de verificación en Vercel (opcional)
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  // Datos estructurados para Google: negocio local + sitio web
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "HomeAndConstructionBusiness"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        logo: `${site.url}/icon.png`,
        image: `${site.url}/og/es-home.jpg`,
        description: dict.meta.siteDescription,
        telephone: site.phoneDisplay,
        ...(site.email ? { email: site.email } : {}),
        ...(site.ruc ? { taxID: site.ruc } : {}),
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Av. Coronel José Leal 282",
          addressLocality: "Lince",
          addressRegion: "Lima",
          addressCountry: "PE",
        },
        areaServed: { "@type": "Country", name: "Perú" },
        knowsAbout: ["Cortinas roller", "Telas screen", "Telas blackout", "Cortinas dúo", "Motorización de cortinas"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phoneDisplay,
          contactType: "sales",
          areaServed: "PE",
          availableLanguage: ["Spanish", "English"],
        },
        sameAs: Object.values(site.social).filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: lang === "es" ? "es-PE" : "en",
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
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

import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { isLocale, routing } from "@/i18n/routing";
import { site, isSet } from "@/content/site";
import { stack } from "@/content/stack";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { Preloader } from "@/components/layout/preloader";
import { Nav } from "@/components/layout/nav";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { Footer } from "@/components/layout/footer";
import { PaletteLoader } from "@/components/layout/palette-loader";
import { Cursor } from "@/components/layout/cursor";
import { Toaster } from "@/components/ui/toaster";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations({ locale: isLocale(locale) ? locale : "en", namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s · ${site.name}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", bg: "/bg", "x-default": "/en" },
    },
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      locale: locale === "bg" ? "bg_BG" : "en_GB",
      alternateLocale: locale === "bg" ? ["en_GB"] : ["bg_BG"],
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

/**
 * Runs before first paint. Decides whether the boot sequence plays:
 * first visit in this tab + motion allowed → preloader + ruled-grid draw-in.
 * Otherwise content is static and readable immediately.
 */
const bootScript = `(function(){var d=document.documentElement;var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}var seen=false;try{seen=sessionStorage.getItem('ag:booted')==='1'}catch(e){}if(!seen&&!rm){d.classList.add('is-booting','is-ruling')}else{d.classList.add('is-booted','is-ruled')}})();`;

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "nav" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        url: site.url,
        jobTitle: "AI & Automation Developer",
        description: "AI & automation developer and founder of AGility, studying AI programming at VSCPI Burgas.",
        ...(isSet(site.email) ? { email: `mailto:${site.email}` } : {}),
        address: { "@type": "PostalAddress", addressLocality: "Burgas", addressCountry: "BG" },
        affiliation: {
          "@type": "EducationalOrganization",
          name: "Vocational School of Computer Programming and Innovation (VSCPI), Burgas",
        },
        worksFor: { "@id": `${site.url}/#agility` },
        founder: { "@id": `${site.url}/#agility` },
        knowsAbout: stack,
        knowsLanguage: ["bg", "en"],
        sameAs: [site.socials.github, site.socials.linkedin],
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#agility`,
        name: "AGility",
        url: site.agencyUrl,
        description: "AI automation agency: chatbots, AI assistants, enquiry and lead automation, internal tools and AI data analysis.",
        founder: { "@id": `${site.url}/#person` },
        areaServed: ["BG", "EU"],
      },
    ],
  };

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only-focusable t-mono fixed left-4 top-4 z-[80] rounded-[2px] bg-accent px-3 py-2 text-bg"
          >
            {t("skip")}
          </a>
          <RuledGrid />
          <Preloader />
          <SmoothScroll>
            <Suspense fallback={null}>
              <Nav />
            </Suspense>
            {children}
            <Footer />
            <Suspense fallback={null}>
              <PaletteLoader />
            </Suspense>
          </SmoothScroll>
          <RevealObserver />
          <Toaster />
          <Cursor />
          <div className="grain" aria-hidden />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

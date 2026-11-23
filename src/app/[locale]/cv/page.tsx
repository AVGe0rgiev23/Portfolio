import type { Metadata } from "next";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { CvPage } from "@/components/cv/cv-page";

export async function generateMetadata(): Promise<Metadata> {
  const l = await rootLocale();
  const locale = isLocale(l) ? l : "en";
  const t = await getTranslations({ locale, namespace: "cv" });
  return {
    title: t("title"),
    alternates: { canonical: `/${locale}/cv`, languages: { en: "/en/cv", bg: "/bg/cv" } },
  };
}

export default async function Page() {
  const l = await rootLocale();
  return <CvPage locale={isLocale(l) ? l : "en"} variant="standard" />;
}

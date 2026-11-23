import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { site } from "@/content/site";
import { CvSheet } from "./cv-sheet";
import { PrintButton } from "./print-button";

export async function CvPage({ locale, variant }: { locale: AppLocale; variant: "standard" | "europass" }) {
  const t = await getTranslations("cv");
  return (
    <main id="main" className="frame pb-24 pt-[calc(var(--nav-h)+40px)]">
      <div className="no-print mx-auto mb-8 flex max-w-[820px] flex-wrap items-center justify-between gap-4">
        <Link href="/" className="t-mono text-muted hover:text-text">
          ← {t("back")}
        </Link>
        <div className="t-mono flex flex-wrap items-center gap-3">
          <Link
            href={variant === "europass" ? "/cv" : "/cv/europass"}
            className="text-muted underline decoration-line-strong underline-offset-[6px] hover:text-text"
          >
            {variant === "europass" ? t("title") : t("europassTitle")}
          </Link>
          <PrintButton label={t("print")} />
          <a href={site.cv} download className="inline-flex h-10 items-center rounded-[2px] bg-text px-4 text-bg hover:bg-white">
            {t("download")} ↓
          </a>
        </div>
      </div>
      <CvSheet locale={locale} variant={variant} />
    </main>
  );
}

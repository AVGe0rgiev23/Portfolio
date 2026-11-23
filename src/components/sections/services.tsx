import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { services } from "@/content/services";
import { site, isSet } from "@/content/site";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { SHOW_PLACEHOLDERS, filled } from "@/content/types";
import { Spotlight } from "@/components/ui/spotlight";
import { ProcessRail } from "./process-rail";

/** 04 — Services (AGility), with the process as a short horizontal run. */
export async function Services() {
  const t = await getTranslations("services");
  const raw = await getLocale();
  const locale = isLocale(raw) ? raw : "en";
  const book = isSet(site.calLink) ? site.calLink : "#contact";

  return (
    <section id="services" data-island="services" aria-labelledby="services-title" className="py-24 md:py-40">
      <div className="frame">
        <SectionHead
          id="services-title"
          n="04"
          label={t("index")}
          meta={t("meta")}
          title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
          lede={t("lede")}
        />

        <Spotlight className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-line bg-line md:mt-24 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="spot group relative flex flex-col gap-8 bg-bg p-6 md:p-10"
              data-reveal="fade"
              style={{ ["--d" as string]: i }}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="t-mono text-faint transition-colors duration-500 group-hover:text-accent">0{i + 1}</span>
                <span className="t-mono text-right text-[10.5px] text-faint">{s.tech}</span>
              </div>
              <div>
                <h3 className="t-h3">{s.title[locale]}</h3>
                <p className="mt-5 font-serif text-[1.35rem] italic leading-snug text-muted">“{s.problem[locale]}”</p>
              </div>
              <dl className="mt-auto grid gap-4 border-t border-line pt-6 text-[15px] leading-relaxed sm:grid-cols-[8rem_1fr]">
                <dt className="t-mono pt-[3px] text-faint">{t("build")}</dt>
                <dd className="text-text/85">{s.build[locale]}</dd>
                {(SHOW_PLACEHOLDERS || filled(s.result[locale])) && (
                  <>
                    <dt className="t-mono pt-[3px] text-faint">{t("result")}</dt>
                    <dd>
                      <PlaceholderText>{s.result[locale]}</PlaceholderText>
                    </dd>
                  </>
                )}
              </dl>
            </article>
          ))}
        </Spotlight>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={book}
            {...(isSet(site.calLink) ? { target: "_blank", rel: "noreferrer" } : {})}
            className="t-mono inline-flex h-12 items-center gap-3 rounded-[2px] bg-accent px-5 text-bg transition-[filter] hover:brightness-110"
          >
            {t("book")} →
          </a>
          <a
            href={site.agencyUrl}
            target="_blank"
            rel="noreferrer"
            className="t-mono inline-flex h-12 items-center gap-3 rounded-[2px] border border-line-strong px-5 text-text transition-colors hover:border-text/50"
          >
            {t("visit")} ↗
          </a>
        </div>

        <p className="t-mono mb-8 mt-24 text-muted md:mt-32">{t("processLabel")}</p>
      </div>
      <div className="frame">
        <ProcessRail steps={t.raw("steps")} />
      </div>
    </section>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { services } from "@/content/services";
import { site, isSet } from "@/content/site";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { SHOW_PLACEHOLDERS, filled } from "@/content/types";
import { Spotlight } from "@/components/ui/spotlight";

/** 03 — AGility: the four services in one line each, and the way in. */
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
          n="03"
          label={t("index")}
          meta={t("meta")}
          title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
          lede={t("lede")}
        />

        <Spotlight className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-line bg-line md:mt-24 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="spot group relative flex flex-col gap-6 bg-bg p-6 md:p-8"
              data-reveal="fade"
              style={{ ["--d" as string]: i }}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="t-mono text-faint transition-colors duration-500 group-hover:text-accent">0{i + 1}</span>
                <span className="t-mono text-right text-[10.5px] text-faint">{s.tech}</span>
              </div>
              <div>
                <h3 className="t-h3">{s.title[locale]}</h3>
                <p className="mt-4 font-serif text-[1.35rem] italic leading-snug text-muted">“{s.problem[locale]}”</p>
              </div>
              {/* Results come back automatically once a service has a true number from a real client. */}
              {(SHOW_PLACEHOLDERS || filled(s.result[locale])) && (
                <p className="t-mono mt-auto border-t border-line pt-5 text-[11px] text-text/85">
                  <span className="text-faint">{t("result")} · </span>
                  <PlaceholderText>{s.result[locale]}</PlaceholderText>
                </p>
              )}
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
      </div>
    </section>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { school, languages, certificates, type Cefr } from "@/content/education";
import { milestones } from "@/content/milestones";
import { SHOW_PLACEHOLDERS, filled, isPlaceholder } from "@/content/types";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { Chips } from "./work-ledger";
import { PathTimeline } from "./path-timeline";

const LEVELS: Cefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function CefrScale({ level, nativeLabel }: { level: string; nativeLabel: string }) {
  if (isPlaceholder(level)) return SHOW_PLACEHOLDERS ? <PlaceholderText>{level}</PlaceholderText> : null;
  const native = level === "native";
  const idx = native ? LEVELS.length - 1 : LEVELS.indexOf(level as Cefr);
  return (
    <span className="flex items-center gap-3">
      <span className="cefr w-28" aria-hidden>
        {LEVELS.map((l, i) => (
          <span key={l} data-on={i <= idx ? "1" : "0"} />
        ))}
      </span>
      <span className="t-mono text-text">{native ? nativeLabel : level}</span>
    </span>
  );
}

const keep = (s: string) => SHOW_PLACEHOLDERS || filled(s);

/**
 * 03 — Education. School, languages, certificates and the path so far.
 * Written for everyone (recruiters, clients, school, programmes): no audience labels, no grades.
 */
export async function Studies() {
  const t = await getTranslations("studies");
  const raw = await getLocale();
  const locale = isLocale(raw) ? raw : "en";

  const rows: [string, React.ReactNode][] = [
    [
      t("rows.school"),
      <span key="s">
        {school.name[locale]}
        <span className="mt-1 block text-[13px] text-muted">{school.full[locale]}</span>
      </span>,
    ],
    [t("rows.specialty"), school.specialty[locale]],
    ...(keep(school.klass[locale]) ? ([[t("rows.klass"), <PlaceholderText key="k">{school.klass[locale]}</PlaceholderText>]] as [string, React.ReactNode][]) : []),
    ...(keep(school.years) ? ([[t("rows.years"), <PlaceholderText key="y">{school.years}</PlaceholderText>]] as [string, React.ReactNode][]) : []),
    [t("rows.modules"), <Chips key="m" items={school.modules} />],
  ];
  const langs = languages.filter((l) => keep(l.name[locale]));
  const certs = certificates.filter((c) => keep(c[locale]));

  return (
    <section id="studies" data-island="studies" aria-labelledby="studies-title" className="frame py-24 md:py-40">
      <SectionHead
        id="studies-title"
        n="03"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
        lede={t("lede")}
      />

      <div className="grid-12 mt-16 gap-y-12 md:mt-24">
        <div className="card col-span-4 bg-sunken md:col-span-8" data-reveal="fade">
          <div className="t-mono flex items-center justify-between border-b border-line px-5 py-3 text-[10.5px] text-muted">
            <span>{t("record")}</span>
            <span className="text-faint">{t("recordNo")}</span>
          </div>
          <dl className="px-5">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-dashed border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="t-mono pt-[3px] text-faint">{k}</dt>
                <dd className="text-[15px] leading-snug text-text/90">{v}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1 border-b border-dashed border-line py-4 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="t-mono pt-[3px] text-faint">{t("rows.languages")}</dt>
              <dd className="flex flex-col gap-3">
                {langs.map((l) => (
                  <div key={l.name.en} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                    <span className="text-[15px] text-text/90">
                      <PlaceholderText>{l.name[locale]}</PlaceholderText>
                    </span>
                    <CefrScale level={l.level} nativeLabel={t("native")} />
                    {l.note && keep(l.note[locale]) && (
                      <span className="w-full text-[13px] text-muted">
                        <PlaceholderText>{l.note[locale]}</PlaceholderText>
                      </span>
                    )}
                  </div>
                ))}
              </dd>
            </div>
            {certs.length > 0 && (
              <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="t-mono pt-[3px] text-faint">{t("rows.certificates")}</dt>
                <dd className="flex flex-col gap-1 text-[15px] text-text/90">
                  {certs.map((c) => (
                    <span key={c.en}>
                      <PlaceholderText>{c[locale]}</PlaceholderText>
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Documents */}
        <aside className="col-span-4 flex flex-col md:col-span-3 md:col-start-10" aria-labelledby="docs-title">
          <h3 id="docs-title" className="t-mono mb-6 text-muted">
            {t("docs.label")}
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={site.cv}
              download
              className="t-mono group inline-flex h-11 items-center justify-between rounded-[2px] border border-line-strong px-4 text-text transition-colors hover:border-text/50"
            >
              {t("docs.cv")}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <Link
              href="/cv/europass"
              className="t-mono group inline-flex h-11 items-center justify-between rounded-[2px] border border-line-strong px-4 text-text transition-colors hover:border-text/50"
            >
              {t("docs.europass")}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
            {keep(t("docs.refs")) && (
              <p className="mt-2 text-[13px] text-muted">
                <PlaceholderText>{t("docs.refs")}</PlaceholderText>
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* The path so far */}
      <div className="mt-24 md:mt-36">
        <p className="t-mono mb-10 text-muted md:mb-14">{t("pathLabel")}</p>
        <PathTimeline
          nowLabel={t("now")}
          entries={milestones.map((m) => ({ date: m.date, title: m.title[locale], line: m.line[locale], next: m.next }))}
        />
      </div>
    </section>
  );
}

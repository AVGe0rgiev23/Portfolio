import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { school, languages, certificates, type Cefr } from "@/content/education";
import { milestones } from "@/content/milestones";
import { isPlaceholder } from "@/content/types";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { Chips } from "./work-ledger";
import { PathTimeline } from "./path-timeline";

const LEVELS: Cefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function CefrScale({ level, nativeLabel }: { level: string; nativeLabel: string }) {
  if (isPlaceholder(level)) return <PlaceholderText>{level}</PlaceholderText>;
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

/** 04 — Studies. For the school, Erasmus+ committees and universities. No grades, on purpose. */
export async function Studies() {
  const t = await getTranslations("studies");
  const raw = await getLocale();
  const locale = isLocale(raw) ? raw : "en";
  const cards = t.raw("erasmus.cards") as { k: string; v: string }[];

  const rows: [string, React.ReactNode][] = [
    [t("rows.school"), <span key="s">{school.name[locale]}<span className="mt-1 block text-[13px] text-muted">{school.full[locale]}</span></span>],
    [t("rows.specialty"), school.specialty[locale]],
    [t("rows.klass"), <PlaceholderText key="k">{school.klass[locale]}</PlaceholderText>],
    [t("rows.years"), <PlaceholderText key="y">{school.years}</PlaceholderText>],
    [t("rows.modules"), <Chips key="m" items={school.modules} />],
  ];

  return (
    <section id="studies" data-island="studies" aria-labelledby="studies-title" className="frame py-24 md:py-40">
      <SectionHead
        id="studies-title"
        n="04"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
        lede={t("lede")}
      />

      <div className="grid-12 mt-16 gap-y-12 md:mt-24">
        {/* Student file */}
        <div className="card col-span-4 bg-sunken md:col-span-7" data-reveal="fade">
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
            <div className="grid grid-cols-1 gap-1 border-b border-dashed border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="t-mono pt-[3px] text-faint">{t("rows.languages")}</dt>
              <dd className="flex flex-col gap-3">
                {languages.map((l) => (
                  <div key={l.name.en} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                    <span className="text-[15px] text-text/90">
                      <PlaceholderText>{l.name[locale]}</PlaceholderText>
                    </span>
                    <CefrScale level={l.level} nativeLabel={t("native")} />
                    {l.note && (
                      <span className="w-full text-[13px] text-muted">
                        <PlaceholderText>{l.note[locale]}</PlaceholderText>
                      </span>
                    )}
                  </div>
                ))}
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="t-mono pt-[3px] text-faint">{t("rows.certificates")}</dt>
              <dd className="text-[15px] text-text/90">
                {certificates.map((c) => (
                  <PlaceholderText key={c.en}>{c[locale]}</PlaceholderText>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* Erasmus+ */}
        <aside className="col-span-4 flex flex-col md:col-span-4 md:col-start-9" aria-labelledby="erasmus-title">
          <h3 id="erasmus-title" className="t-mono mb-6 text-muted">
            {t("erasmus.label")}
          </h3>
          <ol className="flex flex-col">
            {cards.map((c, i) => (
              <li key={c.k} className="border-t border-line py-5" data-reveal="fade" style={{ ["--d" as string]: i }}>
                <p className="t-mono text-faint">0{i + 1} — {c.k}</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-text/85">
                  <PlaceholderText>{c.v}</PlaceholderText>
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-auto border-t border-line pt-5">
            <p className="t-mono mb-4 text-faint">{t("erasmus.docs")}</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/cv/europass"
                className="t-mono group inline-flex h-11 items-center justify-between rounded-[2px] border border-line-strong px-4 text-text transition-colors hover:border-text/50"
              >
                {t("erasmus.cv")}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={site.cv}
                download
                className="t-mono inline-flex items-center gap-2 text-[11px] text-muted underline decoration-line-strong underline-offset-[6px] hover:text-text"
              >
                PDF ↓
              </a>
              <p className="text-[13px] text-muted">
                <PlaceholderText>{t("erasmus.refs")}</PlaceholderText>
              </p>
            </div>
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

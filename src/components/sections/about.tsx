import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { school, languages, certificates } from "@/content/education";
import { milestones } from "@/content/milestones";
import { SHOW_PLACEHOLDERS, filled, shown } from "@/content/types";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { StackMonogram } from "./stack-monogram";
import { PathTimeline } from "./path-timeline";

const keep = (s: string) => SHOW_PLACEHOLDERS || filled(s);

type Row = { k: string; v: string };

function RowList({ title, rows, delay = 0 }: { title: string; rows: Row[]; delay?: number }) {
  return (
    <div data-reveal="fade" style={{ ["--d" as string]: delay }}>
      <h3 className="t-mono mb-5 text-muted">{title}</h3>
      <dl className="border-t border-line">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-3.5">
            <dt className="t-mono pt-[3px] text-faint">{r.k}</dt>
            <dd className="text-[15.5px] leading-snug text-text/90">
              <PlaceholderText>{r.v}</PlaceholderText>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * 02 — About: who I am, where I study, what I'm doing now, where I'm heading, and the path so far.
 * Written for everyone (recruiters, clients, schools): no audience labels, no grades.
 */
export async function About() {
  const t = await getTranslations("about");
  const raw = await getLocale();
  const locale = isLocale(raw) ? raw : "en";

  const now = (t.raw("now") as Row[]).filter((r) => keep(r.v));
  const next = (t.raw("next") as Row[]).filter((r) => keep(r.v));

  // One-line education + languages, built from content/education.ts. Unfilled parts drop out.
  const eduLine = [school.name[locale], school.specialty[locale], school.klass[locale], school.years].filter(keep);
  const langLine = languages
    .filter((l) => keep(l.name[locale]))
    .map((l) => {
      const level = l.level === "native" ? t("edu.native") : shown(l.level);
      return [shown(l.name[locale]), level].filter(Boolean).join(" ");
    });
  const certs = certificates.map((c) => c[locale]).filter(keep);

  return (
    <section id="about" data-island="about" aria-labelledby="about-title" className="frame py-24 md:py-40">
      <SectionHead
        id="about-title"
        n="02"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
      />

      <div className="grid-12 mt-16 gap-y-14 md:mt-24">
        <div className="col-span-4 md:col-span-5" data-reveal="fade">
          <StackMonogram />
        </div>
        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <div className="flex flex-col gap-6">
            {(t.raw("paras") as string[]).map((p, i) => (
              <p
                key={p}
                className={
                  i === 0
                    ? "max-w-[30ch] font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.2] tracking-[-0.01em]"
                    : "max-w-[58ch] text-[17px] leading-relaxed text-text/80"
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Education, compact. The full record lives in the CVs. */}
          <dl className="mt-10 border-t border-line text-[15px]">
            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-dashed border-line py-3.5">
              <dt className="t-mono pt-[3px] text-faint">{t("edu.education")}</dt>
              <dd className="leading-snug text-text/90">
                {eduLine.map((part, i) => (
                  <span key={part}>
                    {i > 0 && <span className="text-faint"> · </span>}
                    <PlaceholderText>{part}</PlaceholderText>
                  </span>
                ))}
              </dd>
            </div>
            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-dashed border-line py-3.5">
              <dt className="t-mono pt-[3px] text-faint">{t("edu.languages")}</dt>
              <dd className="leading-snug text-text/90">
                {langLine.map((l, i) => (
                  <span key={l}>
                    {i > 0 && <span className="text-faint"> · </span>}
                    <PlaceholderText>{l}</PlaceholderText>
                  </span>
                ))}
              </dd>
            </div>
            {certs.length > 0 && (
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-dashed border-line py-3.5">
                <dt className="t-mono pt-[3px] text-faint">{t("edu.certificates")}</dt>
                <dd className="leading-snug text-text/90">
                  {certs.map((c) => (
                    <span key={c} className="block">
                      <PlaceholderText>{c}</PlaceholderText>
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <p className="t-mono mt-5 flex flex-wrap gap-x-6 gap-y-2 text-muted">
            <a
              href={site.cv}
              download
              className="underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-text hover:decoration-accent"
            >
              {t("edu.cv")} ↓
            </a>
            <Link
              href="/cv/europass"
              className="underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-text hover:decoration-accent"
            >
              {t("edu.europass")} →
            </Link>
          </p>
        </div>
      </div>

      <p
        className="mt-24 max-w-[24ch] font-serif text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[1] tracking-[-0.025em] md:mt-32"
        data-reveal="fade"
      >
        {t.rich("both", { em: (c) => <em className="em">{c}</em> })}
      </p>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-16">
        <RowList title={t("nowK")} rows={now} />
        <RowList title={t("nextK")} rows={next} delay={1} />
      </div>

      <div className="mt-20 md:mt-28">
        <p className="t-mono mb-10 text-muted md:mb-14">{t("pathLabel")}</p>
        <PathTimeline
          nowLabel={t("pathNow")}
          entries={milestones.map((m) => ({ date: m.date, title: m.title[locale], line: m.line[locale], next: m.next }))}
        />
      </div>
    </section>
  );
}

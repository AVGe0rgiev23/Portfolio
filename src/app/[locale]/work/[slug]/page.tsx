import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale, type AppLocale } from "@/i18n/routing";
import { projects, getProject } from "@/content/projects";
import { getCaseStudy } from "@/content/case-studies";
import { isPlaceholder } from "@/content/types";
import { SectionIndex } from "@/components/ui/section-index";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { StatusChip, Chips, Cover } from "@/components/sections/work-ledger";
import { DossierVideo } from "@/components/sections/dossier-video";
import { ArchitectureDiagram } from "@/components/case/architecture-diagram";

/**
 * Every slug is prerendered at build (generateStaticParams) and dossier links prefetch the
 * full page, so the "blocking" navigation is a cache hit. Opting out of instant-shell
 * validation keeps the whole page in one commit, which the shared-element morph needs.
 */
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

async function loc(): Promise<AppLocale> {
  const l = await rootLocale();
  return isLocale(l) ? l : "en";
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  const locale = await loc();
  if (!p) return {};
  return {
    title: p.name[locale],
    description: p.summary[locale].replace(/\[\[[^\]]+\]\]/g, "").trim(),
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { en: `/en/work/${slug}`, bg: `/bg/work/${slug}`, "x-default": `/en/work/${slug}` },
    },
  };
}

function Block({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <section className="grid-12 gap-y-6 border-t border-line pt-8 md:pt-10" data-reveal="fade">
      <h2 className="t-mono col-span-4 text-muted md:col-span-3">
        <span className="text-faint">{n} —</span> {label}
      </h2>
      <div className="col-span-4 md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

function Paras({ items, locale, large = false }: { items: { en: string; bg: string }[]; locale: AppLocale; large?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      {items.map((p, i) => (
        <p
          key={i}
          className={
            large
              ? "font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15] tracking-[-0.015em]"
              : "max-w-[62ch] text-[17px] leading-[1.65] text-text/85"
          }
        >
          <PlaceholderText>{p[locale]}</PlaceholderText>
        </p>
      ))}
    </div>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const locale = await loc();
  const t = await getTranslations("case");
  const tw = await getTranslations("work");
  const study = getCaseStudy(slug);
  const i = projects.findIndex((x) => x.slug === slug);
  const index = String(i + 1).padStart(2, "0");
  const next = projects[(i + 1) % projects.length];
  const nextIndex = String(((i + 1) % projects.length) + 1).padStart(2, "0");
  const live = p.links.live && !isPlaceholder(p.links.live) ? p.links.live : null;
  const code = p.links.code && !isPlaceholder(p.links.code) ? p.links.code : null;
  const hasVideo = Boolean(p.media?.mp4 || p.media?.webm);

  const meta: [string, React.ReactNode][] = [
    [t("meta.role"), p.role[locale]],
    [t("meta.built"), <PlaceholderText key="b">{p.built[locale]}</PlaceholderText>],
    ...(study ? ([[t("meta.timeline"), <PlaceholderText key="t">{study.timeline[locale]}</PlaceholderText>]] as [string, React.ReactNode][]) : []),
    [t("meta.team"), <PlaceholderText key="tm">{p.team[locale]}</PlaceholderText>],
    [t("meta.stack"), <Chips key="s" items={p.stack} />],
    [
      t("meta.links"),
      <span key="l" className="flex flex-wrap gap-x-5 gap-y-2">
        {live && (
          <a href={live} target="_blank" rel="noreferrer" className="underline decoration-accent underline-offset-4 hover:text-accent">
            {t("live")} ↗
          </a>
        )}
        {code && (
          <a href={code} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-text">
            {t("code")} ↗
          </a>
        )}
        {!live && !code && (
          <span className="text-muted">
            {p.links.live || p.links.code ? <PlaceholderText>{p.links.live ?? p.links.code ?? ""}</PlaceholderText> : t("none")}
          </span>
        )}
      </span>,
    ],
  ];

  return (
    <main id="main" className="pt-[calc(var(--nav-h)+40px)]">
      <article className="frame" aria-labelledby="cs-title">
        <Link href="/#work" className="t-mono group inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
          <span aria-hidden className="transition-transform duration-500 group-hover:-translate-x-1">
            ←
          </span>
          {t("back")}
        </Link>

        <SectionIndex n={index} label={t("index")} meta={p.year} className="mt-10" />

        <header className="mt-10 md:mt-14">
          <ViewTransition name={`title-${slug}`} share="morph" default="none">
            <h1 id="cs-title" className="t-display max-w-[14ch]">
              {p.name[locale]}
            </h1>
          </ViewTransition>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <StatusChip status={p.status} label={tw(`status.${p.status}`)} />
            <p className="t-mono text-muted">{p.kind[locale]}</p>
          </div>
        </header>

        <ViewTransition name={`media-${slug}`} share="morph" default="none">
          <div className="mt-12 md:mt-16">
            {hasVideo && p.media ? (
              <DossierVideo webm={p.media.webm} mp4={p.media.mp4} poster={p.media.poster} label={p.media.alt[locale]} />
            ) : (
              <Cover p={p} index={index} pending={tw("mediaMissing")} always className="aspect-[16/10] md:aspect-[16/8]" />
            )}
          </div>
        </ViewTransition>

        {/* Summary + meta table */}
        <div className="grid-12 mt-16 gap-y-12 md:mt-24">
          <div className="col-span-4 md:col-span-7">
            <h2 className="t-mono mb-6 text-faint">{t("summary")}</h2>
            <p className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.12] tracking-[-0.015em]">
              <PlaceholderText>{p.summary[locale]}</PlaceholderText>
            </p>
          </div>
          <dl className="card col-span-4 self-start bg-sunken px-5 md:col-span-4 md:col-start-9">
            {meta.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-dashed border-line py-3.5 last:border-b-0">
                <dt className="t-mono pt-[3px] text-faint">{k}</dt>
                <dd className="text-[14.5px] leading-snug text-text/90">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {study ? (
          <div className="mt-24 flex flex-col gap-20 md:mt-36 md:gap-28">
            <Block n="01" label={t("sections.problem")}>
              <Paras items={study.problem} locale={locale} large />
            </Block>
            <Block n="02" label={t("sections.approach")}>
              <Paras items={study.approach} locale={locale} />
            </Block>
            <section className="border-t border-line pt-8 md:pt-10" data-reveal="fade" aria-labelledby="arch-title">
              <h2 id="arch-title" className="t-mono mb-10 text-muted">
                <span className="text-faint">03 —</span> {t("sections.architecture")}
              </h2>
              <ArchitectureDiagram diagram={study.diagram} locale={locale} />
            </section>
            <Block n="04" label={t("sections.decisions")}>
              <ol className="flex flex-col">
                {study.decisions.map((d, k) => (
                  <li key={k} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-7 first:pt-0">
                    <span className="t-mono pt-2 text-faint">0{k + 1}</span>
                    <div>
                      <h3 className="t-h3">
                        <PlaceholderText>{d.title[locale]}</PlaceholderText>
                      </h3>
                      <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-text/80">
                        <PlaceholderText>{d.body[locale]}</PlaceholderText>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
            <Block n="05" label={t("sections.result")}>
              <Paras items={study.result} locale={locale} large />
            </Block>
            <Block n="06" label={t("sections.next")}>
              <Paras items={study.next} locale={locale} />
            </Block>
          </div>
        ) : (
          <div className="card mt-20 bg-sunken p-6 md:mt-28 md:p-10" data-reveal="fade">
            <p className="max-w-[60ch] text-[17px] leading-relaxed text-text/85">{t("pending")}</p>
            <p className="mt-4">
              <PlaceholderText>{t("pendingPh")}</PlaceholderText>
            </p>
          </div>
        )}
      </article>

      {/* Next project */}
      <nav aria-label={t("nextProject")} className="mt-28 border-t border-line md:mt-40">
        <Link href={`/work/${next.slug}`} prefetch className="next-project group block">
          <div className="frame relative flex flex-col gap-6 py-16 md:py-24">
            <span className="t-mono flex items-center gap-4 text-muted">
              <span className="text-faint">{nextIndex}</span> {t("nextProject")}
              <span className="h-px flex-1 bg-line" aria-hidden />
            </span>
            <span className="flex items-end justify-between gap-8">
              <ViewTransition name={`title-${next.slug}`} share="morph" default="none">
                <span className="t-display block transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-3">
                  {next.name[locale]}
                </span>
              </ViewTransition>
              <span
                className="t-display hidden text-faint transition-[color,transform] duration-700 ease-[var(--ease-out)] group-hover:translate-x-2 group-hover:text-accent md:block"
                aria-hidden
              >
                →
              </span>
            </span>
            <span className="next-project__preview pointer-events-none absolute right-[var(--page-pad)] top-1/2 hidden w-[26vw] max-w-[380px] -translate-y-1/2 md:block">
              <Cover p={next} index={nextIndex} pending={tw("mediaMissing")} />
            </span>
          </div>
        </Link>
      </nav>
    </main>
  );
}

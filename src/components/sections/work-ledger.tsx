import { ViewTransition } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { visibleProjects as projects, type Project, type ProjectStatus } from "@/content/projects";
import { SHOW_PLACEHOLDERS, filled, isPlaceholder } from "@/content/types";
import { isLocale } from "@/i18n/routing";
import { site } from "@/content/site";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { DossierVideo } from "./dossier-video";
import { DataTrail } from "./data-trail";
import { cn } from "@/lib/cn";

export function StatusChip({ status, label, className }: { status: ProjectStatus; label: string; className?: string }) {
  const live = status === "live" || status === "production";
  return (
    <span
      className={cn(
        "t-mono inline-flex h-6 items-center gap-2 whitespace-nowrap rounded-full border px-2.5 text-[10.5px]",
        live ? "border-accent/40 text-text" : "border-line-strong text-muted",
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", live ? "bg-accent shadow-[0_0_6px_rgba(255,90,31,.8)]" : "border border-muted")}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.filter(filled).map((s) => (
        <li key={s} className="t-mono rounded-[2px] border border-line px-1.5 py-0.5 text-[10px] text-muted">
          <PlaceholderText>{s}</PlaceholderText>
        </li>
      ))}
    </ul>
  );
}

export function Cover({
  p,
  index,
  pending,
  always = false,
  className,
}: {
  p: Project;
  index: string;
  pending: string;
  /** Show on touch devices too (case-study pages). */
  always?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[2px] border border-line bg-sunken",
        !always && "dossier__cover",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(237,232,223,.09) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden
      />
      <span
        className="absolute -bottom-[0.18em] right-3 font-serif text-[clamp(6rem,11vw,10rem)] leading-none tracking-[-0.04em] text-text/[0.06]"
        aria-hidden
      >
        {index}
      </span>
      <div className="t-mono absolute left-4 top-4 flex flex-col gap-2 text-[10px] text-faint">
        {SHOW_PLACEHOLDERS ? (
          <>
            <span>{pending}</span>
            <PlaceholderText>{`[[MEDIA: /public/work/${p.slug}.mp4 + .webm + poster]]`}</PlaceholderText>
          </>
        ) : (
          <span>{p.name.en}</span>
        )}
      </div>
    </div>
  );
}

const linkOf = (url?: string) => (url && !isPlaceholder(url) ? url : null);

export async function WorkLedger() {
  const t = await getTranslations("work");
  const raw = await getLocale();
  const locale = isLocale(raw) ? raw : "en";
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section
      id="work"
      data-island="work"
      aria-labelledby="work-title"
      className="relative py-24 md:py-40"
    >
      <DataTrail />
      <div className="frame">
        <SectionHead
          id="work-title"
          n="01"
          label={t("index")}
          meta={t("meta")}
          title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
          lede={t("lede")}
        />

        {/* Column header (desktop) */}
        <div className="t-mono mt-20 hidden border-b border-line pb-3 text-faint md:grid md:grid-cols-12 md:gap-x-6">
          <span className="col-span-1">№</span>
          <span className="col-span-4">{t("cols.project")}</span>
          <span className="col-span-3">{t("cols.type")}</span>
          <span className="col-span-1">{t("cols.year")}</span>
          <span className="col-span-2">{t("cols.stack")}</span>
          <span className="col-span-1 text-right">{t("cols.status")}</span>
        </div>

        <ol className="dossier-list mt-10 border-t border-line md:mt-0 md:border-t-0">
          {featured.map((p, i) => {
            const index = String(i + 1).padStart(2, "0");
            const name = p.name[locale];
            const live = linkOf(p.links.live);
            const code = linkOf(p.links.code);
            const hasVideo = Boolean(p.media?.mp4 || p.media?.webm);
            return (
              <li key={p.slug} className="dossier group relative border-b border-line">
                <article aria-labelledby={`p-${p.slug}`}>
                  {/* Head row */}
                  <div className="grid grid-cols-4 items-start gap-x-4 gap-y-3 py-6 md:grid-cols-12 md:items-baseline md:gap-x-6 md:py-7">
                    <span className="t-mono col-span-2 text-faint transition-colors duration-500 group-hover:text-accent md:col-span-1">
                      {index}
                    </span>
                    <StatusChip
                      status={p.status}
                      label={t(`status.${p.status}`)}
                      className="col-span-2 justify-self-end md:hidden"
                    />
                    <h3
                      id={`p-${p.slug}`}
                      className="col-span-4 font-serif text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.95] tracking-[-0.025em] md:col-span-4"
                    >
                      <Link
                        href={`/work/${p.slug}`}
                        prefetch
                        className="dossier__link block w-fit transition-transform duration-700 ease-[var(--ease-out)] after:absolute after:inset-0 after:content-[''] group-hover:translate-x-2"
                      >
                        <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
                          <span className="inline-block">{name}</span>
                        </ViewTransition>
                      </Link>
                    </h3>
                    <div className="col-span-4 flex flex-col gap-2.5 md:col-span-3 md:pr-4">
                      <p className="t-mono text-[10.5px] text-muted">{p.kind[locale]}</p>
                      {(live || code) && (
                        <p className="t-mono relative z-10 flex gap-4 text-[10.5px]">
                          {live && (
                            <a href={live} target="_blank" rel="noreferrer" className="text-text underline decoration-accent underline-offset-4 hover:text-accent">
                              {t("live")} ↗
                            </a>
                          )}
                          {code && (
                            <a href={code} target="_blank" rel="noreferrer" className="text-muted underline decoration-line-strong underline-offset-4 hover:text-text">
                              {t("code")} ↗
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                    <span className="t-mono col-span-1 hidden text-muted md:block">
                      <PlaceholderText>{p.year}</PlaceholderText>
                    </span>
                    <div className="col-span-4 md:col-span-2">
                      <Chips items={p.stack} />
                    </div>
                    <div className="hidden justify-self-end md:col-span-1 md:block">
                      <StatusChip status={p.status} label={t(`status.${p.status}`)} />
                    </div>
                  </div>

                  {/* Expanding body */}
                  <div className="dossier__body grid">
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid grid-cols-4 gap-x-4 gap-y-8 pb-10 md:grid-cols-12 md:gap-x-6 md:pb-14">
                        <div className="dossier__media col-span-4 md:col-span-5 md:col-start-2">
                          {hasVideo && p.media ? (
                            <DossierVideo
                              webm={p.media.webm}
                              mp4={p.media.mp4}
                              poster={p.media.poster}
                              label={p.media.alt[locale]}
                            />
                          ) : (
                            <ViewTransition name={`media-${p.slug}`} share="morph" default="none">
                              <Cover p={p} index={index} pending={t("mediaMissing")} />
                            </ViewTransition>
                          )}
                        </div>
                        <div className="col-span-4 flex flex-col gap-6 md:col-span-5 md:col-start-8">
                          <p className="text-[16px] leading-relaxed text-text/90">
                            <PlaceholderText>{p.summary[locale]}</PlaceholderText>
                          </p>
                          <dl className="grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2.5 border-t border-line pt-5 text-[14.5px] leading-snug">
                            <dt className="t-mono pt-[3px] text-faint">{t("role")}</dt>
                            <dd className="text-text/90">{p.role[locale]}</dd>
                            {(SHOW_PLACEHOLDERS || filled(p.built[locale])) && (
                              <>
                                <dt className="t-mono pt-[3px] text-faint">{t("built")}</dt>
                                <dd className="text-text/90">
                                  <PlaceholderText>{p.built[locale]}</PlaceholderText>
                                </dd>
                              </>
                            )}
                            <dt className="t-mono pt-[3px] text-faint">{t("team")}</dt>
                            <dd className="text-text/90">
                              <PlaceholderText>{p.team[locale]}</PlaceholderText>
                            </dd>
                          </dl>
                          <div className="t-mono relative z-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px]">
                            <Link
                              href={`/work/${p.slug}`}
                              className="text-text underline decoration-accent decoration-1 underline-offset-[6px] hover:text-accent"
                            >
                              {p.caseStudy ? t("caseStudy") : t("open")} →
                            </Link>
                            {live ? (
                              <a href={live} target="_blank" rel="noreferrer" className="text-muted hover:text-text">
                                {t("live")} ↗
                              </a>
                            ) : p.links.live && SHOW_PLACEHOLDERS ? (
                              <span className="text-faint">
                                {t("live")} <PlaceholderText>{p.links.live}</PlaceholderText>
                              </span>
                            ) : null}
                            {code ? (
                              <a href={code} target="_blank" rel="noreferrer" className="text-muted hover:text-text">
                                {t("code")} ↗
                              </a>
                            ) : p.links.code && SHOW_PLACEHOLDERS ? (
                              <span className="text-faint">
                                {t("code")} <PlaceholderText>{p.links.code}</PlaceholderText>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        {more.length > 0 && (
          <div className="mt-16 md:mt-24">
            <p className="t-mono mb-4 text-muted">{t("more")}</p>
            <ul className="border-t border-line">
              {more.map((p) => {
                const live = linkOf(p.links.live);
                const code = linkOf(p.links.code);
                return (
                  <li
                    key={p.slug}
                    className="group relative grid grid-cols-4 items-baseline gap-x-4 gap-y-1.5 border-b border-line py-4 md:grid-cols-12 md:gap-x-6"
                  >
                    <h3 className="col-span-4 font-serif text-[clamp(1.35rem,2vw,1.75rem)] leading-tight tracking-[-0.015em] md:col-span-4 md:col-start-2">
                      <Link
                        href={`/work/${p.slug}`}
                        className="inline-block transition-transform duration-500 ease-[var(--ease-out)] after:absolute after:inset-0 after:content-[''] group-hover:translate-x-1.5"
                      >
                        {p.name[locale]}
                      </Link>
                    </h3>
                    <p className="t-mono col-span-4 text-[10.5px] text-muted md:col-span-4">{p.kind[locale]}</p>
                    <p className="t-mono relative z-10 col-span-2 flex gap-4 text-[10.5px] md:col-span-2">
                      {live && (
                        <a href={live} target="_blank" rel="noreferrer" className="text-text hover:text-accent">
                          {t("live")} ↗
                        </a>
                      )}
                      {code && (
                        <a href={code} target="_blank" rel="noreferrer" className="text-muted hover:text-text">
                          {t("code")} ↗
                        </a>
                      )}
                    </p>
                    <span className="col-span-2 justify-self-end md:col-span-1">
                      <StatusChip status={p.status} label={t(`status.${p.status}`)} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <a
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="group mt-14 flex items-baseline justify-between gap-6 border-b border-line pb-5 md:mt-20"
        >
          <span className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-none tracking-[-0.02em]">
            {t("all")} <span className="italic text-muted transition-colors group-hover:text-text">{t("allOn")}</span>
          </span>
          <span className="t-mono text-muted transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-accent">
            github.com/AVGe0rgiev23 ↗
          </span>
        </a>
      </div>
    </section>
  );
}

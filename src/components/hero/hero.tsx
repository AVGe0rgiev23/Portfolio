import { getTranslations } from "next-intl/server";
import { SignalPoster } from "./signal-poster";
import { DESKTOP, MOBILE, type FieldLayout } from "./field-layout";
import { RoleMorph } from "./role-morph";
import { Portrait } from "./portrait";
import { SignalCanvas } from "@/components/three/signal-canvas";
import { LocalTime } from "@/components/ui/local-time";
import { site } from "@/content/site";

function ChannelLabels({ layout, names, className }: { layout: FieldLayout; names: string[]; className: string }) {
  return (
    <div className={className} aria-hidden>
      {layout.clusters.map(([x, y], i) => (
        <span
          key={names[i]}
          className="t-mono absolute -translate-y-1/2 whitespace-nowrap rounded-[2px] border border-line bg-bg/75 px-1.5 py-0.5 text-[10px] text-muted backdrop-blur-[2px]"
          // Labels near the left edge anchor from their start so they never clip.
          style={{ left: x < 0.2 ? `max(6px, calc(${x * 100}% - 2.5rem))` : `${x * 100}%`, top: `${y * 100}%`, translate: x < 0.2 ? "0 0" : "-50% 0" }}
        >
          {names[i]}
        </span>
      ))}
    </div>
  );
}

/** 00 — Introduction. Who Alex is, first. What he does comes right after. */
export async function Hero() {
  const t = await getTranslations("hero");
  const roles = t.raw("roles") as string[];
  const channels = t.raw("channels") as string[];

  return (
    <section
      id="top"
      data-island="hero"
      aria-labelledby="hero-title"
      className="field relative isolate flex min-h-[max(660px,100svh)] flex-col overflow-hidden"
    >
      {/* Signal Field: poster first, live canvas fades in over it after idle */}
      <div className="absolute inset-0 -z-10">
        <SignalPoster />
        <SignalCanvas />
        <ChannelLabels layout={DESKTOP} names={channels} className="absolute inset-0 hidden md:block" />
        <ChannelLabels layout={MOBILE} names={channels} className="absolute inset-0 md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-bg via-bg/85 to-transparent" />
      </div>

      <div className="frame relative flex flex-1 flex-col pt-[var(--nav-h)]">
        {/* Portrait: the line from the field lands on it */}
        <div className="absolute right-[var(--page-pad)] top-[calc(var(--nav-h)+20px)] w-[34vw] max-w-[150px] md:top-[calc(var(--nav-h)+4svh)] md:w-[24%] md:max-w-[330px]">
          <Portrait alt={t("portraitAlt")} fig={t("fig")} priority />
        </div>

        <div className="grid-12 mt-auto pt-[28svh] md:pt-[20svh]">
          <div className="col-span-4 md:col-span-9 lg:col-span-8">
            <div className="fade-boot mb-6 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ ["--d" as string]: 0 }}>
              <p className="t-mono inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-bg/60 py-1.5 pl-3 pr-3.5 text-text backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,90,31,.8)]" aria-hidden />
                <span className="sm:hidden">{t("openToShort")}</span>
                <span className="hidden sm:inline">{t("openTo")}</span>
              </p>
              <p className="t-mono hidden text-muted xl:block">
                <span className="text-faint">[</span> 00 — {t("index")} <span className="text-faint">]</span>
              </p>
            </div>

            <h1 id="hero-title" className="font-serif">
              <span className="reveal hero-hi" style={{ ["--d" as string]: 0 }}>
                <span className="italic text-muted">{t("hi")}</span>
              </span>
              <span className="reveal hero-name" style={{ ["--d" as string]: 1 }}>
                <span>{t("name")}</span>
              </span>
            </h1>

            <p className="fade-boot t-lede mt-6 max-w-[46ch] text-text/80 md:mt-8" style={{ ["--d" as string]: 2 }}>
              {t("intro")}
            </p>

            <p
              className="fade-boot mt-6 flex items-baseline gap-3 font-serif text-[clamp(1.4rem,2.2vw,2rem)] leading-none tracking-[-0.02em]"
              style={{ ["--d" as string]: 3 }}
            >
              <span className="t-mono shrink-0 translate-y-[-0.3em] text-faint">{t("rolesLabel")} —</span>
              <span className="italic">
                <RoleMorph roles={roles} />
              </span>
            </p>

            <div className="fade-boot mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: 4 }}>
              <a
                href="#what"
                className="t-mono group inline-flex h-12 items-center gap-3 rounded-[2px] bg-text px-5 text-bg transition-colors hover:bg-white"
              >
                {t("ctaWhat")}
                <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a
                href="#work"
                className="t-mono group inline-flex h-12 items-center gap-3 rounded-[2px] border border-line-strong px-5 text-text transition-colors hover:border-text/50"
              >
                {t("ctaWork")}
                <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href={site.cv}
                download
                className="t-mono inline-flex h-12 items-center gap-2 px-3 text-muted underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-text hover:decoration-accent"
              >
                {t("ctaCv")} ↓
              </a>
            </div>
          </div>
        </div>

        <div
          className="fade-boot t-mono mt-10 flex items-center justify-between gap-6 border-t border-line py-4 text-muted md:mt-12"
          style={{ ["--d" as string]: 5 }}
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
            <li>{t("based")}</li>
            <li>
              {t("time")} <LocalTime className="tabular-nums text-text" />
            </li>
            <li className="hidden sm:list-item">{t("open")}</li>
            <li className="hidden md:list-item">{t("founder")}</li>
          </ul>
          <a href="#what" aria-label={t("scroll")} className="group flex shrink-0 items-center gap-3 text-faint transition-colors hover:text-text">
            <span className="hidden sm:inline">{t("scroll")}</span>
            <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-line-strong" aria-hidden>
              <span className="absolute left-1/2 top-0 size-[3px] -translate-x-1/2 rounded-full bg-accent" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

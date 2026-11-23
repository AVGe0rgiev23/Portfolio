import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { LocalTime } from "@/components/ui/local-time";
import { FooterActions } from "./footer-actions";

const sha = (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7) || "local";

/** A mono "system readout": who, where, what time it is in Burgas, which build. */
export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="site-footer relative border-t border-line">
      <div className="frame flex flex-col gap-10 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="font-serif text-[clamp(3rem,9vw,8rem)] italic leading-[0.85] tracking-[-0.04em] text-text/90">
            Alex Georgiev<span className="text-accent">.</span>
          </p>
          <FooterActions labels={{ top: t("top"), palette: t("palette") }} />
        </div>
        <div className="t-mono flex flex-col gap-4 border-t border-line pt-6 text-[11px] text-muted md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© 2026 {site.name}</span>
            <span className="text-faint">·</span>
            <span>{site.agency}</span>
            <span className="text-faint">·</span>
            <span>
              {site.city} <LocalTime className="tabular-nums text-text" />
            </span>
            <span className="text-faint">·</span>
            <span>
              {t("build")} <span className="text-text">{sha}</span>
            </span>
            <span className="text-faint">·</span>
            <span className="inline-flex items-center gap-2">
              {t("status")}
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(255,90,31,.8)]" aria-hidden />
            </span>
          </p>
          <ul className="flex gap-5">
            <li>
              <a href={site.socials.github} target="_blank" rel="noreferrer" className="hover:text-text">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-text">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a href={site.agencyUrl} target="_blank" rel="noreferrer" className="hover:text-text">
                AGility ↗
              </a>
            </li>
            <li>
              <a href={site.cv} download className="hover:text-text">
                CV ↓
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

import { getTranslations } from "next-intl/server";
import { SHOW_PLACEHOLDERS, filled } from "@/content/types";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { StackMonogram } from "./stack-monogram";
import { AboutBody } from "./about-body";

const keep = (s: string) => SHOW_PLACEHOLDERS || filled(s);

/** 05 — About: the longer version, the "I do both" line, what I'm learning and the tools I use. */
export async function About() {
  const t = await getTranslations("about");
  const learning = (t.raw("learningList") as string[]).filter(keep);
  const tools = (t.raw("toolsList") as string[]).filter(keep);

  return (
    <section id="about" data-island="about" aria-labelledby="about-title" className="frame py-24 md:py-40">
      <SectionHead
        id="about-title"
        n="05"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
      />

      <div className="grid-12 mt-16 gap-y-14 md:mt-24">
        <div className="col-span-4 md:col-span-5" data-reveal="fade">
          <StackMonogram />
        </div>
        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <AboutBody
            paras={t.raw("paras")}
            bullets={t.raw("bullets")}
            labels={{ long: t("toggleLong"), short: t("toggleShort") }}
          />
        </div>
      </div>

      <p
        className="mt-24 max-w-[24ch] font-serif text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[1] tracking-[-0.025em] md:mt-32"
        data-reveal="fade"
      >
        {t.rich("both", { em: (c) => <em className="em">{c}</em> })}
      </p>

      <div className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-24 md:grid-cols-2 md:gap-16">
        <div data-reveal="fade">
          <h3 className="t-mono mb-5 text-muted">{t("learningK")}</h3>
          <ul className="flex flex-col gap-3 text-[15.5px] text-text/90">
            {learning.map((l) => (
              <li key={l} className="flex items-start gap-3">
                <span className="relative mt-[8px] flex size-1.5 shrink-0" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.4s]" />
                  <span className="relative size-1.5 rounded-full bg-accent" />
                </span>
                <PlaceholderText>{l}</PlaceholderText>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13.5px] italic text-muted">{t("learningNote")}</p>
        </div>
        <div data-reveal="fade" style={{ ["--d" as string]: 1 }}>
          <h3 className="t-mono mb-5 text-muted">{t("toolsK")}</h3>
          <ul className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <li key={tool} className="t-mono rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-text/85">
                <PlaceholderText>{tool}</PlaceholderText>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

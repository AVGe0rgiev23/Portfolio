import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/section-head";
import { StackMonogram } from "./stack-monogram";
import { AboutBody } from "./about-body";

/** 07 — About: the longer version, with a 30-second mode for busy readers. */
export async function About() {
  const t = await getTranslations("about");
  return (
    <section id="about" data-island="about" aria-labelledby="about-title" className="frame py-24 md:py-40">
      <SectionHead
        id="about-title"
        n="07"
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
    </section>
  );
}

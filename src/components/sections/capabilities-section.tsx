import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/section-head";
import { CapabilitiesBento } from "./capabilities";

/** 06 — Capabilities: a bento of small, working examples. No skill bars. */
export async function Capabilities() {
  const t = await getTranslations("caps");
  return (
    <section id="capabilities" data-island="caps" aria-labelledby="caps-title" className="frame py-24 md:py-40">
      <SectionHead
        id="caps-title"
        n="06"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
        lede={t("lede")}
      />
      <CapabilitiesBento
        copy={{
          cells: t.raw("cells"),
          sorted: t("sorted"),
          tokens: t("tokens"),
          streaming: t("streaming"),
          assembling: t("assembling"),
          learningList: t.raw("learningList"),
          learningNote: t("learningNote"),
          toolsList: t.raw("toolsList"),
          summary: t("summary"),
        }}
      />
    </section>
  );
}

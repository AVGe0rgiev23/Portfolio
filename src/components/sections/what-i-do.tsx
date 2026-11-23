import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/section-head";
import { WhatStage } from "./what-stage";

/** 01 — What I do. Right after the introduction: the positioning line, then four live disciplines. */
export async function WhatIDo() {
  const t = await getTranslations("what");
  return (
    <section id="what" data-island="what" aria-labelledby="what-title" className="frame relative py-24 md:py-36">
      <SectionHead
        id="what-title"
        n="01"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
        lede={t("lede")}
      />
      <WhatStage items={t.raw("items")} demo={t.raw("demo")} />
    </section>
  );
}

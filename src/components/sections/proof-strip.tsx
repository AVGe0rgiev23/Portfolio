import { getTranslations } from "next-intl/server";
import { stack } from "@/content/stack";
import { PlaceholderText } from "@/components/ui/placeholder-text";

type Fact = { n: string; caption: string };

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {stack.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 md:px-9">{item}</span>
          <span className="size-1 rotate-45 bg-faint" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

export async function ProofStrip() {
  const t = await getTranslations("proof");
  const facts = t.raw("facts") as Fact[];

  return (
    <section data-island="proof" aria-label={t("label")} className="relative pb-8 pt-16 md:pb-12 md:pt-24">
      <div className="marquee group relative overflow-hidden border-y border-line py-5 md:py-6">
        <div className="t-mono flex w-max text-[12px] text-muted md:text-[13px] [animation:marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
          <Row />
          <Row hidden />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" aria-hidden />
      </div>

      <dl className="frame grid-12 mt-14 gap-y-10 md:mt-20">
        {facts.map((f, i) => (
          <div
            key={f.caption}
            className="col-span-2 flex flex-col gap-3 border-l border-line pl-4 md:col-span-3 md:pl-6"
            data-reveal="fade"
            style={{ ["--d" as string]: i }}
          >
            <dt className="t-mono order-2 max-w-[22ch] text-muted">{f.caption}</dt>
            <dd className="order-1 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] tracking-[-0.03em]">
              <PlaceholderText>{f.n}</PlaceholderText>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

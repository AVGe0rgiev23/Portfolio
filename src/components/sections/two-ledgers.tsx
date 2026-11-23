import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/section-head";
import { PlaceholderText } from "@/components/ui/placeholder-text";
import { CodeTyper } from "./code-typer";
import { LedgerStage } from "./ledger-stage";

const SNIPPET = `def extract_enquiry(text: str) -> Enquiry:
    """Raw message in, routed lead out."""
    reply = llm.chat(
        system=EXTRACT_PROMPT,
        messages=[{"role": "user", "content": text}],
        schema=Enquiry,  # product, dims, city, urgency
    )
    lead = Enquiry.model_validate_json(reply.content)
    lead.office = route(lead.city)  # Sofia · Varna · Burgas
    return lead`;

function Points({ items }: { items: string[] }) {
  return (
    <ol className="mt-10 flex flex-col">
      {items.map((p, i) => (
        <li key={p} className="grid grid-cols-[3rem_1fr] gap-2 border-t border-line py-4 text-[15.5px] leading-snug text-text/90">
          <span className="t-mono pt-[3px] text-faint">0{i + 1}</span>
          <span>{p}</span>
        </li>
      ))}
    </ol>
  );
}

export async function TwoLedgers() {
  const t = await getTranslations("ledgers");
  const rows = t.raw("rows") as { k: string; v: string }[];

  return (
    <section id="ledgers" data-island="ledgers" aria-labelledby="ledgers-title" className="frame pb-24 pt-20 md:pb-40 md:pt-28">
      <SectionHead
        id="ledgers-title"
        n="02"
        label={t("index")}
        meta={t("meta")}
        title={t.rich("title", { em: (c) => <em className="em">{c}</em> })}
      />

      <LedgerStage>
        <div className="relative mt-16 grid grid-cols-[minmax(0,1fr)] gap-12 md:mt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr_auto] md:gap-x-0 md:gap-y-0">
          {/* LEDGER 01 */}
          <article data-ledger="left" className="md:row-span-3 md:grid md:grid-rows-subgrid md:pr-12 lg:pr-20" aria-labelledby="ledger-dev">
            <h3 id="ledger-dev" className="t-mono mb-6 text-muted">
              {t("devLabel")}
            </h3>
            <CodeTyper code={SNIPPET} file={t("file")} labels={{ running: t("running"), done: t("done") }} />
            <Points items={t.raw("devPoints") as string[]} />
          </article>

          {/* Spine: in flow between the cards on mobile, the vertical centre line on desktop */}
          <div
            data-ledger="spine"
            aria-hidden
            className="ledger-spine h-px w-full origin-left bg-line-strong md:absolute md:bottom-0 md:left-1/2 md:top-0 md:h-auto md:w-px md:origin-top"
          />

          {/* LEDGER 02 */}
          <article data-ledger="right" className="md:row-span-3 md:grid md:grid-rows-subgrid md:pl-12 lg:pl-20" aria-labelledby="ledger-founder">
            <h3 id="ledger-founder" className="t-mono mb-6 text-muted">
              {t("founderLabel")}
            </h3>
            <div className="card bg-sunken">
              <div className="t-mono flex items-center justify-between border-b border-line px-4 py-3 text-[10.5px] text-muted">
                <span>{t("invoice")}</span>
                <span className="text-faint">{t("invoiceNo")}</span>
              </div>
              <dl className="px-4 md:px-5">
                {rows.map((r) => (
                  <div
                    key={r.k}
                    className="grid grid-cols-1 gap-1 border-b border-dashed border-line py-3.5 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
                  >
                    <dt className="t-mono pt-[3px] text-faint">{r.k}</dt>
                    <dd className="text-[14.5px] leading-snug text-text/90">
                      <PlaceholderText>{r.v}</PlaceholderText>
                    </dd>
                  </div>
                ))}
                <div className="grid grid-cols-1 gap-1 border-t border-line-strong py-4 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
                  <dt className="t-mono pt-[5px] text-text">{t("total")}</dt>
                  <dd className="font-serif text-[1.5rem] italic leading-tight tracking-[-0.01em]">{t("totalValue")}</dd>
                </div>
              </dl>
            </div>
            <Points items={t.raw("founderPoints") as string[]} />
          </article>
        </div>
      </LedgerStage>

      <p
        className="mt-24 max-w-[22ch] font-serif text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[1] tracking-[-0.025em] md:mt-36"
        data-reveal="fade"
      >
        {t.rich("close", { em: (c) => <em className="em">{c}</em> })}
      </p>
    </section>
  );
}

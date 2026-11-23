import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, isSet } from "@/content/site";
import { SectionIndex } from "@/components/ui/section-index";
import { CopyEmail } from "@/components/ui/copy-email";
import { ContactForm } from "./contact-form";

function Door({ n, k, v, children }: { n: string; k: string; v: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 border-t border-line pt-6" data-reveal="fade" style={{ ["--d" as string]: Number(n) }}>
      <div>
        <p className="t-mono text-faint">
          0{n} — <span className="text-text">{k}</span>
        </p>
        <p className="mt-3 max-w-[34ch] text-[15.5px] leading-relaxed text-muted">{v}</p>
      </div>
      <div className="mt-auto flex flex-col items-start gap-3 text-[15px]">{children}</div>
    </div>
  );
}

const linkCls = "underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-text hover:decoration-accent";

/** 08 — Contact: three doors (companies · businesses · schools & Erasmus+) and the form. */
export async function Contact() {
  const t = await getTranslations("contact");
  const book = isSet(site.calLink) ? site.calLink : null;

  return (
    <section id="contact" data-island="contact" aria-labelledby="contact-title" className="frame py-24 md:py-40">
      <SectionIndex n="08" label={t("index")} meta={t("meta")} />
      <h2 id="contact-title" className="t-display mt-14 max-w-[16ch] md:mt-20" data-reveal="lines">
        <span className="reveal">
          <span>{t.rich("title", { em: (c) => <em className="em">{c}</em> })}</span>
        </span>
      </h2>
      <p className="t-lede mt-8">{t("lede")}</p>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
        <Door n="1" k={t("companies.k")} v={t("companies.v")}>
          <CopyEmail copied={t("copied")} label={t("copy")} />
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className={linkCls}>
            {t("linkedin")} ↗
          </a>
          <a href={site.cv} download className={linkCls}>
            {t("cv")} ↓
          </a>
        </Door>
        <Door n="2" k={t("business.k")} v={t("business.v")}>
          {book ? (
            <a
              href={book}
              target="_blank"
              rel="noreferrer"
              className="t-mono inline-flex h-11 items-center rounded-[2px] bg-accent px-5 text-bg hover:brightness-110"
            >
              {t("book")} ↗
            </a>
          ) : (
            <span className="ph">{site.calLink}</span>
          )}
          <a href="#contact-form" className={linkCls}>
            {t("form.message")} ↓
          </a>
        </Door>
        <Door n="3" k={t("schools.k")} v={t("schools.v")}>
          <CopyEmail copied={t("copied")} label={t("copy")} />
          <Link href="/cv/europass" className={linkCls}>
            {t("europass")} →
          </Link>
          <a href={site.cv} download className={linkCls}>
            {t("cv")} ↓
          </a>
        </Door>
      </div>

      <div id="contact-form" className="card relative mt-20 scroll-mt-28 bg-sunken p-6 md:mt-28 md:p-10">
        <p className="t-mono mb-8 text-muted">
          <span className="text-faint">02 —</span> {t("business.k")}
        </p>
        <ContactForm
          labels={{
            name: t("form.name"),
            company: t("form.company"),
            email: t("form.email"),
            message: t("form.message"),
            send: t("form.send"),
            sending: t("form.sending"),
            ok: t("form.ok"),
            error: t("form.error"),
            rate: t("form.rate"),
            invalid: t("form.invalid"),
            notConfigured: t("form.notConfigured"),
          }}
        />
      </div>
    </section>
  );
}

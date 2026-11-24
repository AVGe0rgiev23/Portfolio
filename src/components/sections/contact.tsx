import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, isSet } from "@/content/site";
import { SHOW_PLACEHOLDERS } from "@/content/types";
import { SectionIndex } from "@/components/ui/section-index";
import { CopyEmail } from "@/components/ui/copy-email";
import { ContactForm } from "./contact-form";

const linkCls = "underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-text hover:decoration-accent";

/** The form only appears once Resend is configured, so it never promises a message that can't be sent. */
const formReady = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

/** 04 — Contact: every way in on one line, then the form. */
export async function Contact() {
  const t = await getTranslations("contact");
  const book = isSet(site.calLink) ? site.calLink : null;

  return (
    <section id="contact" data-island="contact" aria-labelledby="contact-title" className="frame py-24 md:py-40">
      <SectionIndex n="04" label={t("index")} meta={t("meta")} />
      <h2 id="contact-title" className="t-display mt-14 max-w-[16ch] md:mt-20" data-reveal="lines">
        <span className="reveal">
          <span>{t.rich("title", { em: (c) => <em className="em">{c}</em> })}</span>
        </span>
      </h2>
      <p className="t-lede mt-8 max-w-[44ch]">{t("lede")}</p>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 text-[15px] md:mt-16" data-reveal="fade">
        {book ? (
          <a
            href={book}
            target="_blank"
            rel="noreferrer"
            className="t-mono inline-flex h-12 items-center rounded-[2px] bg-accent px-5 text-bg hover:brightness-110"
          >
            {t("book")} ↗
          </a>
        ) : SHOW_PLACEHOLDERS ? (
          <span className="ph">{site.calLink}</span>
        ) : null}
        {(isSet(site.email) || SHOW_PLACEHOLDERS) && <CopyEmail copied={t("copied")} label={t("copy")} />}
        <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className={linkCls}>
          {t("linkedin")} ↗
        </a>
        <a href={site.socials.github} target="_blank" rel="noreferrer" className={linkCls}>
          {t("github")} ↗
        </a>
        <a href={site.cv} download className={linkCls}>
          {t("cv")} ↓
        </a>
        <Link href="/cv/europass" className={linkCls}>
          {t("europass")} →
        </Link>
      </div>

      {(formReady || SHOW_PLACEHOLDERS) && (
        <div id="contact-form" className="card relative mt-16 scroll-mt-28 bg-sunken p-6 md:mt-20 md:p-10">
          <p className="t-mono mb-8 text-muted">{t("formK")}</p>
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
      )}
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { site, isSet } from "@/content/site";
import { projects } from "@/content/projects";
import { school, languages } from "@/content/education";
import { stack } from "@/content/stack";
import { PlaceholderText } from "@/components/ui/placeholder-text";

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="cv-h t-mono mb-3 border-b pb-2 text-[10.5px]">{children}</h2>
);

/**
 * One data source, two shapes:
 * - "standard": a recruiter CV.
 * - "europass": Europass section order + CEFR self-assessment grid (Erasmus+, schools).
 * Screen: dark sheet. Print: light, A4, one page (see @media print in globals.css).
 */
export async function CvSheet({ locale, variant }: { locale: AppLocale; variant: "standard" | "europass" }) {
  const t = await getTranslations("cv");
  const euro = variant === "europass";
  const selected = projects.slice(0, 5);
  const contact = [
    `${site.city}, Bulgaria`,
    site.email,
    site.socials.github.replace("https://", ""),
    site.socials.linkedin.replace("https://www.", ""),
  ];

  const Experience = (
    <section>
      <H>{euro ? t("workK") : t("experienceK")}</H>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[15px] font-medium">{t("agilityRole")}</h3>
        <p className="cv-muted t-mono text-[10px]">
          <PlaceholderText>{t("agilityWhen")}</PlaceholderText> · {t("agilityWhere")}
        </p>
      </div>
      <ul className="mt-2 list-disc pl-4 text-[13px] leading-snug">
        {(t.raw("agilityPoints") as string[]).map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );

  const Education = (
    <section>
      <H>{euro ? t("eduTrainK") : t("educationK")}</H>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[15px] font-medium">
          {school.full[locale]} — {school.specialty[locale]}
        </h3>
        <p className="cv-muted t-mono text-[10px]">
          <PlaceholderText>{school.years}</PlaceholderText>
        </p>
      </div>
      <p className="cv-muted mt-1 text-[12.5px]">{school.modules.filter((m) => !m.startsWith("[[")).join(" · ")}</p>
    </section>
  );

  const Projects = (
    <section>
      <H>{t("projectsK")}</H>
      <ul className="flex flex-col gap-1.5 text-[12.5px] leading-snug">
        {selected.map((p) => (
          <li key={p.slug}>
            <span className="font-medium">{p.name[locale]}</span>
            <span className="cv-muted"> — {p.role[locale]}. </span>
            <PlaceholderText>{p.summary[locale].split(". ")[0] + "."}</PlaceholderText>
          </li>
        ))}
      </ul>
    </section>
  );

  const Competitions = (
    <section>
      <H>{euro ? t("honoursK") : t("competitionsK")}</H>
      <ul className="flex flex-col gap-1 text-[12.5px] leading-snug">
        <li>
          <PlaceholderText>{t("iro")}</PlaceholderText>
        </li>
        <li>
          <PlaceholderText>{t("atanasov")}</PlaceholderText>
        </li>
      </ul>
    </section>
  );

  const Skills = (
    <section>
      <H>{euro ? t("digitalK") : t("skillsK")}</H>
      <p className="text-[12.5px] leading-relaxed">{stack.join(" · ")}</p>
    </section>
  );

  const Languages = (
    <section>
      <H>{t("languagesK")}</H>
      {euro ? (
        <div className="-mx-1 overflow-x-auto px-1" data-lenis-prevent>
        <table className="w-full min-w-[520px] text-left text-[11.5px]">
          <thead>
            <tr className="cv-muted t-mono text-[9px]">
              <th scope="col" className="py-1 font-normal">
                <span className="sr-only">{t("languagesK")}</span>
              </th>
              {(t.raw("cefrHead") as string[]).map((h) => (
                <th key={h} scope="col" className="py-1 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {languages.map((l) => (
              <tr key={l.name.en} className="border-t border-[var(--cv-line)]">
                <th scope="row" className="py-1.5 pr-2 text-left font-medium">
                  <PlaceholderText>{l.name[locale]}</PlaceholderText>
                </th>
                {l.level === "native" ? (
                  <td colSpan={5} className="py-1.5">
                    {locale === "bg" ? "Роден език" : "Mother tongue"}
                  </td>
                ) : l.level.startsWith("[[") ? (
                  <td colSpan={5} className="py-1.5">
                    <PlaceholderText>{l.level}</PlaceholderText>
                  </td>
                ) : (
                  Array.from({ length: 5 }, (_, i) => (
                    <td key={i} className="py-1.5">
                      {l.level}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="text-[12.5px]">
          {languages.map((l, i) => (
            <span key={l.name.en}>
              {i > 0 && " · "}
              <PlaceholderText>{l.name[locale]}</PlaceholderText>{" "}
              <span className="cv-muted">
                (<PlaceholderText>{l.level === "native" ? (locale === "bg" ? "роден" : "native") : l.level}</PlaceholderText>)
              </span>
            </span>
          ))}
        </p>
      )}
    </section>
  );

  return (
    <article className="cv-sheet mx-auto flex w-full max-w-[820px] flex-col gap-6 rounded-[2px] border p-5 sm:p-8 md:p-12">
      <header className="flex flex-col gap-3 border-b border-[var(--cv-line)] pb-6">
        <p className="cv-muted t-mono text-[10px]">{euro ? t("personalK") : t("title")}</p>
        <h1 className="font-serif text-[44px] leading-none tracking-[-0.03em]">{site.name}</h1>
        <p className="text-[14px]">{t("role")}</p>
        <p className="cv-muted t-mono flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
          {contact.map((c) => (
            <span key={c}>{isSet(c) ? c : <PlaceholderText>{c}</PlaceholderText>}</span>
          ))}
        </p>
      </header>

      <section>
        <H>{t("profileK")}</H>
        <p className="text-[13.5px] leading-relaxed">{t("profile")}</p>
      </section>

      {euro ? (
        <>
          {Experience}
          {Education}
          {Languages}
          {Skills}
          {Competitions}
          {Projects}
          <section>
            <H>{t("additionalK")}</H>
            <p className="text-[12.5px] leading-relaxed">
              <PlaceholderText>{t("additional")}</PlaceholderText>
            </p>
          </section>
        </>
      ) : (
        <>
          {Experience}
          {Projects}
          {Education}
          {Competitions}
          <div className="grid gap-6 md:grid-cols-2">
            {Skills}
            {Languages}
          </div>
        </>
      )}
    </article>
  );
}

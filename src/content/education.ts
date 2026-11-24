import type { L } from "./types";

/**
 * Education: school, languages and certificates.
 * No grades on purpose. Fill every [[PLACEHOLDER]] with true values (class, CEFR levels, certificates).
 */

export type Cefr = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native";

export const school = {
  name: { en: "VSCPI Burgas", bg: "ПГКПИ Бургас" } as L,
  full: {
    en: "Vocational School of Computer Programming and Innovation, Burgas",
    bg: "Професионална гимназия по компютърно програмиране и иновации, Бургас",
  } as L,
  specialty: { en: "AI programming", bg: "AI програмиране" } as L,
  years: "[[YEARS: e.g. 2023 — 2027]]",
  /** Which class you are in — not grades. */
  klass: { en: "11th grade", bg: "11 клас" } as L,
  modules: ["Python", "Machine learning", "NumPy", "Linear regression", "Pandas", "Data modelling", "[[OTHER SUBJECTS]]"],
};

export const languages: { name: L; level: Cefr | string; note?: L }[] = [
  { name: { en: "Bulgarian", bg: "Български" }, level: "native" },
  {
    name: { en: "English", bg: "Английски" },
    level: "[[CEFR: e.g. C1]]",
    note: { en: "[[CERTIFICATE: e.g. Cambridge C1, 2026]]", bg: "[[СЕРТИФИКАТ: напр. Cambridge C1, 2026]]" },
  },
  { name: { en: "[[OTHER LANGUAGE]]", bg: "[[ДРУГ ЕЗИК]]" }, level: "[[CEFR]]" },
];

export const certificates: L[] = [{ en: "[[CERTIFICATES: name, issuer, year]]", bg: "[[СЕРТИФИКАТИ: име, издател, година]]" }];

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
  years: "2023 — 2028",
  /** Which class you are in — not grades. */
  klass: { en: "11th grade", bg: "11 клас" } as L,
  modules: ["Python", "Machine learning", "NumPy", "Pandas", "Data modelling", "Higher mathematics", "AI workflows", "AI engineering"],
};

export const languages: { name: L; level: Cefr | string; note?: L }[] = [
  { name: { en: "Bulgarian", bg: "Български" }, level: "native" },
  {
    name: { en: "English", bg: "Английски" },
    level: "B2–C1",
  },
  { name: { en: "German", bg: "Немски" }, level: "A1", note: { en: "Goethe-Zertifikat A1", bg: "Goethe-Zertifikat A1" } },
];

export const certificates: L[] = [
  { en: "Goethe-Zertifikat A1 (German), Goethe-Institut", bg: "Goethe-Zertifikat A1 (немски), Гьоте институт" },
  { en: "[[MORE CERTIFICATES: name, issuer, year]]", bg: "[[ОЩЕ СЕРТИФИКАТИ: име, издател, година]]" },
];

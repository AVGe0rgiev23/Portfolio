import type { AppLocale } from "@/i18n/routing";

/** A string written in both languages. Keep tech terms (Python, LLM, Next.js) in Latin script in BG too. */
export type L = Record<AppLocale, string>;

export const t = (value: L, locale: AppLocale) => value[locale];

/**
 * Anything wrapped in [[DOUBLE BRACKETS]] is an unfilled placeholder.
 * It renders as a visible dashed ember marker so nothing unfinished ships unnoticed.
 */
export const PLACEHOLDER = /(\[\[[^\]]+\]\])/g;
export const isPlaceholder = (s: string) => /^\[\[[^\]]+\]\]$/.test(s);
export const hasPlaceholder = (s: string) => /\[\[[^\]]+\]\]/.test(s);

import type { AppLocale } from "@/i18n/routing";

/** A string written in both languages. Keep tech terms (Python, LLM, Next.js) in Latin script in BG too. */
export type L = Record<AppLocale, string>;

export const t = (value: L, locale: AppLocale) => value[locale];

/**
 * Anything wrapped in [[DOUBLE BRACKETS]] is an unfilled placeholder.
 * - Local dev: shown as a dashed ember marker so nothing unfinished is missed.
 * - Production: removed (with any label it would leave dangling), so the live site never looks unfinished.
 * Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=1 to show them in a production build too.
 */
export const PLACEHOLDER = /(\[\[[^\]]+\]\])/g;
export const isPlaceholder = (s: string) => /^\[\[[^\]]+\]\]$/.test(s.trim());
export const hasPlaceholder = (s: string) => /\[\[[^\]]+\]\]/.test(s);

export const SHOW_PLACEHOLDERS =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "1";

/** Remove placeholders and the labels/separators they would leave behind. */
export function clean(s: string): string {
  if (!hasPlaceholder(s)) return s;
  return s
    .replace(/\s*(?:Result|Резултат)\s*:\s*\[\[[^\]]+\]\]\s*\.?/gi, "")
    .replace(/\s*[+·—–,]\s*\[\[[^\]]+\]\]/g, "")
    .replace(/\[\[[^\]]+\]\]\s*[·—–,:]?\s*/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s·—–,:+]+|[\s·—–,:+]+$/g, "")
    .trim();
}

/** What to render for a possibly-unfilled string. Empty string = render nothing. */
export const shown = (s: string) => (SHOW_PLACEHOLDERS ? s : clean(s));
/** True when the string still has real content on the live site. */
export const filled = (s: string | undefined | null) => Boolean(s && clean(s).length > 0);

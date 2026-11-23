import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bg"],
  defaultLocale: "en",
  localePrefix: "always",
  // Accept-Language is only consulted when no NEXT_LOCALE cookie exists,
  // i.e. on the first visit. After that the visitor's choice wins.
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}

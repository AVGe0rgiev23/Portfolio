"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useActiveSection } from "@/lib/active-section";
import { useLenis } from "@/components/motion/smooth-scroll";
import { site, isSet } from "@/content/site";
import { cn } from "@/lib/cn";
import { StatusIsland } from "./status-island";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINKS = ["work", "studies", "services", "about", "contact"] as const;
const noop = () => () => {};

export function openPalette() {
  window.dispatchEvent(new CustomEvent("ag:palette"));
}

function Monogram() {
  return (
    <span
      aria-hidden
      className="grid size-8 place-items-center rounded-[2px] border border-line-strong font-serif text-[17px] italic leading-none tracking-[-0.04em]"
    >
      AG
    </span>
  );
}

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const active = useActiveSection();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const mac = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );
  const other = locale === "en" ? "bg" : "en";
  const bookHref = isSet(site.calLink) ? site.calLink : "/#contact";

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50">
        {/* Full-bleed backing so content never bleeds through the bar */}
        <div
          className="pointer-events-none absolute inset-0 bg-bg/80 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
          aria-hidden
        />
        <div className="frame relative flex h-[var(--nav-h)] items-center justify-between gap-4">
          {/* Hairline under the bar */}
          <div className="pointer-events-none absolute inset-x-[var(--page-pad)] bottom-0 h-px bg-line" aria-hidden />

          <Link href="/" className="group flex shrink-0 items-center gap-3 xl:w-[260px]">
            <Monogram />
            <span className="t-mono sr-only text-muted transition-colors group-hover:text-text xl:not-sr-only">
              {site.name}
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 justify-center">
            <StatusIsland />
          </div>

          <nav aria-label={t("primary")} className="hidden shrink-0 items-center gap-1 xl:flex">
            <ul className="flex items-center">
              {LINKS.map((id) => {
                const isActive = active === id || (id === "work" && active === "work");
                return (
                  <li key={id}>
                    <Link
                      href={`/#${id}`}
                      className={cn(
                        "t-mono relative block px-3 py-2 transition-colors duration-300",
                        isActive ? "text-text" : "text-muted hover:text-text",
                      )}
                      aria-current={isActive ? "location" : undefined}
                    >
                      {t(id)}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-px h-px bg-accent"
                          transition={{ duration: 0.6, ease: EASE }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <span className="mx-2 h-4 w-px bg-line-strong" aria-hidden />

            <Link
              href={pathname}
              locale={other}
              className="t-mono px-2 py-2 text-muted transition-colors hover:text-text"
              aria-label={t("switchTo")}
              hrefLang={other}
            >
              <span className={locale === "en" ? "text-text" : ""}>EN</span>
              <span className="text-faint"> / </span>
              <span className={locale === "bg" ? "text-text" : ""}>BG</span>
            </Link>

            <button
              type="button"
              onClick={openPalette}
              aria-label={t("palette")}
              aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
              className="t-mono ml-1 flex h-7 items-center gap-1 rounded-[2px] border border-line-strong px-2 text-muted transition-colors hover:border-text/40 hover:text-text"
            >
              {mac ? "⌘" : "Ctrl"} K
            </button>

            <a
              href={bookHref}
              {...(isSet(site.calLink) ? { target: "_blank", rel: "noreferrer" } : {})}
              className="t-mono ml-3 inline-flex h-9 items-center rounded-[2px] bg-accent px-4 text-bg transition-[filter] hover:brightness-110"
            >
              {t("book")}
            </a>
          </nav>

          <button
            type="button"
            className="t-mono relative z-[70] flex h-9 shrink-0 items-center gap-2 px-1 text-text xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? t("close") : t("menu")}</span>
            <span className="flex w-4 flex-col gap-[5px]" aria-hidden>
              <span
                className={cn("h-px w-full bg-current transition-transform duration-500", open && "translate-y-[3px] rotate-45")}
              />
              <span
                className={cn("h-px w-full bg-current transition-transform duration-500", open && "-translate-y-[3px] -rotate-45")}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const other = locale === "en" ? "bg" : "en";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className="fixed inset-0 z-[60] flex flex-col bg-bg pt-[var(--nav-h)] xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <nav className="frame flex flex-1 flex-col justify-center" aria-label={t("primary")}>
            <ul className="flex flex-col">
              {LINKS.map((id, i) => (
                <li key={id} className="overflow-hidden border-b border-line">
                  <motion.div
                    initial={reduce ? { opacity: 0 } : { y: "105%" }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.08 + i * 0.07 }}
                  >
                    <Link
                      href={`/#${id}`}
                      onClick={onClose}
                      className="flex items-baseline justify-between py-4 font-serif text-[clamp(3rem,14vw,6rem)] leading-[0.95] tracking-[-0.03em]"
                    >
                      {t(id)}
                      <span className="t-mono text-faint">0{i + 1}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="frame flex flex-wrap items-center justify-between gap-4 pb-8 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href={pathname} locale={other} onClick={onClose} className="t-mono text-muted" hrefLang={other}>
              <span className={locale === "en" ? "text-text" : ""}>EN</span> /{" "}
              <span className={locale === "bg" ? "text-text" : ""}>BG</span>
            </Link>
            <a href={site.cv} download className="t-mono text-muted underline-offset-4 hover:text-text">
              {t("cv")} ↓
            </a>
            <a
              href={isSet(site.calLink) ? site.calLink : "/#contact"}
              onClick={onClose}
              className="t-mono inline-flex h-11 items-center rounded-[2px] bg-accent px-5 text-bg"
            >
              {t("book")}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useActiveSection } from "@/lib/active-section";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Morphs with the page: "Available for work" → current section → "Reply within 24h" in contact.
 * aria-live is polite; it only changes when a whole section changes.
 */
export function StatusIsland() {
  const t = useTranslations("island");
  const section = useActiveSection();
  const reduce = useReducedMotion();
  const key = t.has(section) ? section : "available";
  const label = t(key);
  const isContact = key === "contact";
  const isHero = key === "hero" || key === "available";

  return (
    <motion.div
      layout={!reduce}
      transition={{ layout: { duration: 0.6, ease: EASE } }}
      className="t-mono pointer-events-auto flex h-8 min-w-0 max-w-full items-center gap-2.5 overflow-hidden rounded-full border border-line bg-raised/85 px-3.5 text-text backdrop-blur-md"
      style={{ borderRadius: 999 }}
    >
      <motion.span layout="position" className="relative flex size-1.5 shrink-0" aria-hidden>
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.2s]" />
        <span className="relative size-1.5 rounded-full bg-accent" />
      </motion.span>
      <span className="sr-only" aria-live="polite">
        {label}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={key}
          aria-hidden
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="truncate whitespace-nowrap"
        >
          {!isHero && !isContact && <span className="text-faint">§ </span>}
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

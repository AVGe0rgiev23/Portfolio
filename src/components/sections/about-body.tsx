"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Full story ↔ "In 30 seconds" (five bullets for busy recruiters). */
export function AboutBody({
  paras,
  bullets,
  labels,
}: {
  paras: string[];
  bullets: string[];
  labels: { long: string; short: string };
}) {
  const [short, setShort] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div>
      <div role="group" aria-label={`${labels.long} / ${labels.short}`} className="t-mono inline-flex rounded-full border border-line-strong p-1">
        {[false, true].map((s) => (
          <button
            key={String(s)}
            type="button"
            aria-pressed={short === s}
            onClick={() => setShort(s)}
            className={cn(
              "relative rounded-full px-4 py-2 text-[11px] transition-colors duration-300",
              short === s ? "text-bg" : "text-muted hover:text-text",
            )}
          >
            {short === s && (
              <motion.span
                layoutId="about-toggle"
                className="absolute inset-0 rounded-full bg-text"
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              />
            )}
            <span className="relative">{s ? labels.short : labels.long}</span>
          </button>
        ))}
      </div>

      <div className="mt-10" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {short ? (
            <motion.ul
              key="short"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-col"
            >
              {bullets.map((b, i) => (
                <li key={b} className="grid grid-cols-[2.5rem_1fr] border-t border-line py-4 text-[17px] leading-snug last:border-b">
                  <span className="t-mono pt-[3px] text-accent">0{i + 1}</span>
                  {b}
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="long"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-col gap-6"
            >
              {paras.map((p, i) => (
                <p
                  key={p}
                  className={cn(
                    "max-w-[58ch] leading-relaxed",
                    i === 0 ? "font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.2] tracking-[-0.01em]" : "text-[17px] text-text/80",
                  )}
                >
                  {p}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

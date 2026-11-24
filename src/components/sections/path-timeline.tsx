"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";
import { PlaceholderText } from "@/components/ui/placeholder-text";

gsap.registerPlugin(ScrollTrigger);

type Entry = { date: string; title: string; line: string; next?: boolean };

/**
 * The path so far. A hairline draws across (desktop) or down (mobile) as you scroll,
 * and each milestone lights up as the line reaches it. Scrubbed, never pinned.
 */
export function PathTimeline({ entries, nowLabel }: { entries: Entry[]; nowLabel: string }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el?.style.setProperty("--p", "1");
      return;
    }
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 45%",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        el.style.setProperty("--p", p.toFixed(4));
        items.forEach((it, i) => {
          const at = items.length === 1 ? 0 : i / (items.length - 1);
          it.dataset.lit = p >= at - 0.02 ? "1" : "0";
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <ol
      ref={root}
      className="path relative grid gap-10 pl-8 md:grid-cols-6 md:gap-6 md:pl-0 md:pt-10"
      style={{ ["--p" as string]: 0 }}
    >
      {/* Track + drawn progress */}
      <span className="absolute left-[5px] top-0 h-full w-px bg-line md:left-0 md:top-[4px] md:h-px md:w-full" aria-hidden />
      <span className="path__fill absolute left-[5px] top-0 w-px bg-accent md:left-0 md:top-[4px] md:h-px" aria-hidden />

      {entries.map((e, i) => (
        <li key={e.title} data-step={i} data-lit="0" className="path__step relative">
          <span
            className={cn(
              "path__dot absolute -left-8 top-[5px] size-[11px] rounded-full border md:-top-10 md:left-0",
              e.next ? "border-accent" : "border-line-strong",
            )}
            aria-hidden
          >
            {e.next && <span className="absolute inset-[2px] animate-pulse rounded-full bg-accent" />}
          </span>
          <p className="t-mono text-faint">
            <PlaceholderText>{e.date}</PlaceholderText>
            {e.next && <span className="ml-2 text-accent">● {nowLabel}</span>}
          </p>
          <h3 className="mt-3 font-serif text-[clamp(1.5rem,2vw,1.9rem)] leading-[1.02] tracking-[-0.015em]">{e.title}</h3>
          <p className="mt-3 max-w-[30ch] text-[14.5px] leading-snug text-muted">{e.line}</p>
        </li>
      ))}
    </ol>
  );
}

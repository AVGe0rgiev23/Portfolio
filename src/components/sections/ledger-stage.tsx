"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The two ledgers draw in from opposite sides; when they meet, the spine
 * between them flashes ember once. Desktop: horizontal. Mobile: vertical.
 */
export function LedgerStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const left = el.querySelector("[data-ledger='left']");
        const right = el.querySelector("[data-ledger='right']");
        const spine = el.querySelector<HTMLElement>("[data-ledger='spine']");
        const ease = "expo.out";

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
          defaults: { ease, duration: 1.3 },
        });
        tl.from(spine, { scaleY: desktop ? 0 : 1, scaleX: desktop ? 1 : 0, duration: 1.1, ease: "power3.inOut" }, 0)
          .from(left, desktop ? { x: -90, opacity: 0 } : { y: 40, opacity: 0 }, 0.1)
          .from(right, desktop ? { x: 90, opacity: 0 } : { y: 40, opacity: 0 }, desktop ? 0.1 : 0.25)
          .add(() => spine?.classList.add("is-lit"), 0.95)
          .add(() => spine?.classList.remove("is-lit"), 1.9);
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative overflow-x-clip [overflow-clip-margin:24px]">
      {children}
    </div>
  );
}

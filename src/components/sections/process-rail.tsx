"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Step = { k: string; v: string; art: string[] };

/* Tiny artefacts, CSS-animated when their panel is [data-active] */
function Artefact({ i, art }: { i: number; art: string[] }) {
  if (i === 0)
    return (
      <ul className="flex flex-col gap-2.5">
        {art.map((a, k) => (
          <li key={a} className="art-check flex items-center gap-3 text-[13.5px] text-text/85" style={{ ["--k" as string]: k }}>
            <span className="art-check__box grid size-4 place-items-center rounded-[2px] border border-line-strong text-[10px]">
              ✓
            </span>
            {a}
          </li>
        ))}
      </ul>
    );
  if (i === 1)
    return (
      <div className="art-wire flex flex-col gap-2.5" aria-hidden>
        <div className="art-wire__bar h-6 w-3/4" style={{ ["--k" as string]: 0 }} />
        <div className="flex gap-2.5">
          <div className="art-wire__bar h-16 flex-1" style={{ ["--k" as string]: 1 }} />
          <div className="art-wire__bar h-16 flex-1" style={{ ["--k" as string]: 2 }} />
        </div>
        <div className="art-wire__bar art-wire__cta h-7 w-28" style={{ ["--k" as string]: 3 }} />
      </div>
    );
  if (i === 2)
    return (
      <pre className="font-mono text-[12px] leading-[1.9] text-muted">
        {art.map((a, k) => (
          <span key={a} className="art-log block" style={{ ["--k" as string]: k }}>
            <span className="text-faint">$ </span>
            {a.replace("✓", "")}
            <span className="text-accent">✓</span>
          </span>
        ))}
      </pre>
    );
  return (
    <div className="flex h-24 items-end gap-2" aria-hidden>
      {[28, 36, 34, 48, 58, 66, 82].map((h, k) => (
        <span
          key={k}
          className={cn("art-bar flex-1 rounded-[1px]", k === 6 ? "bg-accent" : "bg-text/25")}
          style={{ ["--h" as string]: `${h}%`, ["--k" as string]: k }}
        />
      ))}
    </div>
  );
}

/**
 * Four steps. Desktop (≥1024px, motion allowed): a short horizontal pinned rail that
 * normal scrolling moves through — never traps the user. Otherwise: a vertical stack.
 */
export function ProcessRail({ steps }: { steps: Step[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;

    // Artefacts play when their panel is mostly visible.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.active = e.intersectionRatio > 0.55 ? "1" : "0")),
      { threshold: [0, 0.55, 1] },
    );
    t.querySelectorAll("li").forEach((li) => io.observe(li));

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => t.scrollWidth - w.clientWidth;
      gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: w,
          start: "center center",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => {
      io.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <div ref={wrap} className="overflow-hidden">
      <ol ref={track} className="flex flex-col gap-4 lg:w-max lg:flex-row lg:gap-6">
        {steps.map((s, i) => (
          <li
            key={s.k}
            data-active="0"
            className="process-step card flex flex-col justify-between gap-10 bg-sunken p-6 md:p-8 lg:h-[440px] lg:w-[min(46vw,620px)]"
          >
            <div>
              <p className="t-mono flex items-center gap-3 text-faint">
                <span className="text-accent">0{i + 1}</span>
                <span className="h-px w-8 bg-line-strong" aria-hidden />
              </p>
              <h4 className="mt-6 font-serif text-[clamp(2.2rem,3.4vw,3.25rem)] leading-[0.95] tracking-[-0.025em]">{s.k}</h4>
              <p className="mt-4 max-w-[40ch] text-[15.5px] leading-relaxed text-text/80">{s.v}</p>
            </div>
            <div className="border-t border-line pt-6">
              <Artefact i={i} art={s.art} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { DESKTOP, MOBILE } from "./field-layout";
import { cn } from "@/lib/cn";

/**
 * Tilts toward the pointer, carries an ember rim light that follows it, and (inside the
 * hero) marks the exact point where the Signal Field's line meets the frame.
 */
export function PortraitFrame({ children, fig, className }: { children: ReactNode; fig: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hero = el.closest<HTMLElement>(".field");

    const place = () => {
      if (!hero) return;
      const layout = window.innerWidth >= 768 ? DESKTOP : MOBILE;
      const h = hero.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const pct = ((h.top + h.height * layout.merge[1] - r.top) / r.height) * 100;
      el.style.setProperty("--hit", `${pct}%`);
      el.dataset.hit = pct > 3 && pct < 97 ? "on" : "off";
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    if (hero) ro.observe(hero);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return () => ro.disconnect();

    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      el.style.setProperty("--rx", `${(-cur.y * 5).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(cur.x * 7).toFixed(2)}deg`);
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className={cn("portrait group", className)}>
      <div ref={ref} className="portrait__frame relative aspect-[4/5] w-full">
        <div className="portrait__card absolute inset-0 overflow-hidden rounded-[2px] border border-line-strong bg-sunken">
          {children}
          <div className="portrait__grain" aria-hidden />
          <div className="portrait__rim" aria-hidden />
        </div>
        <span className="portrait__hit" aria-hidden />
        <span className="portrait__tick left-[-6px] top-[-6px] border-l border-t" aria-hidden />
        <span className="portrait__tick right-[-6px] top-[-6px] border-r border-t" aria-hidden />
        <span className="portrait__tick bottom-[-6px] left-[-6px] border-b border-l" aria-hidden />
        <span className="portrait__tick bottom-[-6px] right-[-6px] border-b border-r" aria-hidden />
      </div>
      <figcaption className="t-mono mt-4 hidden items-center justify-between gap-3 text-[10px] text-faint md:flex">
        <span>{fig}</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1 animate-pulse rounded-full bg-accent" aria-hidden />
          REC
        </span>
      </figcaption>
    </figure>
  );
}

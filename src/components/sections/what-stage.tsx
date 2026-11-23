"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AutomateDemo, BuildDemo, AnalyseDemo, RunDemo } from "./what-demos";
import { cn } from "@/lib/cn";

type Item = { k: string; line: string; tag: string };
type Demo = Record<string, string> & { steps: string[] };

function DemoFor({ i, active, demo }: { i: number; active: boolean; demo: Demo }) {
  const { steps, ...copy } = demo;
  if (i === 0) return <AutomateDemo active={active} copy={copy} />;
  if (i === 1) return <BuildDemo active={active} copy={copy} />;
  if (i === 2) return <AnalyseDemo active={active} copy={copy} />;
  return <RunDemo active={active} copy={copy} steps={steps} />;
}

function Stage({ i, label, children, className }: { i: number; label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("card flex flex-col bg-sunken", className)}>
      <div className="t-mono flex items-center justify-between border-b border-line px-4 py-3 text-[10.5px] text-muted">
        <span>
          <span className="text-faint">live ·</span> 0{i + 1} {label}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
          running
        </span>
      </div>
      <div className="flex-1 p-5 md:p-6">{children}</div>
    </div>
  );
}

/**
 * Four disciplines. Desktop: list on the left, a sticky live stage on the right that
 * switches on hover/focus or as each row crosses the middle of the screen.
 * Mobile: each row carries its own demo, which runs while it is on screen.
 */
export function WhatStage({ items, demo }: { items: Item[]; demo: Demo }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState<boolean[]>(() => items.map(() => false));
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = rows.current.filter(Boolean) as HTMLLIElement[];
    // Middle band of the screen decides which discipline is "on".
    const band = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    // Visibility (mobile inline demos run only while on screen).
    const vis = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          const next = [...prev];
          for (const e of entries) next[Number((e.target as HTMLElement).dataset.i)] = e.isIntersecting;
          return next;
        });
      },
      { threshold: 0.25 },
    );
    els.forEach((el) => {
      band.observe(el);
      vis.observe(el);
    });
    return () => {
      band.disconnect();
      vis.disconnect();
    };
  }, []);

  return (
    <div className="mt-16 grid-12 gap-y-10 md:mt-24">
      <ol className="col-span-4 md:col-span-6" role="list">
        {items.map((it, i) => {
          const on = active === i;
          return (
            <li
              key={it.k}
              ref={(el) => {
                rows.current[i] = el;
              }}
              data-i={i}
              className="border-t border-line last:border-b"
            >
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className="group grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-3 py-7 text-left md:grid-cols-[3.5rem_1fr] md:py-9"
              >
                <span className={cn("t-mono transition-colors duration-500", on ? "text-accent" : "text-faint")}>0{i + 1}</span>
                <span>
                  <span
                    className={cn(
                      "block font-serif text-[clamp(2.75rem,6vw,5.75rem)] leading-[0.9] tracking-[-0.03em] transition-[color,transform] duration-700 ease-[var(--ease-out)]",
                      on ? "translate-x-0 text-text" : "text-text/50 group-hover:text-text/70 md:translate-x-[-4px]",
                    )}
                  >
                    {on ? <em className="italic">{it.k}</em> : it.k}
                    <span className={cn("text-accent transition-opacity duration-500", on ? "opacity-100" : "opacity-0")}>.</span>
                  </span>
                  <span
                    className={cn(
                      "mt-4 block max-w-[44ch] text-[16px] leading-relaxed transition-colors duration-500",
                      on ? "text-text/85" : "text-muted",
                    )}
                  >
                    {it.line}
                  </span>
                  <span className="t-mono mt-3 block text-[10.5px] text-faint">{it.tag}</span>
                </span>
              </button>
              {/* Mobile: inline demo */}
              <div className="pb-8 md:hidden">
                <Stage i={i} label={it.k} className="min-h-[300px]">
                  <DemoFor i={i} active={inView[i]} demo={demo} />
                </Stage>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop: sticky live stage */}
      <div className="col-span-6 col-start-7 hidden md:block">
        <div className="sticky top-[calc(var(--nav-h)+12vh)]">
          <Stage i={active} label={items[active].k} className="min-h-[420px]">
            <DemoFor key={active} i={active} active demo={demo} />
          </Stage>
          <div className="t-mono mt-4 flex gap-2" aria-hidden>
            {items.map((it, i) => (
              <span key={it.k} className={cn("h-px flex-1 transition-colors duration-500", i === active ? "bg-accent" : "bg-line-strong")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

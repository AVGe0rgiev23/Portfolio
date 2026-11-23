"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { PlaceholderText } from "@/components/ui/placeholder-text";

type Copy = {
  cells: Record<"data" | "llm" | "web" | "integrations" | "learning" | "tools", string>;
  sorted: string;
  tokens: string;
  streaming: string;
  assembling: string;
  learningList: string[];
  learningNote: string;
  toolsList: string[];
  summary: string;
};

/** True while the element is on screen (cells only animate when visible). */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Cell({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("card flex flex-col gap-5 bg-sunken p-5 md:p-6", className)}>
      <h3 className="t-mono text-muted">{title}</h3>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

/* Python & Data: a DataFrame that re-sorts itself (FLIP via transforms) */
const ROWS = [
  { name: "Burgas", orders: 128, revenue: 18420 },
  { name: "Sofia", orders: 214, revenue: 31260 },
  { name: "Varna", orders: 97, revenue: 14980 },
  { name: "Plovdiv", orders: 76, revenue: 9840 },
  { name: "Ruse", orders: 41, revenue: 5120 },
];
function DataCell({ copy }: { copy: Copy }) {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [desc, setDesc] = useState(true);
  useEffect(() => {
    if (!on || reduce()) return;
    const id = window.setInterval(() => setDesc((d) => !d), 2600);
    return () => clearInterval(id);
  }, [on]);
  const order = [...ROWS].sort((a, b) => (desc ? b.revenue - a.revenue : a.revenue - b.revenue));
  const ROW_H = 34;
  return (
    <Cell title={copy.cells.data} className="md:col-span-7">
      <div ref={ref} className="font-mono text-[12px]">
        <div className="t-mono grid grid-cols-[2rem_1fr_5rem_6rem] border-b border-line pb-2 text-[10px] text-faint">
          <span />
          <span>city</span>
          <span className="text-right">orders</span>
          <span className="text-right">revenue {desc ? "↓" : "↑"}</span>
        </div>
        <div className="relative" style={{ height: ROWS.length * ROW_H }}>
          {ROWS.map((r) => {
            const rank = order.indexOf(r);
            return (
              <div
                key={r.name}
                className="absolute inset-x-0 grid grid-cols-[2rem_1fr_5rem_6rem] items-center border-b border-dashed border-line transition-transform duration-700 ease-[var(--ease-out)]"
                style={{ height: ROW_H, transform: `translateY(${rank * ROW_H}px)` }}
              >
                <span className="text-faint">{rank}</span>
                <span className="text-text/90">{r.name}</span>
                <span className="text-right tabular-nums text-muted">{r.orders}</span>
                <span className={cn("text-right tabular-nums", rank === 0 ? "text-accent" : "text-text/80")}>
                  {r.revenue.toLocaleString("en-US")}
                </span>
              </div>
            );
          })}
        </div>
        <p className="t-mono mt-4 text-[10px] text-faint">
          df.sort_values(&quot;revenue&quot;, ascending={desc ? "False" : "True"}) · {copy.sorted} {desc ? "↓" : "↑"}
        </p>
      </div>
    </Cell>
  );
}

/* LLM: a streamed summary with a live token counter */
function LlmCell({ copy }: { copy: Copy }) {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const words = copy.summary.split(" ");
  const [n, setN] = useState(words.length);
  useEffect(() => {
    if (!on || reduce()) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = i >= words.length + 12 ? 0 : i + 1; // stream, hold, restart
      setN(Math.min(words.length, i));
    }, 90);
    return () => clearInterval(id);
  }, [on, words.length]);
  return (
    <Cell title={copy.cells.llm} className="md:col-span-5">
      <div ref={ref} className="flex flex-1 flex-col gap-4">
        <p className="min-h-[5.5em] text-[15px] leading-relaxed text-text/90">
          {words.slice(0, n).join(" ")}
          {n < words.length && <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-accent" aria-hidden />}
          <span className="sr-only">{copy.summary}</span>
        </p>
        <div className="t-mono mt-auto flex items-center justify-between border-t border-line pt-3 text-[10px] text-faint">
          <span className="flex items-center gap-2">
            <span className={cn("size-1.5 rounded-full", n < words.length ? "animate-pulse bg-accent" : "bg-text/40")} aria-hidden />
            {copy.streaming}
          </span>
          <span className="tabular-nums">
            {Math.round(n * 1.33)} {copy.tokens}
          </span>
        </div>
      </div>
    </Cell>
  );
}

/* Web: a component assembling itself, then resetting */
function WebCell({ copy }: { copy: Copy }) {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [k, setK] = useState(4);
  useEffect(() => {
    if (!on || reduce()) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % 7;
      setK(Math.min(4, i));
    }, 700);
    return () => clearInterval(id);
  }, [on]);
  const part = (idx: number) =>
    cn("transition-all duration-500 ease-[var(--ease-out)]", k > idx ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");
  return (
    <Cell title={copy.cells.web} className="md:col-span-4">
      <div ref={ref} className="flex flex-1 flex-col justify-center gap-3">
        <div className="rounded-[2px] border border-dashed border-line-strong p-4">
          <div className={cn("flex items-center gap-3", part(0))}>
            <span className="size-8 rounded-full bg-text/15" />
            <span className="h-2.5 w-24 rounded-[1px] bg-text/40" />
          </div>
          <div className={cn("mt-4 flex flex-col gap-2", part(1))}>
            <span className="h-2 w-full rounded-[1px] bg-text/15" />
            <span className="h-2 w-4/5 rounded-[1px] bg-text/15" />
          </div>
          <div className={cn("mt-4 flex items-center justify-between", part(2))}>
            <span className="t-mono text-[10px] text-faint">&lt;Card /&gt;</span>
            <span className={cn("h-7 w-20 rounded-[2px] bg-accent", part(3))} />
          </div>
        </div>
        <p className="t-mono text-[10px] text-faint">{copy.assembling} · {Math.min(4, k)}/4</p>
      </div>
    </Cell>
  );
}

/* Integrations: hub and spokes with flowing lines */
function IntegrationsCell({ copy }: { copy: Copy }) {
  const nodes = [
    ["Viber", 40, 30],
    ["Email", 40, 110],
    ["Meta", 40, 190],
    ["Resend", 280, 30],
    ["Sheets", 280, 110],
    ["LLM", 280, 190],
  ] as const;
  return (
    <Cell title={copy.cells.integrations} className="md:col-span-5">
      <svg viewBox="0 0 320 220" className="w-full" aria-hidden>
        {nodes.map(([n, x, y]) => (
          <g key={n}>
            <path d={`M${x} ${y} C ${(x + 160) / 2} ${y}, ${(x + 160) / 2} 110, 160 110`} fill="none" stroke="rgba(237,232,223,.12)" />
            <path
              d={`M${x} ${y} C ${(x + 160) / 2} ${y}, ${(x + 160) / 2} 110, 160 110`}
              fill="none"
              stroke="#FF5A1F"
              strokeWidth={1.2}
              className="arch__flow"
            />
          </g>
        ))}
        <rect x={118} y={94} width={84} height={32} rx={2} fill="#121214" stroke="rgba(237,232,223,.3)" />
        <text x={160} y={114} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }} fontSize={10} fill="#EDE8DF" letterSpacing="0.08em">
          AGILITY
        </text>
        {nodes.map(([n, x, y]) => (
          <g key={`l-${n}`}>
            <rect x={x - 32} y={y - 11} width={64} height={22} rx={2} fill="#0B0B0C" stroke="rgba(237,232,223,.16)" />
            <text x={x} y={y + 4} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }} fontSize={9.5} fill="#8A867F" letterSpacing="0.06em">
              {n.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </Cell>
  );
}

export function CapabilitiesBento({ copy }: { copy: Copy }) {
  return (
    <div className="mt-16 grid gap-3 md:mt-24 md:grid-cols-12">
      <DataCell copy={copy} />
      <LlmCell copy={copy} />
      <IntegrationsCell copy={copy} />
      <WebCell copy={copy} />
      <Cell title={copy.cells.learning} className="md:col-span-3">
        <ul className="flex flex-col gap-3 text-[14.5px] text-text/90">
          {copy.learningList.map((l) => (
            <li key={l} className="flex items-start gap-3">
              <span className="relative mt-[7px] flex size-1.5 shrink-0" aria-hidden>
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.4s]" />
                <span className="relative size-1.5 rounded-full bg-accent" />
              </span>
              <PlaceholderText>{l}</PlaceholderText>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-5 text-[13px] italic text-muted">{copy.learningNote}</p>
      </Cell>
      <Cell title={copy.cells.tools} className="md:col-span-12">
        <ul className="flex flex-wrap gap-2">
          {copy.toolsList.map((tool) => (
            <li key={tool} className="t-mono rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-text/85">
              <PlaceholderText>{tool}</PlaceholderText>
            </li>
          ))}
        </ul>
      </Cell>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Steps through a timeline while `active`, then loops. step 0 = empty, step n = n stages shown.
 * Reduced motion jumps straight to the final state.
 */
function useSequence(delays: number[], active: boolean, hold = 2600) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    if (reduced()) {
      id = window.setTimeout(() => setStep(delays.length), 0);
      return () => clearTimeout(id);
    }
    let i = 0;
    const next = () => {
      if (i < delays.length) {
        i += 1;
        setStep(i);
        id = window.setTimeout(next, i < delays.length ? delays[i] : hold);
      } else {
        i = 0;
        setStep(0);
        id = window.setTimeout(next, delays[0]);
      }
    };
    id = window.setTimeout(next, delays[0]);
    return () => clearTimeout(id);
  }, [active, delays, hold]);
  return step;
}

/** Types text in once mounted. */
function Typed({ text, cps = 60, className }: { text: string; cps?: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced()) {
      const id = window.setTimeout(() => setN(text.length), 0);
      return () => clearTimeout(id);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(text.length, Math.floor(((now - t0) / 1000) * cps));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cps]);
  return (
    <span className={className}>
      {text.slice(0, n)}
      <span className="opacity-0">{text.slice(n)}</span>
    </span>
  );
}

const Appear = ({ on, children, className }: { on: boolean; children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "transition-[opacity,transform] duration-700 ease-[var(--ease-out)]",
      on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      className,
    )}
  >
    {children}
  </div>
);

type Copy = Record<string, string> & { steps?: never };

/* ── 01 Automate: message in → JSON → routed ─────────────────────────── */
const AUTOMATE = [300, 2200, 380, 380, 380, 380, 380, 700, 500];
export function AutomateDemo({ active, copy }: { active: boolean; copy: Copy }) {
  const step = useSequence(AUTOMATE, active);
  const fields: [string, string][] = [
    ["intent", '"quote"'],
    ["product", '"office chair"'],
    ["quantity", "40"],
    ["city", '"Varna"'],
    ["deadline", '"before the 15th"'],
  ];
  return (
    <div className="flex h-full flex-col gap-4">
      <Appear on={step >= 1}>
        <div className="t-mono mb-2 text-[10px] text-faint">{copy.inbound}</div>
        <div className="max-w-[92%] rounded-[2px] border border-line bg-raised px-4 py-3 text-[14px] leading-snug text-text/90">
          {step >= 1 && <Typed text={copy.message} cps={70} />}
        </div>
      </Appear>
      <Appear on={step >= 3}>
        <div className="t-mono mb-2 flex items-center gap-2 text-[10px] text-faint">
          <span className="text-accent">↓</span> {copy.extracted}
        </div>
        <pre className="rounded-[2px] border border-line bg-sunken px-4 py-3 font-mono text-[12px] leading-[1.7]">
          <span className="text-muted">{"{"}</span>
          {fields.map(([k, v], i) => (
            <span
              key={k}
              className={cn("block pl-4 transition-opacity duration-500", step >= 3 + i ? "opacity-100" : "opacity-0")}
            >
              <span className="text-[#BDB7AD]">{k}</span>
              <span className="text-muted">: </span>
              <span className="text-[#E9C9A8]">{v}</span>
              <span className="text-muted">,</span>
            </span>
          ))}
          <span className="text-muted">{"}"}</span>
        </pre>
      </Appear>
      <div className="mt-auto flex flex-wrap gap-2">
        <Appear on={step >= 8}>
          <span className="t-mono inline-flex h-7 items-center gap-2 rounded-full border border-accent/50 px-3 text-[10.5px] text-text">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {copy.routed}
          </span>
        </Appear>
        <Appear on={step >= 9}>
          <span className="t-mono inline-flex h-7 items-center gap-2 rounded-full border border-line-strong px-3 text-[10.5px] text-muted">
            ✓ {copy.draft}
          </span>
        </Appear>
      </div>
    </div>
  );
}

/* ── 02 Build: assistant answers from your documents ─────────────────── */
const BUILD = [300, 1200, 1500, 400];
export function BuildDemo({ active, copy }: { active: boolean; copy: Copy }) {
  const step = useSequence(BUILD, active, 3400);
  return (
    <div className="flex h-full flex-col gap-4">
      <Appear on={step >= 1} className="self-end">
        <div className="max-w-[80%] rounded-[2px] bg-text px-4 py-3 text-[14px] leading-snug text-bg">{copy.chatQ}</div>
      </Appear>
      <Appear on={step === 2} className={cn(step > 2 && "hidden")}>
        <div className="t-mono flex items-center gap-2 text-[10.5px] text-faint">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </span>
          {copy.typing}
        </div>
      </Appear>
      <Appear on={step >= 3}>
        <div className="max-w-[88%] rounded-[2px] border border-line bg-raised px-4 py-3 text-[14px] leading-snug text-text/90">
          {step >= 3 && <Typed text={copy.chatA} cps={55} />}
        </div>
      </Appear>
      <Appear on={step >= 4}>
        <span className="t-mono inline-flex h-6 items-center rounded-[2px] border border-line px-2 text-[10px] text-muted">
          ↳ {copy.source}
        </span>
      </Appear>
    </div>
  );
}

/* ── 03 Analyse: least-squares fit, computed from the points shown ───── */
function points() {
  // Deterministic sample around y = 0.62x + 0.18 with noise.
  let s = 11;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 26 }, () => {
    const x = 0.05 + rnd() * 0.9;
    const y = Math.min(0.95, Math.max(0.05, 0.62 * x + 0.18 + (rnd() - 0.5) * 0.22));
    return [x, y] as const;
  });
}
const PTS = points();
const FIT = (() => {
  const n = PTS.length;
  const mx = PTS.reduce((a, p) => a + p[0], 0) / n;
  const my = PTS.reduce((a, p) => a + p[1], 0) / n;
  const sxy = PTS.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0);
  const sxx = PTS.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
  const slope = sxy / sxx;
  const icpt = my - slope * mx;
  const ssTot = PTS.reduce((a, p) => a + (p[1] - my) ** 2, 0);
  const ssRes = PTS.reduce((a, p) => a + (p[1] - (slope * p[0] + icpt)) ** 2, 0);
  return { slope, icpt, r2: 1 - ssRes / ssTot, my };
})();
const ANALYSE = [200, 900, 1400];
export function AnalyseDemo({ active, copy }: { active: boolean; copy: Copy }) {
  const pts = PTS;
  const fit = FIT;
  const step = useSequence(ANALYSE, active, 3200);
  const k = step >= 2 ? 1 : 0; // 0 = flat mean line, 1 = fitted
  const y0 = k ? fit.icpt : fit.my;
  const y1 = k ? fit.slope + fit.icpt : fit.my;
  const W = 320;
  const H = 200;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="t-mono flex items-center justify-between text-[10px] text-faint">
        <span>
          <span className="text-accent">●</span> {copy.fit}
        </span>
        <span>n = {pts.length}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label={copy.fit}>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="rgba(237,232,223,.06)" />
        ))}
        <line x1={0} x2={W} y1={H} y2={H} stroke="rgba(237,232,223,.16)" />
        <line x1={0} x2={0} y1={0} y2={H} stroke="rgba(237,232,223,.16)" />
        {pts.map(([x, y], i) => (
          <circle
            key={i}
            cx={x * W}
            cy={H - y * H}
            r={2.6}
            fill="#EDE8DF"
            style={{
              opacity: step >= 1 ? 0.75 : 0,
              transition: `opacity .5s ${i * 25}ms`,
            }}
          />
        ))}
        <line
          x1={0}
          x2={W}
          y1={H - y0 * H}
          y2={H - y1 * H}
          stroke="#FF5A1F"
          strokeWidth={1.5}
          style={{ transition: "all 1.3s cubic-bezier(0.22,1,0.36,1)", opacity: step >= 1 ? 1 : 0 }}
        />
      </svg>
      <div className="t-mono mt-auto grid grid-cols-3 gap-2 text-[10.5px]">
        {[
          ["slope", fit.slope.toFixed(2)],
          ["intercept", fit.icpt.toFixed(2)],
          ["R²", fit.r2.toFixed(2)],
        ].map(([l, v]) => (
          <div key={l} className="border-t border-line pt-2">
            <div className="text-faint">{l}</div>
            <div className={cn("mt-1 text-[15px] tabular-nums transition-opacity duration-700", step >= 3 ? "text-text" : "text-faint")}>
              {step >= 3 ? v : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 04 Run: the agency's engagement ledger ticking forward ──────────── */
const RUN = [300, 650, 650, 650, 900];
export function RunDemo({ active, copy, steps }: { active: boolean; copy: Copy; steps: string[] }) {
  const step = useSequence(RUN, active, 2400);
  const done = Math.max(0, step - 1);
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="t-mono flex items-center justify-between text-[10px] text-faint">
        <span>{copy.ledger}</span>
        <span className="tabular-nums">
          {String(Math.min(done, steps.length)).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
      </div>
      <div className="h-px w-full bg-line">
        <div
          className="h-px bg-accent transition-[width] duration-700 ease-[var(--ease-out)]"
          style={{ width: `${(Math.min(done, steps.length) / steps.length) * 100}%` }}
        />
      </div>
      <ol className="flex flex-col">
        {steps.map((s, i) => {
          const isDone = i < done;
          const isNow = i === done && step > 0;
          return (
            <li key={s} className="flex items-center justify-between border-b border-dashed border-line py-3 text-[14px]">
              <span className={cn("transition-colors duration-500", isDone ? "text-text" : isNow ? "text-text" : "text-faint")}>
                <span className="t-mono mr-3 text-[10px] text-faint">0{i + 1}</span>
                {s}
              </span>
              <span className="t-mono text-[11px]">
                {isDone ? (
                  <span className="text-muted">✓</span>
                ) : isNow ? (
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
                ) : (
                  <span className="text-faint">○</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

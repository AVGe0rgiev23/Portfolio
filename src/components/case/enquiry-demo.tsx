"use client";

import { useEffect, useMemo, useState } from "react";
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

export type EnquiryDemoCopy = {
  inbound: string;
  message: string;
  extracted: string;
  fields: [string, string][];
  routed: string;
  draft: string;
};

/* ── Message in → structured fields → routed + drafted ──────────────── */
/**
 * Illustrates the Unified Enquiry Engine flow on its case-study page until a real
 * screen recording exists. Loops while mounted; reduced motion shows the final state.
 */
export function EnquiryDemo({ copy }: { copy: EnquiryDemoCopy }) {
  const fields = copy.fields;
  // message → pause → one beat per field → routed → drafted
  const n = fields.length;
  const sequence = useMemo(() => [300, 2200, ...Array.from({ length: n }, () => 380), 700, 500], [n]);
  const step = useSequence(sequence, true);
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
        <Appear on={step >= n + 3}>
          <span className="t-mono inline-flex h-7 items-center gap-2 rounded-full border border-accent/50 px-3 text-[10.5px] text-text">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {copy.routed}
          </span>
        </Appear>
        <Appear on={step >= n + 4}>
          <span className="t-mono inline-flex h-7 items-center gap-2 rounded-full border border-line-strong px-3 text-[10.5px] text-muted">
            ✓ {copy.draft}
          </span>
        </Appear>
      </div>
    </div>
  );
}

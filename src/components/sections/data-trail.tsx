"use client";

import { useEffect, useRef } from "react";

const TOKENS = [
  '{ intent: "quote" }',
  "0.92",
  'city: "Varna"',
  "urgency: high",
  "→ office.burgas",
  "conf 0.87",
  'channel: "viber"',
  "dims: 120×90",
  "lead#0417",
  "parse ✓",
  '{ product: "railing" }',
  "0.78",
  "route()",
  "status: 200",
  "tokens: 412",
];
const POOL = 16;
const SPACING = 72; // px of pointer travel between tokens
const LIFE = 1100; // ms

/**
 * "Data trail": over the work section, the cursor leaves fading mono tokens,
 * as if what it passes over is being parsed. Desktop, fine pointer, motion allowed.
 */
export function DataTrail() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;

    const nodes = Array.from({ length: POOL }, () => {
      const n = document.createElement("span");
      n.className = "data-trail__tok t-mono";
      el.appendChild(n);
      return n;
    });
    let slot = 0;
    let word = 0;
    let lx = -999;
    let ly = -999;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (Math.hypot(x - lx, y - ly) < SPACING) return;
      lx = x;
      ly = y;
      const n = nodes[slot];
      slot = (slot + 1) % POOL;
      n.textContent = TOKENS[word];
      word = (word + 1) % TOKENS.length;
      n.getAnimations().forEach((a) => a.cancel());
      n.style.left = `${x + 14}px`;
      n.style.top = `${y + 10}px`;
      n.animate(
        [
          { opacity: 0, transform: "translate3d(0,4px,0)" },
          { opacity: 1, transform: "translate3d(0,0,0)", offset: 0.12 },
          { opacity: 0, transform: "translate3d(0,-14px,0)" },
        ],
        { duration: LIFE, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      nodes.forEach((n) => n.remove());
    };
  }, []);

  return <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden" />;
}

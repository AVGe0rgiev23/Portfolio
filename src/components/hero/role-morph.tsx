"use client";

import { useEffect, useState } from "react";

const GLYPHS = "▮▯/\_-=+*#01{}<>[]:;";
const HOLD = 3200;
const SCRAMBLE = 750;

/**
 * Cycles roles. Each change scrambles through mono glyphs left→right, then settles into serif.
 * Screen readers get the full list once (sr-only); the animated text is aria-hidden.
 */
export function RoleMorph({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState<{ c: string; done: boolean }[] | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || roles.length < 2) return;
    let raf = 0;
    let timer = 0;
    let i = 0;

    const morph = () => {
      i = (i + 1) % roles.length;
      const target = roles[i];
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / SCRAMBLE);
        const resolved = Math.floor(p * target.length);
        setChars(
          [...target].map((c, k) =>
            k < resolved || c === " "
              ? { c, done: true }
              : { c: GLYPHS[(Math.random() * GLYPHS.length) | 0], done: false },
          ),
        );
        if (p < 1) raf = requestAnimationFrame(step);
        else {
          setChars(null);
          setIndex(i);
          timer = window.setTimeout(morph, HOLD);
        }
      };
      raf = requestAnimationFrame(step);
    };

    timer = window.setTimeout(morph, HOLD);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [roles]);

  return (
    <>
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden className="inline-block whitespace-nowrap">
        {chars
          ? chars.map((ch, k) =>
              ch.done ? (
                <span key={k}>{ch.c}</span>
              ) : (
                <span key={k} className="font-mono text-[0.62em] not-italic text-accent">
                  {ch.c}
                </span>
              ),
            )
          : roles[index]}
      </span>
    </>
  );
}

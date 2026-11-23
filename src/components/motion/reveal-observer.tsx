"use client";

import { useEffect } from "react";

type State = { phase: "armed" | "in"; holds: Animation[] };
// Module-level so StrictMode's mount → unmount → mount keeps what it learned.
const states = new WeakMap<Element, State>();
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * One observer for the whole page. Elements with [data-reveal="fade" | "lines"] are
 * only hidden if JS runs AND they are below the fold, so server-rendered content is
 * always readable and nothing above the fold waits on animation.
 *
 * Hiding uses the Web Animations API, never DOM attributes, so it can run before React
 * finishes hydrating without causing hydration mismatches.
 */
export function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const parts = (el: HTMLElement) =>
      el.dataset.reveal === "lines" ? Array.from(el.querySelectorAll<HTMLElement>(".reveal > span")) : [el];

    const frames = (el: HTMLElement): [Keyframe, Keyframe] => {
      if (reduce) return [{ opacity: 0 }, { opacity: 1 }];
      return el.dataset.reveal === "lines"
        ? [{ transform: "translate3d(0,108%,0)" }, { transform: "translate3d(0,0,0)" }]
        : [{ opacity: 0, transform: "translate3d(0,28px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }];
    };

    const arm = (el: HTMLElement) => {
      const [from] = frames(el);
      const holds = parts(el).map((p) => p.animate([from, from], { duration: 1, fill: "forwards" }));
      states.set(el, { phase: "armed", holds });
    };

    const show = (el: HTMLElement) => {
      const s = states.get(el);
      if (!s || s.phase === "in") return;
      s.phase = "in";
      const [from, to] = frames(el);
      const d = Number(getComputedStyle(el).getPropertyValue("--d")) || 0;
      const lines = el.dataset.reveal === "lines";
      parts(el).forEach((p, i) => {
        p.animate([from, to], {
          duration: reduce ? 400 : lines ? 1100 : 1000,
          delay: (lines ? i * 90 : d * 80) + 40,
          easing: EASE,
          fill: "backwards",
        });
      });
      s.holds.forEach((a) => a.cancel());
      s.holds = [];
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );

    const scan = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const s = states.get(el);
        if (s?.phase === "in") return;
        if (!s) {
          if (el.getBoundingClientRect().top < vh * 0.92) {
            states.set(el, { phase: "in", holds: [] });
            return;
          }
          arm(el);
        }
        io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

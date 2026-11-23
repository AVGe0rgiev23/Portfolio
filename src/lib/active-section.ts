"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny global store: which [data-island] section is under the reading line.
 * Shared by the status island and the ledger nav.
 */
let current = "hero";
const listeners = new Set<() => void>();
let observer: IntersectionObserver | null = null;
let mutation: MutationObserver | null = null;

function set(next: string) {
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
}

function observeAll() {
  if (!observer) return;
  document.querySelectorAll<HTMLElement>("[data-island]").forEach((el) => observer!.observe(el));
}

function start() {
  if (observer || typeof window === "undefined") return;
  const visible = new Map<Element, number>();
  // A thin band ~40% down the viewport acts as the "reading line".
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.set(e.target, e.boundingClientRect.top);
        else visible.delete(e.target);
      }
      let best: Element | null = null;
      let bestTop = -Infinity;
      visible.forEach((top, el) => {
        if (top > bestTop) {
          bestTop = top;
          best = el;
        }
      });
      if (best) set((best as HTMLElement).dataset.island ?? "hero");
    },
    { rootMargin: "-40% 0px -59% 0px" },
  );
  observeAll();
  mutation = new MutationObserver(observeAll);
  mutation.observe(document.body, { childList: true, subtree: true });
}

function subscribe(cb: () => void) {
  start();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useActiveSection() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "hero",
  );
}

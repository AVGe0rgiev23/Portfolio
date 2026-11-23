"use client";

import { Suspense, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Module-level store so any component can reach the single Lenis instance.
let instance: Lenis | null = null;
const listeners = new Set<() => void>();
const publish = (next: Lenis | null) => {
  instance = next;
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useLenis = () =>
  useSyncExternalStore(
    subscribe,
    () => instance,
    () => null,
  );

/** Scroll to an in-page id with Lenis when available, native otherwise. */
export function scrollToId(lenis: Lenis | null, id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch devices keep native scrolling: it is already smooth and Lenis would fight momentum.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onBoot = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start());
    window.addEventListener("ag:booting", onBoot);
    if (document.documentElement.classList.contains("is-booting")) lenis.stop();
    publish(lenis);

    return () => {
      window.removeEventListener("ag:booting", onBoot);
      gsap.ticker.remove(tick);
      lenis.destroy();
      publish(null);
    };
  }, []);

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <RouteScrollReset />
      </Suspense>
    </>
  );
}

/** New route: start at the top (or at the #hash), without Lenis animating from the old position. */
function RouteScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    const lenis = instance;
    if (!lenis) return;
    const id = window.location.hash.slice(1);
    const raf = requestAnimationFrame(() => {
      const el = id ? document.getElementById(id) : null;
      lenis.scrollTo(el ?? 0, { immediate: true, force: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}

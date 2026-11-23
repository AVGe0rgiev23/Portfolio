"use client";

import { useEffect, useRef, useState } from "react";
import { pickLayout } from "@/components/hero/field-layout";
import { cn } from "@/lib/cn";

type Props = {
  /** 404 mode: every particle stays scattered. */
  scatter?: boolean;
  className?: string;
};

/**
 * Mounts the Signal Field after first paint, on idle. Falls back to the static
 * poster (rendered by the server underneath) when:
 * reduced motion · Save-Data · ≤2 cores · no WebGL · any shader error.
 */
export function SignalCanvas({ scatter = false, className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowPower =
      nav.connection?.saveData === true || (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
    if (reduce || lowPower) return;

    let disposed = false;
    let cleanup = () => {};

    const boot = async () => {
      const { SignalEngine } = await import("./signal-engine");
      if (disposed) return;
      const isDesktop = window.innerWidth >= 768;
      const fine = window.matchMedia("(pointer: fine)").matches;
      let engine: InstanceType<typeof SignalEngine>;
      try {
        engine = new SignalEngine(el, {
          count: isDesktop ? 9000 : 3200,
          maxDpr: 1.5,
          layout: pickLayout(window.innerWidth),
          scatter,
        });
      } catch {
        return; // poster stays
      }
      setLive(true);

      const host = el.closest<HTMLElement>(".field") ?? el.parentElement ?? el;
      host.setAttribute("data-live", "");
      let visible = true;
      let pageVisible = !document.hidden;
      const sync = () => (visible && pageVisible ? engine.start() : engine.stop());

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        sync();
      });
      io.observe(host);

      const onVis = () => {
        pageVisible = !document.hidden;
        sync();
      };
      const frame = host.querySelector<HTMLElement>(".portrait__frame");
      const measureEnd = () => {
        if (!frame) return;
        const h = host.getBoundingClientRect();
        engine.setLineEnd((frame.getBoundingClientRect().left - h.left) / Math.max(1, h.width));
      };
      const onResize = () => {
        engine.setLayout(pickLayout(window.innerWidth));
        engine.resize();
        measureEnd();
      };
      measureEnd();
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        engine.setMouse((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      };
      const onLeave = () => engine.setMouse(null);
      const onScroll = () => {
        const r = host.getBoundingClientRect();
        engine.setScroll(-r.top / Math.max(1, r.height));
      };

      const ro = new ResizeObserver(onResize);
      ro.observe(el);
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("scroll", onScroll, { passive: true });
      if (fine) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
      }
      onScroll();
      sync();

      cleanup = () => {
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        engine.destroy();
        host.removeAttribute("data-live");
      };
    };

    // After first paint and off the critical path.
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => void boot(), { timeout: 1200 });

    return () => {
      disposed = true;
      cic(id as number);
      cleanup();
    };
  }, [scatter]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={cn(
        "absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-[var(--ease-out)]",
        live ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}

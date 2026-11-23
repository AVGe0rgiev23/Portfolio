"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

/**
 * Desktop-only custom cursor: an ember dot + a ring that eases behind it.
 * Over interactive elements the ring grows and shows a mono label:
 * [data-cursor] wins, then "copy" / "open" (external) / "view".
 * Off for touch, coarse pointers and reduced motion; text fields keep the I-beam.
 */
export function Cursor() {
  const t = useTranslations("cursor");
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let raf = 0;
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.18;
      lag.y += (pos.y - lag.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      html.dataset.cursorVisible = "1";
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor], [role=button], label, summary");
      const field = (e.target as HTMLElement).closest("input, textarea, select, [contenteditable]");
      let text = "";
      if (el && !field) {
        const a = el as HTMLAnchorElement;
        text =
          el.dataset.cursor ??
          (el.closest("[data-cursor=copy]") ? t("copy") : a.target === "_blank" || a.hasAttribute?.("download") ? t("open") : t("view"));
        if (text === "copy") text = t("copy");
      }
      html.dataset.cursor = field ? "text" : el ? "hover" : "";
      if (label.current) label.current.textContent = text;
    };
    const onLeave = () => (html.dataset.cursorVisible = "0");
    const onDown = () => (html.dataset.cursorDown = "1");
    const onUp = () => (html.dataset.cursorDown = "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [t]);

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label t-mono" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}

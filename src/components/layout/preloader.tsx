"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const DURATION = 650; // counter; + 450ms fade ≈ 1.1s total
const FADE = 450;

/**
 * First visit per tab only (sessionStorage). The decision is made before paint by the
 * inline boot script in the root layout, so return visits never flash this.
 */
export function Preloader() {
  const t = useTranslations("preloader");
  const [count, setCount] = useState(0);
  const [typed, setTyped] = useState(0);
  const done = useRef(false);
  const full = `${t("boot")} …`;

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("is-booting")) return;
    window.dispatchEvent(new CustomEvent("ag:booting", { detail: true }));

    let raf = 0;
    const start = performance.now();

    const finish = () => {
      if (done.current) return;
      done.current = true;
      cancelAnimationFrame(raf);
      setCount(100);
      setTyped(full.length);
      try {
        sessionStorage.setItem("ag:booted", "1");
      } catch {}
      html.classList.add("is-unbooting");
      // Same frame: the hero lines + ruled grid start revealing while the loader fades.
      requestAnimationFrame(() => {
        html.classList.remove("is-booting", "is-ruling");
        html.classList.add("is-booted", "is-ruled");
        window.dispatchEvent(new CustomEvent("ag:booting", { detail: false }));
      });
      window.setTimeout(() => html.classList.remove("is-unbooting"), FADE + 50);
      removeListeners();
    };

    const loop = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      setTyped(Math.min(full.length, Math.ceil((p / 0.65) * full.length)));
      if (p < 1) raf = requestAnimationFrame(loop);
      else finish();
    };
    raf = requestAnimationFrame(loop);

    const skip = () => finish();
    const opts = { passive: true } as const;
    const removeListeners = () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip, opts);
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchstart", skip, opts);

    return () => {
      cancelAnimationFrame(raf);
      removeListeners();
    };
  }, [full]);

  return (
    <div className="preloader" role="status" aria-live="off" aria-label={t("boot")}>
      <div className="frame flex w-full flex-col gap-4 pb-[clamp(24px,5vh,56px)]">
        <div className="relative h-px w-full bg-line">
          <div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${count}%`, boxShadow: "0 0 12px rgba(255,90,31,.6)" }}
          />
        </div>
        <div className="t-mono flex items-baseline justify-between gap-6 text-muted">
          <span>
            <span className="text-accent">›</span> {full.slice(0, typed)}
            <span className="preloader__caret" aria-hidden />
          </span>
          <span className="tabular-nums text-text">
            {String(count).padStart(3, "0")}
            <span className="text-faint"> / 100</span>
          </span>
        </div>
        <p className="t-mono text-faint">{t("skip")}</p>
      </div>
    </div>
  );
}

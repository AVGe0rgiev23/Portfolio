"use client";

import { useEffect } from "react";

/**
 * First visit per tab: the inline boot script in the root layout holds the hero lines and
 * ruled grid in their "before" state. This releases them on the first frame, so the hero
 * animates in immediately, with no loading screen in front of it.
 */
export function Entrance() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("is-booting")) return;
    try {
      sessionStorage.setItem("ag:booted", "1");
    } catch {}
    const id = requestAnimationFrame(() => {
      html.classList.remove("is-booting", "is-ruling");
      html.classList.add("is-booted", "is-ruled");
      window.dispatchEvent(new CustomEvent("ag:booting", { detail: false }));
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}

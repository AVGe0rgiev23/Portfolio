"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, inline, preload="none". Plays only while on screen and while its dossier
 * row is open (hover/focus on desktop, always on touch). Paused for reduced motion.
 */
export function DossierVideo({ webm, mp4, poster, label }: { webm?: string; mp4?: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const row = v.closest(".dossier");
    let inView = false;
    let open = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const sync = () => (inView && open ? void v.play().catch(() => {}) : v.pause());
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(v);
    const on = () => ((open = true), sync());
    const off = () => ((open = false), sync());
    row?.addEventListener("pointerenter", on);
    row?.addEventListener("pointerleave", off);
    row?.addEventListener("focusin", on);
    row?.addEventListener("focusout", off);
    return () => {
      io.disconnect();
      row?.removeEventListener("pointerenter", on);
      row?.removeEventListener("pointerleave", off);
      row?.removeEventListener("focusin", on);
      row?.removeEventListener("focusout", off);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="aspect-[16/10] w-full rounded-[2px] border border-line bg-sunken object-cover"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
    >
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
}

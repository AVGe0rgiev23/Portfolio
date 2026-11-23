"use client";

import { useLenis } from "@/components/motion/smooth-scroll";
import { openPalette } from "./nav";

export function FooterActions({ labels }: { labels: { top: string; palette: string } }) {
  const lenis = useLenis();
  return (
    <div className="t-mono flex items-center gap-3">
      <button
        type="button"
        onClick={openPalette}
        className="t-mono inline-flex h-10 items-center gap-2 rounded-[2px] border border-line-strong px-3 text-muted transition-colors hover:text-text"
      >
        ⌘K <span className="hidden sm:inline">{labels.palette}</span>
      </button>
      <button
        type="button"
        onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
        className="t-mono inline-flex h-10 items-center gap-2 rounded-[2px] border border-line-strong px-3 text-muted transition-colors hover:text-text"
      >
        {labels.top} ↑
      </button>
    </div>
  );
}

"use client";

import { site, isSet } from "@/content/site";
import { PlaceholderText } from "./placeholder-text";
import { cn } from "@/lib/cn";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("ag:toast", { detail: message }));
}

export async function copyEmail(copiedLabel: string) {
  if (!isSet(site.email)) return;
  try {
    await navigator.clipboard.writeText(site.email);
    toast(copiedLabel);
  } catch {
    window.location.href = `mailto:${site.email}`;
  }
}

/** Email address as a button: click copies it and shows a "copied ✓" toast. */
export function CopyEmail({ copied, label, className }: { copied: string; label: string; className?: string }) {
  if (!isSet(site.email)) return <PlaceholderText>{site.email}</PlaceholderText>;
  return (
    <button
      type="button"
      onClick={() => copyEmail(copied)}
      data-cursor="copy"
      aria-label={`${label}: ${site.email}`}
      className={cn("group inline-flex items-center gap-3 text-left", className)}
    >
      <span className="underline decoration-line-strong underline-offset-[6px] transition-colors group-hover:decoration-accent">
        {site.email}
      </span>
      <span className="t-mono text-[10px] text-faint transition-colors group-hover:text-accent">{label}</span>
    </button>
  );
}

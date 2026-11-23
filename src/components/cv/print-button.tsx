"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="t-mono inline-flex h-10 items-center rounded-[2px] border border-line-strong px-4 text-text hover:border-text/50"
    >
      {label}
    </button>
  );
}

import { cn } from "@/lib/cn";

/** `[ 02 ]   SELECTED WORK   ———————   2025—2026` */
export function SectionIndex({
  n,
  label,
  meta,
  className,
}: {
  n: string;
  label: string;
  meta?: string;
  className?: string;
}) {
  return (
    <div className={cn("t-mono flex items-center gap-4 text-muted md:gap-6", className)}>
      <span className="text-text">
        <span className="text-faint">[</span> {n} <span className="text-faint">]</span>
      </span>
      <span className="min-w-0 truncate">{label}</span>
      <span className="h-px flex-1 bg-line" aria-hidden />
      {meta && <span className="hidden whitespace-nowrap text-faint sm:inline">{meta}</span>}
    </div>
  );
}

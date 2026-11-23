import type { ReactNode } from "react";
import { SectionIndex } from "./section-index";
import { cn } from "@/lib/cn";

/** Index row + masked serif headline + optional lede. Used by every numbered section. */
export function SectionHead({
  n,
  label,
  meta,
  title,
  lede,
  id,
  className,
}: {
  n: string;
  label: string;
  meta?: string;
  title: ReactNode;
  lede?: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-10 md:gap-14", className)}>
      <SectionIndex n={n} label={label} meta={meta} />
      <div className="grid-12 gap-y-6">
        <h2 id={id} className="t-h2 col-span-4 md:col-span-8" data-reveal="lines">
          <span className="reveal">
            <span>{title}</span>
          </span>
        </h2>
        {lede && (
          <p
            className="t-lede col-span-4 self-end md:col-span-4 md:col-start-9"
            data-reveal="fade"
            style={{ ["--d" as string]: 2 }}
          >
            {lede}
          </p>
        )}
      </div>
    </header>
  );
}

import { Fragment } from "react";
import { PLACEHOLDER, SHOW_PLACEHOLDERS, clean, isPlaceholder } from "@/content/types";

/**
 * Renders text containing [[PLACEHOLDERS]].
 * Dev: each placeholder is a visible dashed ember marker. Production: placeholders are removed.
 */
export function PlaceholderText({ children }: { children: string }) {
  if (!SHOW_PLACEHOLDERS) return <>{clean(children)}</>;
  const parts = children.split(PLACEHOLDER);
  return (
    <>
      {parts.map((part, i) =>
        isPlaceholder(part) ? (
          <span key={i} className="ph" title="Placeholder — fill in before launch">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

import { Fragment } from "react";
import { PLACEHOLDER, isPlaceholder } from "@/content/types";

/** Renders text, wrapping any [[PLACEHOLDER]] in a visible dashed ember marker. */
export function PlaceholderText({ children }: { children: string }) {
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

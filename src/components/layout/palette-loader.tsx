"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Keeps cmdk out of the initial bundle. Listens for ⌘K / Ctrl+K and the
 * "ag:palette" event, loads the palette on first use, then hands over to it.
 */
export function PaletteLoader() {
  const [Palette, setPalette] = useState<ComponentType<{ initialOpen?: boolean }> | null>(null);

  useEffect(() => {
    if (Palette) return;
    let loading = false;
    const load = () => {
      if (loading) return;
      loading = true;
      import("./command-palette").then((m) => setPalette(() => m.CommandPalette));
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        load();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("ag:palette", load);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ag:palette", load);
    };
  }, [Palette]);

  return Palette ? <Palette initialOpen /> : null;
}

"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: site.timeZone,
});

/** Burgas local time, rendered on the client (it changes every minute, so it can't be prerendered). */
export function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className={className} suppressHydrationWarning>
      {now ?? "--:--"}
    </time>
  );
}

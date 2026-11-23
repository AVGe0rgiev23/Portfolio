"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** One toast at a time, bottom centre. Fire with toast("copied ✓"). */
export function Toaster() {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  useEffect(() => {
    let timer = 0;
    const on = (e: Event) => {
      setMsg({ id: Date.now(), text: (e as CustomEvent<string>).detail });
      clearTimeout(timer);
      timer = window.setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener("ag:toast", on);
    return () => {
      window.removeEventListener("ag:toast", on);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[85] flex justify-center">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="t-mono flex items-center gap-2.5 rounded-full border border-line-strong bg-raised px-4 py-2.5 text-text"
          >
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

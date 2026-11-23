"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Kind = "kw" | "fn" | "cls" | "str" | "com" | "num" | "punct" | "plain" | "attr";
type Token = { text: string; kind: Kind };

const KEYWORDS = new Set(["def", "return", "from", "import", "for", "in", "if", "else", "None", "True", "False"]);

/** Tiny Python highlighter: enough for a 10-line snippet, no dependency. */
function tokenize(src: string): Token[][] {
  const re =
    /("""[\s\S]*?"""|"[^"\n]*"|'[^'\n]*')|(#[^\n]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g;
  return src.split("\n").map((line) => {
    const out: Token[] = [];
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(line))) {
      const [text, str, com, num, ident, , punct] = m;
      let kind: Kind = "plain";
      if (str) kind = "str";
      else if (com) kind = "com";
      else if (num) kind = "num";
      else if (ident) {
        const next = line.slice(re.lastIndex).trimStart()[0];
        const prev = line.slice(0, m.index).trimEnd().slice(-1);
        if (KEYWORDS.has(ident)) kind = "kw";
        else if (next === "(") kind = "fn";
        else if (/^[A-Z][a-z]/.test(ident)) kind = "cls";
        else if (prev === ".") kind = "attr";
        else if (/^[A-Z_]+$/.test(ident)) kind = "num";
      } else if (punct) kind = "punct";
      out.push({ text, kind });
    }
    return out;
  });
}

const COLOR: Record<Kind, string> = {
  kw: "text-accent",
  fn: "text-text",
  cls: "text-[#E9C9A8]",
  str: "text-[#C9B79C]",
  com: "text-faint italic",
  num: "text-[#E9C9A8]",
  punct: "text-muted",
  plain: "text-[#BDB7AD]",
  attr: "text-[#BDB7AD]",
};

const CPS = 210; // characters per second

export function CodeTyper({ code, file, labels }: { code: string; file: string; labels: { running: string; done: string } }) {
  const lines = useMemo(() => tokenize(code), [code]);
  const total = code.length;
  const [typed, setTyped] = useState(total); // SSR + no-JS: fully visible
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Below the fold → blank it and type on entry. In view already → leave it as is.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    let raf = 0;
    const blank = requestAnimationFrame(() => setTyped(0));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now() + 450; // let the card land first
        const tick = (now: number) => {
          const n = Math.max(0, Math.floor(((now - t0) / 1000) * CPS));
          setTyped(Math.min(total, n));
          if (n < total) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(blank);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [total]);

  const done = typed >= total;
  // Absolute character offset of every token, so each can be sliced against `typed`.
  const offsets = useMemo(() => {
    const out: number[][] = [];
    let at = 0;
    for (const tokens of lines) {
      const row: number[] = [];
      for (const tok of tokens) {
        row.push(at);
        at += tok.text.length;
      }
      at += 1; // newline
      out.push(row);
    }
    return out;
  }, [lines]);

  return (
    <div ref={ref} className="card flex flex-col overflow-hidden bg-sunken">
      <div className="t-mono flex items-center justify-between border-b border-line px-4 py-3 text-[10.5px] text-muted">
        <span>
          <span className="text-faint">~/</span>
          {file}
        </span>
        <span className="flex items-center gap-2">
          <span className={`size-1.5 rounded-full ${done ? "bg-text/60" : "animate-pulse bg-accent"}`} aria-hidden />
          {done ? labels.done : labels.running}
        </span>
      </div>
      <pre
        className="flex-1 overflow-x-auto px-0 py-5 font-mono text-[11.5px] leading-[1.75] md:text-[12.5px]"
        aria-label={`${file}`}
        tabIndex={0}
      >
        <code className="grid">
          {lines.map((tokens, li) => {
            return (
              <span key={li} className="flex">
                <span className="w-10 shrink-0 select-none pr-4 text-right text-faint/70" aria-hidden>
                  {li + 1}
                </span>
                <span className="whitespace-pre pr-6">
                  {tokens.map((tok, ti) => {
                    const at = offsets[li][ti];
                    const show = Math.max(0, Math.min(tok.text.length, typed - at));
                    const caret = !done && typed >= at && typed < at + tok.text.length;
                    return (
                      <span key={ti} className={COLOR[tok.kind]}>
                        {tok.text.slice(0, show)}
                        {caret && (
                          <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent" aria-hidden />
                        )}
                        {show < tok.text.length && <span className="opacity-0">{tok.text.slice(show)}</span>}
                      </span>
                    );
                  })}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

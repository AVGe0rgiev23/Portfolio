"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { cn } from "@/lib/cn";

type Labels = Record<"name" | "company" | "email" | "message" | "send" | "sending" | "ok" | "error" | "rate" | "invalid" | "notConfigured", string>;

const field =
  "w-full rounded-[2px] border bg-bg px-4 py-3 text-[15px] text-text placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

export function ContactForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  // Time trap: stamped after mount, never during prerender.
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  const bad = (f: string) => state.status === "invalid" && state.fields?.includes(f);

  if (state.status === "ok") {
    return (
      <p role="status" className="flex items-center gap-3 py-10 font-serif text-[1.75rem] leading-tight">
        <span className="size-2 rounded-full bg-accent" aria-hidden />
        {labels.ok}
      </p>
    );
  }

  const message =
    state.status === "invalid"
      ? labels.invalid
      : state.status === "rate"
        ? labels.rate
        : state.status === "error"
          ? labels.error
          : state.status === "notConfigured"
            ? labels.notConfigured
            : null;

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2" noValidate>
      {/* Spam traps: hidden field + time since render */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <label className="flex flex-col gap-2">
        <span className="t-mono text-faint">{labels.name}</span>
        <input name="name" required minLength={2} maxLength={80} autoComplete="name" aria-invalid={bad("name")} className={cn(field, bad("name") ? "border-accent" : "border-line-strong")} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="t-mono text-faint">{labels.company}</span>
        <input name="company" maxLength={120} autoComplete="organization" className={cn(field, "border-line-strong")} />
      </label>
      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="t-mono text-faint">{labels.email}</span>
        <input name="email" type="email" required maxLength={160} autoComplete="email" aria-invalid={bad("email")} className={cn(field, bad("email") ? "border-accent" : "border-line-strong")} />
      </label>
      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="t-mono text-faint">{labels.message}</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          aria-invalid={bad("message")}
          className={cn(field, "resize-y", bad("message") ? "border-accent" : "border-line-strong")}
        />
      </label>
      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="t-mono inline-flex h-12 items-center gap-3 rounded-[2px] bg-text px-6 text-bg transition-colors hover:bg-white disabled:opacity-60"
        >
          {pending ? labels.sending : labels.send} →
        </button>
        <p role="status" aria-live="polite" className="text-[14px] text-muted">
          {message}
        </p>
      </div>
    </form>
  );
}

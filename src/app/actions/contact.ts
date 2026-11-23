"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { Resend } from "resend";

export type ContactState = {
  status: "idle" | "ok" | "error" | "invalid" | "rate" | "notConfigured";
  fields?: string[];
};

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  company: z.string().trim().max(120).optional().default(""),
  email: z.email().max(160),
  message: z.string().trim().min(10).max(2000),
});

// Simple per-instance rate limit: 3 messages / 10 minutes / IP.
// Good enough for a portfolio; swap for a shared store (e.g. Upstash Redis) if spam grows.
const WINDOW = 10 * 60 * 1000;
const LIMIT = 3;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot + time trap: bots fill hidden fields and submit instantly. Pretend success.
  const honeypot = String(form.get("website") ?? "");
  const startedAt = Number(form.get("startedAt") ?? 0);
  if (honeypot || (startedAt && Date.now() - startedAt < 2500)) return { status: "ok" };

  const parsed = schema.safeParse({
    name: form.get("name"),
    company: form.get("company") ?? "",
    email: form.get("email"),
    message: form.get("message"),
  });
  if (!parsed.success) {
    return { status: "invalid", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (limited(ip)) return { status: "rate" };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  if (!key || !to) return { status: "notConfigured" };

  const { name, company, email, message } = parsed.data;
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio enquiry — ${name}${company ? ` (${company})` : ""}`,
      // Plain text only: nothing user-supplied is ever rendered as HTML.
      text: `Name: ${name}\nCompany: ${company || "—"}\nEmail: ${email}\n\n${message}`,
    });
    if (error) return { status: "error" };
    return { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

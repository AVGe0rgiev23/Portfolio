import { ogCard, OG_SIZE } from "@/lib/og";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Alex Georgiev — AI & Automation Developer · Founder of AGility";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const bg = locale === "bg";
  return ogCard({
    kicker: bg ? "Алекс Георгиев · AGility" : "Alex Georgiev · AGility",
    title: bg ? "Изграждам AI системи, които движат бизнеси — и движа собствен." : "I build AI systems that run businesses — and I run one.",
    accent: bg ? "движат" : "run",
    footer: bg ? "AI & Automation Developer · Бургас" : "AI & Automation Developer · Burgas, BG",
    cyrillic: bg,
  });
}

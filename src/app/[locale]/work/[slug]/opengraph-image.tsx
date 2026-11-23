import { ogCard, OG_SIZE } from "@/lib/og";
import { getProject, visibleProjects as projects } from "@/content/projects";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study — Alex Georgiev";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getProject(slug);
  const bg = locale === "bg";
  const index = String(projects.findIndex((x) => x.slug === slug) + 1).padStart(2, "0");
  return ogCard({
    kicker: `${bg ? "Казус" : "Case study"} · ${index}`,
    title: p ? p.name[bg ? "bg" : "en"] : "Alex Georgiev",
    footer: p ? p.kind[bg ? "bg" : "en"].replace(/\[\[[^\]]+\]\]/g, "").slice(0, 60) : "",
    cyrillic: bg,
  });
}

import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

const paths = ["", "/cv", "/cv/europass", ...projects.map((p) => `/work/${p.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({
    url: `${site.url}/en${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.startsWith("/work") ? 0.8 : 0.6,
    alternates: { languages: { en: `${site.url}/en${p}`, bg: `${site.url}/bg${p}` } },
  }));
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { projects } from "@/content/projects";
import { site, isSet } from "@/content/site";
import { isLocale } from "@/i18n/routing";
import { scrollToId, useLenis } from "@/components/motion/smooth-scroll";
import { copyEmail } from "@/components/ui/copy-email";

const SECTIONS = ["what", "work", "studies", "services", "capabilities", "about", "contact"] as const;

/** ⌘K / Ctrl+K anywhere. Also opened by the nav and footer buttons (event "ag:palette"). */
export function CommandPalette({ initialOpen = false }: { initialOpen?: boolean }) {
  const t = useTranslations("palette");
  const tn = useTranslations("island");
  const tnav = useTranslations("nav");
  const tc = useTranslations("contact");
  const raw = useLocale();
  const locale = isLocale(raw) ? raw : "en";
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ag:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ag:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const run = useCallback(
    (fn: () => void) => {
      setOpen(false);
      // Let the dialog close before scrolling/navigating.
      requestAnimationFrame(fn);
    },
    [],
  );

  const goSection = (id: string) =>
    run(() => {
      if (pathname === "/" && scrollToId(lenis, id)) return;
      router.push(`/#${id}`);
    });

  const label = (id: (typeof SECTIONS)[number]) =>
    id === "what" ? tn("what") : id === "capabilities" ? tn("caps") : tnav(id);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center bg-bg/70 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[620px]"
          >
            <Command
              label="Command palette"
              loop
              className="palette card overflow-hidden bg-raised shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]"
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="t-mono text-accent" aria-hidden>
                  ›
                </span>
                <Command.Input
                  autoFocus
                  placeholder={t("placeholder")}
                  className="h-14 flex-1 bg-transparent text-[16px] text-text outline-none placeholder:text-faint"
                />
                <kbd className="t-mono rounded-[2px] border border-line-strong px-1.5 py-0.5 text-[10px] text-faint">esc</kbd>
              </div>
              <Command.List className="max-h-[52vh] overflow-y-auto p-2" data-lenis-prevent>
                <Command.Empty className="t-mono px-3 py-8 text-center text-faint">{t("empty")}</Command.Empty>

                <Command.Group heading={t("sections")}>
                  {SECTIONS.map((id, i) => (
                    <Command.Item key={id} value={`section ${id} ${label(id)}`} onSelect={() => goSection(id)}>
                      <span className="t-mono w-7 text-faint">0{i + 1}</span>
                      {label(id)}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={t("projects")}>
                  {projects.map((p, i) => (
                    <Command.Item
                      key={p.slug}
                      value={`project ${p.name.en} ${p.name.bg} ${p.slug}`}
                      onSelect={() => run(() => router.push(`/work/${p.slug}`))}
                    >
                      <span className="t-mono w-7 text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-serif text-[18px]">{p.name[locale]}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={t("actions")}>
                  {isSet(site.email) && (
                    <Command.Item value="copy email" onSelect={() => run(() => copyEmail(tc("copied")))}>
                      <span className="t-mono w-7 text-faint">@</span>
                      {t("copyEmail")}
                    </Command.Item>
                  )}
                  <Command.Item value="download cv resume" onSelect={() => run(() => window.open(site.cv, "_blank"))}>
                    <span className="t-mono w-7 text-faint">↓</span>
                    {t("downloadCv")}
                  </Command.Item>
                  <Command.Item value="europass cv erasmus school" onSelect={() => run(() => router.push("/cv/europass"))}>
                    <span className="t-mono w-7 text-faint">→</span>
                    {t("europass")}
                  </Command.Item>
                  <Command.Item
                    value="language english bulgarian bg en"
                    onSelect={() => run(() => router.replace(pathname, { locale: locale === "en" ? "bg" : "en" }))}
                  >
                    <span className="t-mono w-7 text-faint">文</span>
                    {t("language")}
                  </Command.Item>
                  <Command.Item value="github code" onSelect={() => run(() => window.open(site.socials.github, "_blank", "noopener"))}>
                    <span className="t-mono w-7 text-faint">↗</span>
                    {t("github")}
                  </Command.Item>
                  <Command.Item value="linkedin" onSelect={() => run(() => window.open(site.socials.linkedin, "_blank", "noopener"))}>
                    <span className="t-mono w-7 text-faint">↗</span>
                    {t("linkedin")}
                  </Command.Item>
                  <Command.Item
                    value="book a call meeting"
                    onSelect={() =>
                      run(() => (isSet(site.calLink) ? window.open(site.calLink, "_blank", "noopener") : goSection("contact")))
                    }
                  >
                    <span className="t-mono w-7 text-accent">●</span>
                    {t("book")}
                  </Command.Item>
                </Command.Group>
              </Command.List>
              <div className="t-mono flex gap-5 border-t border-line px-4 py-2.5 text-[10px] text-faint">
                <span>↑↓ {t("hint")}</span>
                <span>↵ {t("select")}</span>
                <span>esc {t("close")}</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

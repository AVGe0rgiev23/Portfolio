import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignalCanvas } from "@/components/three/signal-canvas";

/** 404: the Signal Field with every particle scattered. Nothing converges. */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main id="main" className="field relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SignalCanvas scatter />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
      </div>
      <div className="frame pb-16 md:pb-24">
        <p className="t-mono text-accent">404 · route not found</p>
        <h1 className="t-display mt-6 max-w-[14ch]">{t("title")}</h1>
        <p className="t-lede mt-6">{t("body")}</p>
        <Link
          href="/"
          className="t-mono mt-10 inline-flex h-12 items-center gap-3 rounded-[2px] bg-text px-5 text-bg hover:bg-white"
        >
          ← {t("home")}
        </Link>
      </div>
    </main>
  );
}

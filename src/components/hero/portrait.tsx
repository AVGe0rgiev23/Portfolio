import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { PortraitFrame } from "./portrait-frame";
import { site } from "@/content/site";
import { PlaceholderText } from "@/components/ui/placeholder-text";

export const hasPortrait = () => existsSync(path.join(process.cwd(), "public", site.portrait.replace(/^\//, "")));

/**
 * Editorial portrait. Drop a photo at /public/alex.jpg and it switches on automatically
 * (duotone graphite → bone, film grain, ember rim light on hover). Until then, a designed slot.
 */
export function Portrait({
  alt,
  fig,
  priority = false,
  sizes = "(min-width: 768px) 26vw, 44vw",
  className,
}: {
  alt: string;
  fig: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <PortraitFrame className={className} fig={fig}>
      {hasPortrait() ? (
        <>
          <Image src={site.portrait} alt={alt} fill priority={priority} sizes={sizes} className="portrait__img object-cover" />
          <div className="portrait__tone" aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-4" role="img" aria-label={alt}>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 70% 20%, rgba(237,232,223,.07), transparent 60%), linear-gradient(180deg, #141416, #0c0c0d)",
            }}
            aria-hidden
          />
          <span className="t-mono relative text-[10px] text-faint">
            <PlaceholderText>[[PORTRAIT: /public/alex.jpg]]</PlaceholderText>
          </span>
          <span
            className="relative self-end font-serif text-[clamp(4.5rem,9vw,8.5rem)] italic leading-[0.8] tracking-[-0.05em] text-text/[0.12]"
            aria-hidden
          >
            AG
          </span>
        </div>
      )}
    </PortraitFrame>
  );
}

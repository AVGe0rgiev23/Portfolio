import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Fetch a Google font subset as TTF for Satori (base64, so the result is cacheable).
 * Cached with "use cache" so OG images can be prerendered under Cache Components.
 * Falls back to Satori's default font if the network is unavailable.
 */
async function fontB64(family: string, text: string, ital: boolean): Promise<string | null> {
  "use cache";
  try {
    const q = `${family.replace(/ /g, "+")}${ital ? ":ital@1" : ""}`;
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${q}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
  } catch {
    return null;
  }
}

async function font(family: string, text: string, ital = false): Promise<ArrayBuffer | null> {
  const b64 = await fontB64(family, text, ital);
  if (!b64) return null;
  const buf = Buffer.from(b64, "base64");
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function ogCard({
  kicker,
  title,
  accent,
  footer,
  cyrillic = false,
}: {
  kicker: string;
  title: string;
  /** one word of the title to set in ember italic */
  accent?: string;
  footer: string;
  cyrillic?: boolean;
}) {
  const serifFamily = cyrillic ? "Cormorant" : "Instrument Serif";
  const [serif, serifItalic, mono] = await Promise.all([
    font(serifFamily, title),
    font(serifFamily, accent ?? "", true),
    font("JetBrains Mono", `${kicker}${footer}`.toUpperCase() + "·●"),
  ]);

  const fonts = [
    serif && { name: "Serif", data: serif, style: "normal" as const },
    serifItalic && { name: "Serif", data: serifItalic, style: "italic" as const },
    mono && { name: "Mono", data: mono, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "normal" | "italic" }[];

  const words = title.split(" ");
  const clean = (w: string) => w.replace(/[^\p{L}]/gu, "");
  const accentAt = accent ? words.findIndex((w) => clean(w) === accent) : -1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          color: "#EDE8DF",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* the signal: many dots converging into one ember line */}
        {Array.from({ length: 70 }, (_, i) => {
          const x = 620 + ((i * 37) % 260);
          const y = 70 + ((i * 53) % 150);
          return (
            <div
              key={i}
              style={{ position: "absolute", left: x, top: y, width: 3, height: 3, borderRadius: 3, background: "rgba(237,232,223,.35)" }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 880,
            top: 145,
            width: 320,
            height: 2,
            background: "linear-gradient(90deg, rgba(255,90,31,0), #FF5A1F)",
            boxShadow: "0 0 18px 2px rgba(255,90,31,.6)",
          }}
        />
        <div style={{ display: "flex", fontFamily: "Mono", fontSize: 20, letterSpacing: 2, color: "#8A867F", textTransform: "uppercase" }}>
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "Serif",
            fontSize: title.length > 48 ? 76 : 96,
            lineHeight: 0.95,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              style={{
                marginRight: 18,
                fontStyle: i === accentAt ? "italic" : "normal",
                color: i === accentAt ? "#FF5A1F" : "#EDE8DF",
              }}
            >
              {w}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(237,232,223,.12)",
            paddingTop: 22,
            fontFamily: "Mono",
            fontSize: 18,
            letterSpacing: 2,
            color: "#8A867F",
            textTransform: "uppercase",
          }}
        >
          <span>{footer}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, color: "#EDE8DF" }}>
            <span style={{ width: 10, height: 10, borderRadius: 10, background: "#FF5A1F" }} />
            AG
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}

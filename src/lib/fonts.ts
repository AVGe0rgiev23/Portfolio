import { Cormorant, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";

export const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});

// Cyrillic display serif for /bg. Not preloaded: only fetched when Bulgarian glyphs render.
export const cormorant = Cormorant({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["cyrillic", "latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

export const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = [instrument.variable, cormorant.variable, interTight.variable, jetbrains.variable].join(" ");

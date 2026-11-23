import { stack } from "@/content/stack";

/**
 * "AG" carved out of my real stack: lines of mono stack-words, tapering toward the
 * edges and drifting slowly, clipped to the letterforms. Used once. Decorative.
 */
export function StackMonogram() {
  const words = stack.map((s) => s.toLowerCase()).join(" · ") + " · ";
  const LINES = 44;
  const H = 520;
  return (
    <svg viewBox={`0 0 560 ${H}`} className="w-full" aria-hidden focusable="false">
      <defs>
        <clipPath id="ag-clip">
          <text
            x="280"
            y="430"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            fontStyle="italic"
            fontSize="520"
            letterSpacing="-28"
          >
            AG
          </text>
        </clipPath>
      </defs>
      <g clipPath="url(#ag-clip)">
        {Array.from({ length: LINES }, (_, i) => {
          const y = (i + 0.8) * (H / LINES);
          const mid = 1 - Math.abs(i - LINES / 2) / (LINES / 2); // 0 at edges → 1 in the middle
          const size = 8 + mid * 5;
          const ember = i === Math.floor(LINES * 0.62);
          return (
            <text
              key={i}
              y={y}
              x={-600}
              fontSize={size}
              letterSpacing="1.5"
              fill={ember ? "#FF5A1F" : "#EDE8DF"}
              fillOpacity={ember ? 0.95 : 0.25 + mid * 0.5}
              className={i % 2 ? "mono-drift mono-drift--rev" : "mono-drift"}
              style={{ fontFamily: "var(--font-jetbrains), monospace", animationDuration: `${38 + (i % 5) * 6}s` }}
            >
              {words.repeat(4)}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

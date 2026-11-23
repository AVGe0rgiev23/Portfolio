import type { AppLocale } from "@/i18n/routing";
import type { CaseStudy } from "@/content/case-studies";
import { isPlaceholder } from "@/content/types";

const W = 1000;
const H = 440;
const NW = 150; // minimum node width
const CHAR = 7.4; // ≈ mono glyph advance at 11px + tracking
const widthOf = (label: string) => Math.max(NW, Math.round(label.length * CHAR + 28));
const NH = 38;

/**
 * Architecture as an animated SVG: nodes + flowing ember lines.
 * Pure SVG + CSS (no JS). Reduced motion stops the flow; the diagram stays readable.
 */
export function ArchitectureDiagram({ diagram, locale }: { diagram: CaseStudy["diagram"]; locale: AppLocale }) {
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, { ...n, w: widthOf(n.label[locale]) }]));

  return (
    <figure className="arch">
      <div className="overflow-x-auto" data-lenis-prevent>
        <svg
          viewBox={`-10 -10 ${W + 20} ${H + 40}`}
          className="mx-auto w-full min-w-[680px] max-w-[1120px]"
          role="img"
          aria-label={diagram.caption[locale]}
        >
          <defs>
            <pattern id="arch-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(237,232,223,.06)" />
            </pattern>
          </defs>
          <rect x={-10} y={-10} width={W + 20} height={H + 40} fill="url(#arch-dots)" />

          {diagram.edges.map(([a, b], i) => {
            const A = byId[a];
            const B = byId[b];
            if (!A || !B) return null;
            const x1 = A.x + A.w / 2;
            const x2 = B.x - B.w / 2;
            const mx = (x1 + x2) / 2;
            const d = `M${x1} ${A.y} C${mx} ${A.y}, ${mx} ${B.y}, ${x2} ${B.y}`;
            return (
              <g key={`${a}-${b}`}>
                <path d={d} fill="none" stroke="rgba(237,232,223,.14)" strokeWidth={1} />
                <path
                  d={d}
                  fill="none"
                  stroke="#FF5A1F"
                  strokeWidth={1.25}
                  strokeLinecap="round"
                  className="arch__flow"
                  style={{ animationDelay: `${(i % 5) * -0.37}s` }}
                />
              </g>
            );
          })}

          {diagram.nodes.map((node) => {
            const label = node.label[locale];
            const w = widthOf(label);
            const ph = isPlaceholder(label);
            const core = node.kind === "core";
            return (
              <g key={node.id} transform={`translate(${node.x - w / 2} ${node.y - NH / 2})`}>
                <rect
                  width={w}
                  height={NH}
                  rx={2}
                  fill={core ? "#121214" : "#0B0B0C"}
                  stroke={ph ? "rgba(255,90,31,.6)" : core ? "rgba(237,232,223,.28)" : "rgba(237,232,223,.14)"}
                  strokeDasharray={ph ? "4 3" : undefined}
                />
                {node.kind === "output" && <rect x={0} y={0} width={2} height={NH} fill="#FF5A1F" />}
                <text
                  x={w / 2}
                  y={NH / 2 + 4}
                  textAnchor="middle"
                  fontSize={11}
                  letterSpacing="0.06em"
                  fill={ph ? "#FF5A1F" : core ? "#EDE8DF" : "#8A867F"}
                  style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="t-mono mt-4 text-faint">{diagram.caption[locale]}</figcaption>
    </figure>
  );
}

import { DESKTOP, MOBILE, type FieldLayout } from "./field-layout";

/**
 * Static poster of the Signal Field, rendered on the server as SVG.
 * It is the first paint, the reduced-motion version and the low-power fallback.
 * The JS here mirrors the vertex shader so poster and live field match.
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function sample(layout: FieldLayout, aspect: number, n: number, seed: number) {
  const rnd = mulberry32(seed);
  const time = 40;
  const bone: string[] = [];
  const ember: string[] = [];
  for (let i = 0; i < n; i++) {
    const s = [rnd(), rnd(), rnd(), rnd()];
    const [cx, cy] = layout.clusters[i % 5];
    const [kx, ky] = layout.merge;
    const speed = 0.028 + (0.06 - 0.028) * s[0];
    const p = (s[1] + time * speed) % 1;
    let tb = smooth(0.16, 0.66, p);
    tb = tb * tb * (3 - 2 * tb);
    const ctrlx = cx + (kx - cx) * 0.5;
    const ctrly = cy + (ky - cy) * 0.9;
    const bx = (1 - tb) * (1 - tb) * cx + 2 * (1 - tb) * tb * ctrlx + tb * tb * kx;
    const by = (1 - tb) * (1 - tb) * cy + 2 * (1 - tb) * tb * ctrly + tb * tb * ky;
    const tl = Math.min(1, Math.max(0, (p - 0.66) / 0.34));
    let x = p < 0.66 ? bx : kx + (layout.end - kx) * tl;
    let y = p < 0.66 ? by : ky;
    const chaos = 1 - smooth(0.14, 0.62, p);
    const dir = s[2] > 0.5 ? 1 : -1;
    const ang = s[2] * 6.2831 + time * (0.25 + s[3] * 0.6) * dir;
    const rad = layout.spread * (0.25 + 0.95 * Math.sqrt(s[3]));
    x += ((Math.cos(ang) * rad) / aspect) * chaos;
    y += Math.sin(ang * 1.3) * rad * chaos;
    const pt = `M${(x * 1000).toFixed(1)} ${(y * 1000).toFixed(1)}h0`;
    if (smooth(0.42, 0.7, p) > 0.5) ember.push(pt);
    else bone.push(pt);
  }
  return { bone: bone.join(""), ember: ember.join("") };
}

function Poster({ layout, aspect, n, className }: { layout: FieldLayout; aspect: number; n: number; className: string }) {
  const { bone, ember } = sample(layout, aspect, n, 7);
  const [kx, ky] = layout.merge;
  const id = layout === DESKTOP ? "d" : "m";
  return (
    <svg
      className={className}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id={`bloom-${id}`} cx={kx * 1000} cy={ky * 1000} r="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF5A1F" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`haze-${id}`} x1="0" y1={ky * 1000 - 30} x2="0" y2={ky * 1000 + 30} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF5A1F" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FF5A1F" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FF5A1F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={kx * 1000} y={ky * 1000 - 30} width={(layout.end - kx) * 1000} height="60" fill={`url(#haze-${id})`} />
      <circle cx={kx * 1000} cy={ky * 1000} r="140" fill={`url(#bloom-${id})`} />
      <path d={bone} stroke="#EDE8DF" strokeOpacity="0.34" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
      <path d={ember} stroke="#FF5A1F" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
      <line
        x1={kx * 1000}
        y1={ky * 1000}
        x2={layout.end * 1000}
        y2={ky * 1000}
        stroke="#FF5A1F"
        strokeWidth="1"
        strokeOpacity="0.9"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SignalPoster() {
  return (
    <div className="field__poster absolute inset-0 transition-opacity duration-[1400ms]">
      <Poster layout={DESKTOP} aspect={1.6} n={1100} className="absolute inset-0 hidden h-full w-full md:block" />
      <Poster layout={MOBILE} aspect={0.46} n={650} className="absolute inset-0 h-full w-full md:hidden" />
    </div>
  );
}

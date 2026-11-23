import type { FieldLayout } from "@/components/hero/field-layout";

/**
 * Signal Field: raw WebGL, no framework.
 * Every particle's path is computed in the vertex shader from a few per-particle
 * random seeds + time, so the CPU does nothing per frame except set uniforms.
 *
 * Story: particles orbit chaotically in five channel clusters (left), get pulled
 * right, converge, and leave as one clean ember line that runs off-screen.
 */

const POINT_VS = /* glsl */ `
precision highp float;
attribute vec4 aSeed;     // x: speed, y: phase, z: orbit angle, w: orbit radius
attribute float aCluster;

uniform float uTime;
uniform vec2  uRes;        // css px
uniform float uDpr;
uniform vec2  uClusters[5];
uniform vec2  uMerge;
uniform float uSpread;
uniform vec2  uMouse;      // viewport fraction
uniform float uMouseOn;
uniform float uScatter;    // 404 mode: 1 = everything stays chaotic
uniform float uEnd;        // where the line stops (the portrait frame)

varying float vMix;        // 0 bone → 1 ember
varying float vAlpha;

vec2 clusterAt(float i) {
  if (i < 0.5) return uClusters[0];
  if (i < 1.5) return uClusters[1];
  if (i < 2.5) return uClusters[2];
  if (i < 3.5) return uClusters[3];
  return uClusters[4];
}

void main() {
  float aspect = uRes.x / uRes.y;
  float speed = mix(0.028, 0.06, aSeed.x);
  float p = fract(aSeed.y + uTime * speed);

  vec2 C = clusterAt(aCluster);
  vec2 K = uMerge;

  // 1) linger in the cluster, 2) get pulled along a curve, 3) run the line.
  float tb = smoothstep(0.16, 0.66, p);
  tb = tb * tb * (3.0 - 2.0 * tb);
  vec2 ctrl = vec2(mix(C.x, K.x, 0.5), mix(C.y, K.y, 0.9));
  vec2 bez = mix(mix(C, ctrl, tb), mix(ctrl, K, tb), tb);
  float tl = clamp((p - 0.66) / 0.34, 0.0, 1.0);
  vec2 lin = vec2(mix(K.x, uEnd, tl), K.y);
  vec2 pos = p < 0.66 ? bez : lin;

  float chaos = 1.0 - smoothstep(0.14, 0.62, p);
  chaos = max(chaos, uScatter);

  // Orbit + wobble: the "noise" of five channels talking at once.
  float dir = aSeed.z > 0.5 ? 1.0 : -1.0;
  float ang = aSeed.z * 6.2831 + uTime * (0.25 + aSeed.w * 0.6) * dir;
  float rad = uSpread * (0.25 + 0.95 * sqrt(aSeed.w));
  vec2 orbit = vec2(cos(ang), sin(ang * 1.3)) * rad;
  orbit += vec2(sin(uTime * 0.9 + aSeed.x * 37.0), cos(uTime * 0.7 + aSeed.y * 23.0)) * uSpread * 0.22;
  orbit.x /= aspect;
  pos += orbit * chaos;

  // The line keeps a hair of life so it never looks like a static stroke.
  float lineLife = (1.0 - chaos) * (1.0 - uScatter);
  pos.y += sin(pos.x * 38.0 - uTime * 2.2 + aSeed.w * 2.0) * 0.0016 * lineLife;
  pos.y += (aSeed.w - 0.5) * 0.0028 * lineLife * (1.0 - tl);

  // Mouse gently bends the flow.
  vec2 d = pos - uMouse;
  d.x *= aspect;
  float r2 = dot(d, d);
  vec2 push = normalize(d + 1e-5) * 0.045 * exp(-r2 / 0.018) * uMouseOn;
  push.x /= aspect;
  pos += push;

  gl_Position = vec4(pos.x * 2.0 - 1.0, 1.0 - pos.y * 2.0, 0.0, 1.0);

  vMix = smoothstep(0.42, 0.7, p) * (1.0 - uScatter);
  float fadeIn = smoothstep(0.0, 0.05, p);
  float fadeOut = 1.0 - smoothstep(0.96, 1.0, p);
  float base = mix(0.34 + 0.3 * aSeed.x, 0.14, vMix);
  vAlpha = base * fadeIn * fadeOut;

  float size = mix(1.5 + 1.6 * aSeed.w, 1.35, vMix);
  gl_PointSize = size * uDpr;
}
`;

const POINT_FS = /* glsl */ `
precision mediump float;
varying float vMix;
varying float vAlpha;
uniform float uFade;
const vec3 BONE  = vec3(0.929, 0.910, 0.875);
const vec3 EMBER = vec3(1.0, 0.353, 0.122);
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.15, d);
  vec3 col = mix(BONE * 0.85, EMBER, vMix);
  gl_FragColor = vec4(col * a * vAlpha * uFade, 1.0);
}
`;

// Full-screen glow pass: slow light along the line and a bloom at the merge point.
const GLOW_VS = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const GLOW_FS = /* glsl */ `
precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform vec2 uMerge;
uniform float uTime;
uniform float uFade;
uniform float uScatter;
uniform float uEnd;
const vec3 EMBER = vec3(1.0, 0.353, 0.122);
void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  // Distance to the line (horizontal, from merge point to the right edge), in height units.
  float dy = (uv.y - uMerge.y);
  float onLine = smoothstep(uMerge.x - 0.02, uMerge.x + 0.08, uv.x) * (1.0 - smoothstep(uEnd - 0.004, uEnd + 0.002, uv.x));
  float line = exp(-dy * dy / 0.00045) * onLine;
  float haze = exp(-dy * dy / 0.012) * onLine * 0.35;
  // Slow light travelling along the line.
  float travel = fract(uTime * 0.07);
  float pulse = exp(-pow((uv.x - mix(uMerge.x, uEnd, travel)) * aspect, 2.0) / 0.03) * line;
  // Bloom where the chaos resolves.
  vec2 m = (uv - uMerge) * vec2(aspect, 1.0);
  float bloom = exp(-dot(m, m) / 0.006) * 0.55 + exp(-dot(m, m) / 0.05) * 0.12;
  float g = (line * 0.18 + haze * 0.18 + pulse * 0.35 + bloom * 0.4) * (1.0 - uScatter);
  gl_FragColor = vec4(EMBER * g * uFade, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return s;
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link failed");
  return p;
}

export type EngineOptions = {
  count: number;
  maxDpr: number;
  layout: FieldLayout;
  scatter?: boolean;
};

export class SignalEngine {
  private gl: WebGLRenderingContext;
  private points: WebGLProgram;
  private glow: WebGLProgram;
  private pointBuf: WebGLBuffer;
  private quadBuf: WebGLBuffer;
  private count: number;
  private maxDpr: number;
  private layout: FieldLayout;
  private raf = 0;
  private last = 0;
  private time = 0;
  private running = false;
  private mouse = { x: -10, y: -10, tx: -10, ty: -10, on: 0, ton: 0 };
  private speed = 1; // scroll speeds the flow up
  private fade = 0; // fades in on start, out on scroll
  private targetFade = 1;
  private scatter: number;
  private end = 1.06;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private g: Record<string, WebGLUniformLocation | null> = {};

  constructor(private canvas: HTMLCanvasElement, opts: EngineOptions) {
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
      depth: false,
      stencil: false,
    });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.count = opts.count;
    this.maxDpr = opts.maxDpr;
    this.layout = opts.layout;
    this.scatter = opts.scatter ? 1 : 0;

    this.points = program(gl, POINT_VS, POINT_FS);
    this.glow = program(gl, GLOW_VS, GLOW_FS);

    // Particles: [seed.x, seed.y, seed.z, seed.w, cluster]
    const data = new Float32Array(this.count * 5);
    for (let i = 0; i < this.count; i++) {
      data[i * 5 + 0] = Math.random();
      data[i * 5 + 1] = Math.random();
      data[i * 5 + 2] = Math.random();
      data[i * 5 + 3] = Math.random();
      data[i * 5 + 4] = i % 5;
    }
    this.pointBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this.quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    for (const name of ["uTime", "uRes", "uDpr", "uClusters", "uMerge", "uSpread", "uMouse", "uMouseOn", "uFade", "uScatter", "uEnd"]) {
      this.u[name] = gl.getUniformLocation(this.points, name);
    }
    for (const name of ["uRes", "uMerge", "uTime", "uFade", "uScatter", "uEnd"]) {
      this.g[name] = gl.getUniformLocation(this.glow, name);
    }

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // additive: overlapping light gets brighter, never muddier
    this.resize();
  }

  /** Viewport-fraction x where the line ends (e.g. the portrait frame). */
  setLineEnd(x: number) {
    this.end = x;
  }

  setLayout(layout: FieldLayout) {
    this.layout = layout;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Viewport-fraction mouse, or null to release. */
  setMouse(x: number | null, y?: number) {
    if (x === null) {
      this.mouse.ton = 0;
      return;
    }
    this.mouse.tx = x;
    this.mouse.ty = y ?? 0;
    this.mouse.ton = 1;
  }

  /** 0 at top of hero → 1 when the hero has scrolled away. */
  setScroll(progress: number) {
    const p = Math.min(1, Math.max(0, progress));
    this.speed = 1 + p * 3.2;
    this.targetFade = 1 - Math.min(1, Math.max(0, (p - 0.35) / 0.6));
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.time += dt * this.speed;
      this.draw(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Render a single still frame (reduced motion / poster capture). */
  still(time = 40) {
    this.time = time;
    this.fade = 1;
    this.targetFade = 1;
    this.draw(0);
  }

  private draw(dt: number) {
    const { gl, layout } = this;
    const k = 1 - Math.exp(-dt * 6);
    this.mouse.x += (this.mouse.tx - this.mouse.x) * k;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * k;
    this.mouse.on += (this.mouse.ton - this.mouse.on) * k;
    this.fade += (this.targetFade - this.fade) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 2.5));

    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const dpr = this.canvas.width / Math.max(1, w);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.fade < 0.005) return;

    // Glow pass
    gl.useProgram(this.glow);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    const aPos = gl.getAttribLocation(this.glow, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.g.uRes, w, h);
    gl.uniform2f(this.g.uMerge, layout.merge[0], layout.merge[1]);
    gl.uniform1f(this.g.uTime, this.time);
    gl.uniform1f(this.g.uFade, this.fade);
    gl.uniform1f(this.g.uScatter, this.scatter);
    gl.uniform1f(this.g.uEnd, this.end);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(aPos);

    // Particle pass
    gl.useProgram(this.points);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuf);
    const aSeed = gl.getAttribLocation(this.points, "aSeed");
    const aCluster = gl.getAttribLocation(this.points, "aCluster");
    gl.enableVertexAttribArray(aSeed);
    gl.vertexAttribPointer(aSeed, 4, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(aCluster);
    gl.vertexAttribPointer(aCluster, 1, gl.FLOAT, false, 20, 16);

    gl.uniform1f(this.u.uTime, this.time);
    gl.uniform2f(this.u.uRes, w, h);
    gl.uniform1f(this.u.uDpr, dpr);
    gl.uniform2fv(this.u.uClusters, new Float32Array(layout.clusters.flat()));
    gl.uniform2f(this.u.uMerge, layout.merge[0], layout.merge[1]);
    gl.uniform1f(this.u.uSpread, layout.spread);
    gl.uniform2f(this.u.uMouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.u.uMouseOn, this.mouse.on);
    gl.uniform1f(this.u.uFade, this.fade);
    gl.uniform1f(this.u.uScatter, this.scatter);
    gl.uniform1f(this.u.uEnd, this.end);
    gl.drawArrays(gl.POINTS, 0, this.count);
    gl.disableVertexAttribArray(aSeed);
    gl.disableVertexAttribArray(aCluster);
  }

  destroy() {
    this.stop();
    const { gl } = this;
    gl.deleteBuffer(this.pointBuf);
    gl.deleteBuffer(this.quadBuf);
    gl.deleteProgram(this.points);
    gl.deleteProgram(this.glow);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

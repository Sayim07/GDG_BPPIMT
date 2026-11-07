"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./glass-tiles-utils/glass-tiles.css";

/**
 * Glass Tiles with GDG 4-Color Chromatic Refraction
 * A wall of rounded architectural glass tiles with Google brand light beams moving behind it.
 * Each tile refracts the light through its bevel, splitting into authentic GDG colors:
 * Google Blue (#4285F4), Google Red (#EA4335), Google Yellow (#FBBC04), and Google Green (#34A853).
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCols;
uniform vec2 uMouse;
uniform float uLamp;
uniform float uIsDark;
uniform vec3 uGround;
uniform vec3 uGrout;

// Authentic Google 4-Color Brand Palette
const vec3 C_BLUE   = vec3(0.2588, 0.5216, 0.9569); // #4285F4 (Google Blue)
const vec3 C_RED    = vec3(0.9176, 0.2627, 0.2078); // #EA4335 (Google Red)
const vec3 C_YELLOW = vec3(0.9843, 0.7373, 0.0157); // #FBBC04 (Google Yellow)
const vec3 C_GREEN  = vec3(0.2039, 0.6588, 0.3255); // #34A853 (Google Green)

// Multi-spectral chromatic light behind the glass: GDG Blue, Red, Yellow, Green waves & pools
vec3 light(vec2 p){
  float t = uTime;
  vec3 col = vec3(0.0);
  float aspect = uRes.x / uRes.y;

  // 1. Google Blue Wave (broad, silky flowing ribbon across upper-mid)
  float yBlue = 0.55 + 0.28 * sin(p.x * 0.75 + t * 0.22) + 0.12 * sin(p.x * 1.8 - t * 0.28);
  float wBlue = exp(-pow((p.y - yBlue) / 0.15, 2.0));
  col += C_BLUE * wBlue * 1.1;

  // 2. Google Red Wave (diagonal counter wave through mid-lower)
  float yRed = 0.45 + 0.30 * sin(p.x * 0.90 + t * 0.18 + 2.09) + 0.10 * sin(p.x * 1.6 - t * 0.24 + 1.2);
  float wRed = exp(-pow((p.y - yRed) / 0.14, 2.0));
  col += C_RED * wRed * 1.0;

  // 3. Google Yellow Flow (warm undulating ambient flow)
  float yYellow = 0.50 + 0.26 * sin(p.x * 1.10 + t * 0.24 + 4.18) + 0.08 * sin(p.x * 2.1 - t * 0.30 + 3.0);
  float wYellow = exp(-pow((p.y - yYellow) / 0.13, 2.0));
  col += C_YELLOW * wYellow * 0.95;

  // 4. Google Green Wave (crisp lower-mid ribbon)
  float yGreen = 0.42 + 0.29 * sin(p.x * 0.85 + t * 0.20 + 3.14) + 0.11 * sin(p.x * 1.9 - t * 0.26 + 2.2);
  float wGreen = exp(-pow((p.y - yGreen) / 0.15, 2.0));
  col += C_GREEN * wGreen * 1.0;

  // Ambient soft floating GDG color pools for full-screen harmonic coverage
  vec2 c1 = vec2(0.28 * aspect + 0.35 * sin(t * 0.14 + 1.2), 0.45 + 0.25 * cos(t * 0.11 + 2.1));
  col += C_BLUE * exp(-dot(p - c1, p - c1) / 0.18) * 0.65;

  vec2 c2 = vec2(0.72 * aspect + 0.40 * sin(t * 0.13 + 3.7), 0.55 + 0.25 * cos(t * 0.12 + 0.8));
  col += C_GREEN * exp(-dot(p - c2, p - c2) / 0.16) * 0.60;

  vec2 c3 = vec2(0.50 * aspect + 0.45 * sin(t * 0.15 + 5.1), 0.48 + 0.28 * cos(t * 0.14 + 4.4));
  col += C_RED * exp(-dot(p - c3, p - c3) / 0.16) * 0.55;

  vec2 c4 = vec2(0.12 * aspect + 0.30 * sin(t * 0.16 + 2.5), 0.62 + 0.22 * cos(t * 0.13 + 3.3));
  col += C_YELLOW * exp(-dot(p - c4, p - c4) / 0.15) * 0.55;

  // Pointer Lamp with smooth chromatic GDG dispersion
  vec2 m = uMouse / uRes.y;
  float dMouse = length(p - m);
  float lampGlow = exp(-pow(dMouse / 0.30, 2.0)) * uLamp;
  float lampCore = exp(-pow(dMouse / 0.08, 2.0)) * uLamp;

  // Prismatic dispersion around pointer lamp: smooth cycle across the 4 Google colors
  float ang = atan(p.y - m.y, p.x - m.x);
  float rawCycle = (ang / 3.14159265) * 2.0 + t * 0.5;
  float phase = fract(rawCycle * 0.25) * 4.0;
  vec3 lampColor = C_BLUE;
  if (phase < 1.0) {
    lampColor = mix(C_BLUE, C_RED, phase);
  } else if (phase < 2.0) {
    lampColor = mix(C_RED, C_YELLOW, phase - 1.0);
  } else if (phase < 3.0) {
    lampColor = mix(C_YELLOW, C_GREEN, phase - 2.0);
  } else {
    lampColor = mix(C_GREEN, C_BLUE, phase - 3.0);
  }

  col += lampColor * lampGlow * 1.3 + vec3(1.0) * lampCore * 0.6;
  return col;
}

void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float aspect = uRes.x / uRes.y;
  float size = aspect / uCols;
  vec2 id = floor(p / size);
  vec2 q = (fract(p / size) - 0.5) * 2.0;

  // Squircle (|x|^9 + |y|^9)^(1/9): refined architectural rounded tiles
  vec2 aq = abs(q);
  float sq = pow(pow(aq.x, 9.0) + pow(aq.y, 9.0), 1.0 / 9.0);
  float d = sq - 0.975; // Clean hairline grout

  if (d > 0.0) {
    gl_FragColor = vec4(uGrout, 1.0);
    return;
  }

  // Bevel: bends light inwards
  float edge = clamp(1.0 + d / 0.52, 0.0, 1.0);
  vec2 g = normalize(sign(q) * pow(aq + 1e-4, vec2(8.0)));
  float bend = pow(edge, 2.2);
  vec2 centre = (id + 0.5) * size;

  // Refracted light lookup
  vec2 look = centre + q * size * 0.5 * (1.0 - 0.55 * bend) - g * bend * size * 0.9;
  vec3 L = light(look);

  // Face and beveled rim
  vec3 face = light(centre + q * size * 0.32);
  vec3 rim = L * pow(edge, 1.6) * 3.2;
  float fres = pow(edge, 7.0) * 0.12;

  vec3 col;
  if (uIsDark > 0.5) {
    // Dark mode: Deep obsidian glass with glowing neon GDG ribbons
    col = uGround;
    col += face * 0.06;
    col += rim * 0.75;
    col += vec3(1.0) * pow(max(length(rim) - 1.2, 0.0), 2.0) * 0.35 + vec3(fres);
    col *= 0.90 + 0.10 * (0.5 + 0.5 * q.y);
  } else {
    // Light mode: Clean white architectural glass with subtle, low-intensity GDG pastel sheen
    float innerShade = 0.99 + 0.01 * (0.5 + 0.5 * q.y);
    vec3 tileBase = uGround * innerShade;

    // Extract chromatic GDG hue vectors (branchless)
    float lightMag = length(face);
    vec3 hueFace = face / (lightMag + 1e-4);

    float rimMag = length(rim);
    vec3 hueRim = rim / (rimMag + 1e-4);

    // Subtle diffuse face tint: soft low intensity (4% to 8% max)
    float faceAmount = clamp(lightMag * 0.06, 0.0, 0.08);
    col = mix(tileBase, hueFace, faceAmount);

    // Beveled rim shimmer: crisp, silky pastel Google color ribbons (10% to 20% max)
    float rimAmount = clamp(rimMag * 0.16, 0.0, 0.20) * pow(edge, 1.1);
    col = mix(col, hueRim, rimAmount);

    // Subtle crisp specular glint along the crest of the bevel
    float glint = pow(edge, 6.0) * clamp(rimMag * 0.12, 0.0, 0.15);
    col += vec3(glint);
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const rgb = (hex: string) => {
  const clean = hex.startsWith("#") ? hex.slice(1) : hex;
  const v = parseInt(clean, 16);
  return [
    ((v >> 16) & 255) / 255,
    ((v >> 8) & 255) / 255,
    (v & 255) / 255,
  ] as const;
};

export const GDG_LIGHT_GROUND = "#f8fafd";
export const GDG_LIGHT_GROUT = "#e5e9f0";

export const GDG_DARK_GROUND = "#0f1217";
export const GDG_DARK_GROUT = "#08090c";

export type GlassTilesPalette = {
  glow?: string;
  deep?: string;
  ground?: string;
  grout?: string;
};

export const GDG_DARK_PALETTE: GlassTilesPalette = {
  glow: "#4285F4",
  deep: "#152a4e",
  ground: GDG_DARK_GROUND,
  grout: GDG_DARK_GROUT,
};

export const GDG_LIGHT_PALETTE: GlassTilesPalette = {
  glow: "#1a73e8",
  deep: "#bad7fc",
  ground: GDG_LIGHT_GROUND,
  grout: GDG_LIGHT_GROUT,
};

const GT_CSS = `
.gt {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
}
.gt__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
.gt__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.gt[data-fallback] {
  background: var(--gt-ground, #f8fafd);
}
`;

export type GlassTilesProps = {
  isDark?: boolean;
  palette?: GlassTilesPalette;
  columns?: number;
  speed?: number;
  groundColor?: string;
  groutColor?: string;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function GlassTiles({
  isDark = false,
  palette,
  columns = 15,
  speed = 0.65,
  groundColor,
  groutColor,
  motion = "full",
  className = "",
  style,
  children,
}: GlassTilesProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const finalGround =
    groundColor || palette?.ground || (isDark ? GDG_DARK_GROUND : GDG_LIGHT_GROUND);
  const finalGrout =
    groutColor || palette?.grout || (isDark ? GDG_DARK_GROUT : GDG_LIGHT_GROUT);

  useEffect(() => {
    const el = host.current,
      cv = canvas.current;
    if (!el || !cv) return;

    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return void (el.dataset.fallback = "");

    const reduced =
      motion === "reduced" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;

    const mk = (t: number, s: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, s);
      gl.compileShader(sh);
      return sh;
    };

    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);

    if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
      return void (el.dataset.fallback = "");

    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(pr, n);
    const u = {
      res: U("uRes"),
      time: U("uTime"),
      cols: U("uCols"),
      mouse: U("uMouse"),
      lamp: U("uLamp"),
      isDark: U("uIsDark"),
      ground: U("uGround"),
      grout: U("uGrout"),
    };

    gl.uniform1f(u.isDark, isDark ? 1.0 : 0.0);
    gl.uniform3f(u.ground, ...rgb(finalGround));
    gl.uniform3f(u.grout, ...rgb(finalGrout));

    let scale = 1,
      raf = 0,
      visible = true,
      alive = true,
      last = 0,
      t = 12;

    const m = { x: 0, y: 0, tx: 0, ty: 0, l: 0, tl: 0 };

    const size = () => {
      scale = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.6 : 0.85);
      cv.width = Math.max(1, Math.round(el.clientWidth * scale));
      cv.height = Math.max(1, Math.round(el.clientHeight * scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);

      // Responsive column count tuned for clean UI proportions:
      // Mobile (<640px): 8 columns
      // Tablet (640-1024px): 12 columns
      // Desktop (>1024px): 15 columns
      let effectiveCols = columns;
      if (el.clientWidth < 640) {
        effectiveCols = Math.max(7, Math.round(columns * 0.55));
      } else if (el.clientWidth < 1024) {
        effectiveCols = Math.max(10, Math.round(columns * 0.8));
      }
      gl.uniform1f(u.cols, effectiveCols);
    };

    const frame = () => {
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, m.x, m.y);
      gl.uniform1f(u.lamp, m.l);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      if (coarse && now - last < 33)
        return void (raf = requestAnimationFrame(tick));
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      m.l += (m.tl - m.l) * 0.06;
      frame();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced) return frame();
      if (!raf && alive) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (
        e.clientY < r.top ||
        e.clientY > r.bottom ||
        e.clientX < r.left ||
        e.clientX > r.right
      ) {
        m.tl = 0;
        return;
      }
      m.tx = ((e.clientX - r.left) / r.width) * cv.width;
      m.ty = (1 - (e.clientY - r.top) / r.height) * cv.height;
      if (!m.l) {
        m.x = m.tx;
        m.y = m.ty;
      }
      m.tl = 1;
    };

    const onLeave = () => (m.tl = 0);

    const ro = new ResizeObserver(() => {
      size();
      frame();
    });
    ro.observe(el);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);

    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);

    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    size();
    frame();
    start();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (!coarse) {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [isDark, finalGround, finalGrout, columns, speed, motion]);

  return (
    <div
      ref={host}
      className={`gt ${className}`}
      style={{
        ["--gt-ground" as string]: finalGround,
        ...style,
      }}
    >
      <style>{GT_CSS}</style>
      <canvas ref={canvas} className="gt__canvas" aria-hidden="true" />
      {children && <div className="gt__content">{children}</div>}
    </div>
  );
}

export default GlassTiles;

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

  // Grout lines
  if (d > 0.0) {
    gl_FragColor = vec4(uGrout, 1.0);
    return;
  }

  // Bevel edge curve: 0.0 at tile interior/center, rising to 1.0 at grout boundary
  float edge = clamp(1.0 + d / 0.42, 0.0, 1.0);

  // Center of the tile is 100% pure uGround (#ffffff in light, deep #12151b in dark)
  // No gray dish or darkening in the middle
  vec3 col = uGround;

  // Directional lighting: subtle highlight from top-left, delicate soft shadow on bottom-right
  float lightDir = -q.y * 0.707 - q.x * 0.707;
  float specLight = max(0.0, lightDir);
  float shadeLight = max(0.0, -lightDir);

  if (uIsDark > 0.5) {
    // Dark mode: Deep obsidian glass tiles with crisp subtle bevel highlight
    float spec = pow(edge, 3.5) * specLight * 0.14;
    float shade = pow(edge, 2.5) * shadeLight * 0.03;
    col = col - vec3(shade) + vec3(spec);

    // Soft neutral hover sheen
    vec2 m = uMouse / uRes.y;
    float dMouse = length(p - m);
    float hoverGlow = exp(-pow(dMouse / 0.35, 2.0)) * uLamp * 0.10 * pow(edge, 1.5);
    col += vec3(hoverGlow);
  } else {
    // Light mode: Proper pure white architectural tiles (spotless white center)
    float spec = pow(edge, 4.0) * specLight * 0.12;
    float shade = pow(edge, 2.8) * shadeLight * 0.04;
    col = col - vec3(shade) + vec3(spec);

    // Soft neutral hover sheen
    vec2 m = uMouse / uRes.y;
    float dMouse = length(p - m);
    float hoverGlow = exp(-pow(dMouse / 0.35, 2.0)) * uLamp * 0.06 * pow(edge, 1.5);
    col += vec3(hoverGlow);
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

export const GDG_LIGHT_GROUND = "#ffffff";
export const GDG_LIGHT_GROUT = "#e5e9f0";

export const GDG_DARK_GROUND = "#12151b";
export const GDG_DARK_GROUT = "#080a0d";

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

      // Intelligent Idle Sleep: If pointer settled and light rested, sleep
      const isMoving =
        Math.abs(m.tx - m.x) > 0.5 ||
        Math.abs(m.ty - m.y) > 0.5 ||
        Math.abs(m.tl - m.l) > 0.01;

      if (isMoving || m.tl > 0) {
        raf = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (reduced) return frame();
      if (!raf && alive && visible) {
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
        if (m.tl !== 0) {
          m.tl = 0;
          start();
        }
        return;
      }
      m.tx = ((e.clientX - r.left) / r.width) * cv.width;
      m.ty = (1 - (e.clientY - r.top) / r.height) * cv.height;
      if (!m.l) {
        m.x = m.tx;
        m.y = m.ty;
      }
      m.tl = 1;
      start();
    };

    const onLeave = () => {
      if (m.tl !== 0) {
        m.tl = 0;
        start();
      }
    };

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

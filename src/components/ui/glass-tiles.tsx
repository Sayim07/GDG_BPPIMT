"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./glass-tiles-utils/glass-tiles.css";

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

  vec2 aq = abs(q);
  float sq = pow(pow(aq.x, 9.0) + pow(aq.y, 9.0), 1.0 / 9.0);
  float d = sq - 0.975;

  if (d > 0.0) {
    gl_FragColor = vec4(uGrout, 1.0);
    return;
  }

  float edge = clamp(1.0 + d / 0.42, 0.0, 1.0);
  vec3 col = uGround;

  float lightDir = -q.y * 0.707 - q.x * 0.707;
  float specLight = max(0.0, lightDir);
  float shadeLight = max(0.0, -lightDir);

  if (uIsDark > 0.5) {
    float spec = pow(edge, 3.5) * specLight * 0.14;
    float shade = pow(edge, 2.5) * shadeLight * 0.03;
    col = col - vec3(shade) + vec3(spec);

    vec2 m = uMouse / uRes.y;
    float dMouse = length(p - m);
    float hoverGlow = exp(-pow(dMouse / 0.35, 2.0)) * uLamp * 0.10 * pow(edge, 1.5);
    col += vec3(hoverGlow);
  } else {
    float spec = pow(edge, 4.0) * specLight * 0.12;
    float shade = pow(edge, 2.8) * shadeLight * 0.04;
    col = col - vec3(shade) + vec3(spec);

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

// Reads the actual rendered CSS background color of the host div
function isElementDark(el: HTMLElement): boolean {
  const bg = getComputedStyle(el).backgroundColor;
  const match = bg.match(/\d+/g);
  if (match && match.length >= 3) {
    const brightness = (Number(match[0]) + Number(match[1]) + Number(match[2])) / 3;
    return brightness < 128;
  }
  return document.documentElement.classList.contains("dark");
}

export function GlassTiles({
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
    const vs = mk(gl.VERTEX_SHADER, VERT);
    const fs = mk(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);

    if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
      return void (el.dataset.fallback = "");

    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
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

    let scale = 1,
      raf = 0,
      themeRaf = 0,
      visible = true,
      alive = true,
      last = 0,
      t = 12;

    const m = { x: 0, y: 0, tx: 0, ty: 0, l: 0, tl: 0 };

    const frame = () => {
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, m.x, m.y);
      gl.uniform1f(u.lamp, m.l);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Sync WebGL uniforms directly from the host div's computed Tailwind dark: style
    const syncThemeFromCSS = () => {
      if (!alive) return;
      const dark = isElementDark(el);
      const ground = groundColor || palette?.ground || (dark ? GDG_DARK_GROUND : GDG_LIGHT_GROUND);
      const grout = groutColor || palette?.grout || (dark ? GDG_DARK_GROUT : GDG_LIGHT_GROUT);

      gl.useProgram(pr);
      gl.uniform1f(u.isDark, dark ? 1.0 : 0.0);
      gl.uniform3f(u.ground, ...rgb(ground));
      gl.uniform3f(u.grout, ...rgb(grout));
      frame();
    };

    const scheduleThemeSync = () => {
      cancelAnimationFrame(themeRaf);
      // Wait 1 frame so the browser finishes applying CSS dark: styles first
      themeRaf = requestAnimationFrame(syncThemeFromCSS);
    };

    const size = () => {
      scale = coarse ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(el.clientWidth * scale));
      cv.height = Math.max(1, Math.round(el.clientHeight * scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);

      let effectiveCols = columns;
      if (el.clientWidth < 640) {
        effectiveCols = Math.max(7, Math.round(columns * 0.55));
      } else if (el.clientWidth < 1024) {
        effectiveCols = Math.max(10, Math.round(columns * 0.8));
      }
      gl.uniform1f(u.cols, effectiveCols);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      if (coarse) {
        frame();
        return;
      }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      m.l += (m.tl - m.l) * 0.06;
      frame();

      const isMoving =
        Math.abs(m.tx - m.x) > 0.4 ||
        Math.abs(m.ty - m.y) > 0.4 ||
        Math.abs(m.tl - m.l) > 0.005;

      if (isMoving) {
        raf = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (reduced || coarse) return frame();
      if (!raf && alive && visible) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    let cachedRect = el.getBoundingClientRect();
    let isScrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    const onMove = (e: PointerEvent) => {
      if (isScrolling) return;
      const r = cachedRect;
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

    // Watch <html> for any theme attribute change (class, data-theme, style)
    const mo = new MutationObserver(scheduleThemeSync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    // Also watch OS-level theme changes if user is on "system" theme
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", scheduleThemeSync);

    const ro = new ResizeObserver(() => {
      cachedRect = el.getBoundingClientRect();
      size();
      frame();
    });
    ro.observe(el);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);

    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    size();
    syncThemeFromCSS();
    start();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(themeRaf);
      mo.disconnect();
      mql.removeEventListener("change", scheduleThemeSync);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      if (!coarse) {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      }
      if (pr) {
        gl.deleteProgram(pr);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (buf) gl.deleteBuffer(buf);
      }
    };
  }, [columns, speed, motion, groundColor, groutColor, palette?.ground, palette?.grout]);

  return (
    <div
      ref={host}
      className={`gt bg-[#ffffff] dark:bg-[#12151b] ${className}`}
      style={style}
    >
      <style>{GT_CSS}</style>
      <canvas ref={canvas} className="gt__canvas" aria-hidden="true" />
      {children && <div className="gt__content">{children}</div>}
    </div>
  );
}

export default GlassTiles;
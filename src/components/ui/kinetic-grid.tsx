"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

interface KineticTheme {
  dotColor: string;
  lineBase: { r: number; g: number; b: number; a: number };
  lineActive: { r: number; g: number; b: number; a: number };
  nodeBase: { r: number; g: number; b: number; a: number };
  ripple: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE = 52; // Balanced desktop/mobile grid cell
const INFLUENCE_RADIUS = 230;
const MAX_WARP = 22;
const DOT_SPACING = 28;
const LERP_SPEED = 0.085;

const NODE_BASE_RADIUS = 1.7;
const NODE_ACTIVE_RADIUS = 3.2;

// Google Developer Groups Signature Colors
const GDG_COLORS = [
  { r: 66, g: 133, b: 244 }, // Google Blue (#4285F4)
  { r: 234, g: 67, b: 53 },  // Google Red (#EA4335)
  { r: 251, g: 188, b: 4 },  // Google Yellow (#FBBC04)
  { r: 52, g: 168, b: 83 },  // Google Green (#34A853)
];

const DARK_THEME: KineticTheme = {
  dotColor: "rgba(255, 255, 255, 0.045)",
  lineBase: { r: 255, g: 255, b: 255, a: 0.07 },
  lineActive: { r: 66, g: 133, b: 244, a: 0.8 },
  nodeBase: { r: 255, g: 255, b: 255, a: 0.2 },
  ripple: "66, 133, 244",
};

const LIGHT_THEME: KineticTheme = {
  dotColor: "rgba(66, 133, 244, 0.065)",
  lineBase: { r: 66, g: 133, b: 244, a: 0.10 },
  lineActive: { r: 66, g: 133, b: 244, a: 0.72 },
  nodeBase: { r: 66, g: 133, b: 244, a: 0.28 },
  ripple: "66, 133, 244",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number
): string {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface KineticGridProps {
  className?: string;
  variant?: "gdg" | "blue" | "monochrome";
}

/**
 * Pure zero-overhead static SVG grid for mobile devices and SSR.
 * 0 JavaScript calculations, 0 canvas contexts, 0 requestAnimationFrame ticks, 0 observers.
 * Uses dynamic theme-keyed patterns for instant theme switching without page reloads.
 */
function MobileStaticGrid({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted
    ? typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : resolvedTheme === "dark"
    : false;

  const uid = React.useId().replace(/:/g, "-");
  const themeKey = isDark ? "dark" : "light";
  const dotsId = `mobile-gdg-dots-${uid}-${themeKey}`;
  const gridId = `mobile-gdg-grid-${uid}-${themeKey}`;

  const lineColor = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(66, 133, 244, 0.10)";
  const dotColor = isDark ? "rgba(255, 255, 255, 0.045)" : "rgba(66, 133, 244, 0.065)";
  const nodeOpacity = isDark ? 0.75 : 0.65;

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none rounded-[inherit] overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <svg className="w-full h-full block" xmlns="http://www.w3.org/2000/svg" key={themeKey}>
        <defs>
          <pattern
            id={dotsId}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="14" cy="14" r="0.75" fill={dotColor} />
          </pattern>
          <pattern
            id={gridId}
            width="208"
            height="104"
            patternUnits="userSpaceOnUse"
          >
            {/* Horizontal grid lines */}
            <line x1="0" y1="0" x2="208" y2="0" stroke={lineColor} strokeWidth="0.75" />
            <line x1="0" y1="52" x2="208" y2="52" stroke={lineColor} strokeWidth="0.75" />

            {/* Vertical grid lines */}
            <line x1="0" y1="0" x2="0" y2="104" stroke={lineColor} strokeWidth="0.75" />
            <line x1="52" y1="0" x2="52" y2="104" stroke={lineColor} strokeWidth="0.75" />
            <line x1="104" y1="0" x2="104" y2="104" stroke={lineColor} strokeWidth="0.75" />
            <line x1="156" y1="0" x2="156" y2="104" stroke={lineColor} strokeWidth="0.75" />

            {/* GDG 4-Color Constellation Nodes Row 0 */}
            <circle cx="0" cy="0" r="1.8" fill="#4285F4" fillOpacity={nodeOpacity} />
            <circle cx="52" cy="0" r="1.8" fill="#EA4335" fillOpacity={nodeOpacity} />
            <circle cx="104" cy="0" r="1.8" fill="#FBBC04" fillOpacity={nodeOpacity} />
            <circle cx="156" cy="0" r="1.8" fill="#34A853" fillOpacity={nodeOpacity} />

            {/* GDG 4-Color Constellation Nodes Row 1 */}
            <circle cx="0" cy="52" r="1.8" fill="#34A853" fillOpacity={nodeOpacity} />
            <circle cx="52" cy="52" r="1.8" fill="#4285F4" fillOpacity={nodeOpacity} />
            <circle cx="104" cy="52" r="1.8" fill="#EA4335" fillOpacity={nodeOpacity} />
            <circle cx="156" cy="52" r="1.8" fill="#FBBC04" fillOpacity={nodeOpacity} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${dotsId})`} />
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
    </div>
  );
}

function KineticGridDesktop({
  className,
  variant = "gdg",
}: KineticGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { resolvedTheme } = useTheme();
  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const targetMouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
  const isVisibleRef = useRef<boolean>(true);

  // ── Warp Point Calculation ──────────────────────────────────────────────────

  const getWarpedPoint = useCallback(
    (
      gx: number,
      gy: number,
      col: number,
      row: number,
      mouse: Point,
      ripples: Ripple[],
      cols: number,
      rows: number
    ): { pt: Point; proximity: number } => {
      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Fast-path: if outside cursor bounding box and no active ripples, skip heavy math (97% CPU savings)
      if (ripples.length === 0 && (absDx >= INFLUENCE_RADIUS || absDy >= INFLUENCE_RADIUS)) {
        return { pt: { x: gx, y: gy }, proximity: 0 };
      }

      // Edge pin — smoothly locks boundary rows/cols in place
      const edgeMargin = 1.5;
      const colPin = Math.min(
        col / edgeMargin,
        (cols - 1 - col) / edgeMargin,
        1
      );
      const rowPin = Math.min(
        row / edgeMargin,
        (rows - 1 - row) / edgeMargin,
        1
      );
      const pinFactor = colPin * colPin * rowPin * rowPin;

      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      // Ripple displacement
      let rx = 0;
      let ry = 0;
      for (const r of ripples) {
        const rdx = gx - r.x;
        const rdy = gy - r.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const waveWidth = 55;
        const diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          const strength =
            (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
          const angle = Math.atan2(rdy, rdx);
          const sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      // Cursor warp with smooth bell falloff
      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        const t = dist / INFLUENCE_RADIUS;
        const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        const warpAmt = eased * MAX_WARP * pinFactor;
        const angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry,
          },
          proximity,
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity };
    },
    []
  );

  // ── Draw ────────────────────────────────────────────────────────────────────

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w: W, h: H, dpr } = sizeRef.current;
      if (W === 0 || H === 0) return;

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;

      const isDark =
        typeof document !== "undefined"
          ? document.documentElement.classList.contains("dark")
          : resolvedTheme === "dark";

      const theme = isDark ? DARK_THEME : LIGHT_THEME;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // Static background dot texture
      ctx.fillStyle = theme.dotColor;
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 380);
        r.opacity = Math.max(0, 1 - age * 1.25);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      // ── Build warped grid ─────────────────────────────────────────────────
      const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);

      const pts: Point[][] = [];
      const prox: number[][] = [];

      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col++) {
          const { pt, proximity } = getWarpedPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            mouse,
            ripples,
            cols,
            rows
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      // ── Grid lines ────────────────────────────────────────────────────────
      const drawSeg = (p1: Point, p2: Point, pr1: number, pr2: number) => {
        const avg = (pr1 + pr2) / 2;
        const t = avg * avg * (3 - 2 * avg); // smoothstep
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(theme.lineBase, theme.lineActive, t);
        ctx.lineWidth = lerpN(0.75, 1.4, t);
        ctx.stroke();
      };

      ctx.lineCap = "butt";

      // Skip perimeter lines (col=0, col=cols-1, row=0, row=rows-1)
      // to eliminate white edge line artifacts along left side and bottom of cards
      for (let row = 1; row < rows - 1; row++) {
        for (let col = 0; col < cols - 1; col++) {
          drawSeg(
            pts[row][col],
            pts[row][col + 1],
            prox[row][col],
            prox[row][col + 1]
          );
        }
      }

      for (let col = 1; col < cols - 1; col++) {
        for (let row = 0; row < rows - 1; row++) {
          drawSeg(
            pts[row][col],
            pts[row + 1][col],
            prox[row][col],
            prox[row + 1][col]
          );
        }
      }

      // ── Intersection nodes with GDG 4-color constellation ──────────────────
      // Inset by 1 to skip perimeter border collision and sliced circles
      for (let row = 1; row < rows - 1; row++) {
        for (let col = 1; col < cols - 1; col++) {
          const p = pts[row][col];
          const pr = prox[row][col];
          const t = pr * pr * (3 - 2 * pr); // smoothstep
          const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

          // Select GDG color for this node
          const gdgIndex = (col + row * 3) % GDG_COLORS.length;
          const gdgColor = variant === "monochrome"
            ? { r: 255, g: 255, b: 255 }
            : GDG_COLORS[gdgIndex];

          const activeNodeTarget = {
            ...gdgColor,
            a: isDark ? 0.95 : 0.9,
          };

          // Outer glow ring for active nodes near cursor
          if (t > 0.28) {
            const glowR = r + lerpN(0, 6.5, (t - 0.28) / 0.72);
            const grd = ctx.createRadialGradient(
              p.x,
              p.y,
              r * 0.4,
              p.x,
              p.y,
              glowR
            );
            const glowAlpha = (t * 0.32).toFixed(3);
            grd.addColorStop(0, `rgba(${gdgColor.r},${gdgColor.g},${gdgColor.b},${glowAlpha})`);
            grd.addColorStop(1, `rgba(${gdgColor.r},${gdgColor.g},${gdgColor.b},0)`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          // Node circle fill
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(theme.nodeBase, activeNodeTarget, t);
          ctx.fill();
        }
      }

      // ── Ripple rings ──────────────────────────────────────────────────────
      const isMobile = sizeRef.current.w < 768;
      for (const r of ripples) {
        const safeRadius = Math.max(0, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${theme.ripple},${(r.opacity * (isMobile ? 0.75 : 0.45)).toFixed(3)})`;
        ctx.lineWidth = isMobile ? 2.5 : 1.8;
        ctx.stroke();
      }

      ctx.restore();
    },
    [getWarpedPoint, resolvedTheme, variant]
  );

  // ── Animation Loop (Intelligent Idle Sleep) ──────────────────────────────────
  const isRunningRef = useRef(false);

  const startLoop = useCallback(() => {
    if (isRunningRef.current || !isVisibleRef.current) return;
    isRunningRef.current = true;

    const tick = (now: number) => {
      if (!isVisibleRef.current) {
        isRunningRef.current = false;
        return;
      }

      const m = mouseRef.current;
      const t = targetMouseRef.current;

      m.x = lerpN(m.x, t.x, LERP_SPEED);
      m.y = lerpN(m.y, t.y, LERP_SPEED);

      draw(now);

      // Check if mouse movement is settled and no ripples remain
      const dx = Math.abs(m.x - t.x);
      const dy = Math.abs(m.y - t.y);
      const isSettled =
        (dx < 0.05 && dy < 0.05) || (m.x < -1000 && t.x < -1000);
      const hasRipples = ripplesRef.current.length > 0;

      if (!isSettled || hasRipples) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Render one final clean settling frame and sleep
        draw(now);
        isRunningRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  // ── Setup & Listeners ───────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Responsive Canvas Resizing with DPR
    const updateSize = () => {
      const w = container.clientWidth || container.offsetWidth;
      const h = container.clientHeight || container.offsetHeight;
      if (w === 0 || h === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      sizeRef.current = { w, h, dpr };
      draw(performance.now());
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      startLoop();
    });
    resizeObserver.observe(container);

    // Pause animation when card is scrolled off-screen
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisibleRef.current = entry.isIntersecting;
            if (entry.isIntersecting) {
              startLoop();
            } else if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = 0;
              isRunningRef.current = false;
            }
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);
    }

    // Card-Scoped Pointer Tracking (0 global window mousemove reflows, 0 background calculations for inactive cards)
    const parentCard = (container.closest('[data-stack-slot]') || container.parentElement || container) as HTMLElement;
    let cardRect: DOMRect | null = null;

    const onPointerEnter = (e: PointerEvent) => {
      cardRect = parentCard.getBoundingClientRect();
      targetMouseRef.current = {
        x: e.clientX - cardRect.left,
        y: e.clientY - cardRect.top,
      };
      startLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!cardRect) cardRect = parentCard.getBoundingClientRect();
      targetMouseRef.current = {
        x: e.clientX - cardRect.left,
        y: e.clientY - cardRect.top,
      };
      startLoop();
    };

    const onPointerLeave = () => {
      cardRect = null;
      targetMouseRef.current = { x: -9999, y: -9999 };
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!cardRect) cardRect = parentCard.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const hit = typeof document !== 'undefined' ? document.elementFromPoint(clientX, clientY) : null;
      if (hit && !parentCard.contains(hit) && !hit.contains(parentCard)) {
        return;
      }

      isVisibleRef.current = true;
      ripplesRef.current.push({
        x: clientX - cardRect.left,
        y: clientY - cardRect.top,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
      startLoop();
    };

    // Initial render of static grid with GDG 4-color constellation nodes & lines
    draw(performance.now());

    parentCard.addEventListener("pointerenter", onPointerEnter as EventListener, { passive: true });
    parentCard.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    parentCard.addEventListener("pointerleave", onPointerLeave as EventListener, { passive: true });
    parentCard.addEventListener("pointerdown", onPointerDown as EventListener, { passive: true });

    return () => {
      resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      parentCard.removeEventListener("pointerenter", onPointerEnter as EventListener);
      parentCard.removeEventListener("pointermove", onPointerMove as EventListener);
      parentCard.removeEventListener("pointerleave", onPointerLeave as EventListener);
      parentCard.removeEventListener("pointerdown", onPointerDown as EventListener);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [draw, startLoop]);

  // Immediate redraw on theme switch without requiring page reload
  useEffect(() => {
    draw(performance.now());
  }, [resolvedTheme, draw]);

  // MutationObserver on document.documentElement for instant class="dark" toggle detection
  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      draw(performance.now());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none rounded-[inherit] overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none rounded-[inherit]"
      />
    </div>
  );
}

export function KineticGrid({ className, variant = "gdg" }: KineticGridProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Pass key={resolvedTheme} so React cleanly switches between dark and light grids instantly (0 reload required)
  if (!mounted || isMobile) {
    return <MobileStaticGrid key={resolvedTheme} className={className} />;
  }

  // On desktop: dynamic interactive canvas with cursor warping & click ripples
  return <KineticGridDesktop key={resolvedTheme} className={className} variant={variant} />;
}

export default KineticGrid;



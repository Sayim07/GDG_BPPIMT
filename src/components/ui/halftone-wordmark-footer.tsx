"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface HalftoneWordmarkFooterProps {
  /** The word printed in dots. */
  wordmark?: string;
  /** Top-left title. */
  label?: string;
  /** The muted subtitle under it. */
  meta?: string;
  /** Link columns along the top. */
  columns?: FooterColumn[];
  /** Show the back-to-top link. */
  backToTop?: boolean;
  /** Distance between dot centres in CSS px. Defaults to 7. */
  dotGap?: number;
  /** How far the pointer pushes, in CSS px. Defaults to 85. */
  radius?: number;
  /** How much of the word hangs below the bottom edge. Defaults to 0.15. */
  crop?: number;
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean;
  /** Face for the wordmark. Defaults to Product Sans. */
  fontFamily?: string;
  /** Weight of the wordmark. Defaults to 900. */
  fontWeight?: number;
  /** Root height. A definite length. Defaults to 520px. */
  height?: string;
  /** Extra root class names. */
  className?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Navigation",
    links: [
      { label: "About", href: "/#about" },
      { label: "Tracks", href: "/#tracks" },
      { label: "Events", href: "/events" },
      { label: "Team", href: "/team" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "Official Chapter Page",
        href: "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/",
      },
      { label: "GitHub", href: "https://github.com/Sayim07/GDG_BPPIMT" },
    ],
  },
];

/** Dot radius for a cell coverage in [0, 1] */
function hwfRadius(coverage: number, gap: number): number {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * gap * 0.54;
}

/** One step of spring physics */
function hwfStep(
  x: number,
  y: number,
  vx: number,
  vy: number,
  hx: number,
  hy: number,
  px: number,
  py: number,
  r: number
): [number, number, number, number] {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / r) * 2.8;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  vx = (vx + (hx - x) * 0.055) * 0.83;
  vy = (vy + (hy - y) * 0.055) * 0.83;
  return [x + vx, y + vy, vx, vy];
}

/** How warm/bright a dot is drawn */
function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number): number {
  const d = Math.hypot(x - hx, y - hy);
  return span > 0 ? Math.min(1, d / span) : 0;
}

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--hwf-border);
  transition: background-color 0.25s ease, color 0.25s ease;
}
.hwf-root canvas {
  position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none;
  pointer-events: auto; cursor: pointer;
}
.hwf-top {
  position: relative; z-index: 2; display: flex; flex-wrap: wrap; justify-content: space-between;
  gap: 32px; padding: clamp(24px, 4vw, 44px) clamp(20px, 4vw, 48px) 0;
  font-size: 11px; letter-spacing: .15em; text-transform: uppercase; line-height: 1.75;
}
.hwf-brand strong { display: block; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; }
.hwf-brand span { opacity: .6; text-transform: none; letter-spacing: normal; font-size: 12px; }
.hwf-nav { display: flex; flex-wrap: wrap; gap: clamp(24px, 4vw, 56px); }
.hwf-col h3 { margin: 0 0 8px 0; font: inherit; opacity: .45; font-weight: 600; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .75; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s ease;
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 2; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: clamp(16px, 2.5vw, 28px) clamp(20px, 4vw, 48px) 0; padding-top: 12px;
  border-top: 0.5px solid var(--hwf-border);
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
}
.hwf-hint {
  position: absolute; bottom: 12px; right: 24px; z-index: 2;
  font-size: 10px; opacity: 0.35; letter-spacing: 0.08em; text-transform: uppercase;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`;

export function HalftoneWordmarkFooter({
  wordmark = "GDG BPPIMT",
  label = "GDG on Campus BPPIMT",
  meta = "B.P. Poddar Institute of Management and Technology • Kolkata",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  dotGap = 7,
  radius = 85,
  crop = 0.1,
  interactive = true,
  fontFamily = '"Product Sans", "Google Sans", system-ui, sans-serif',
  fontWeight = 700,
  height = "560px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = React.useMemo(() => {
    return isDark
      ? {
          background: "#131314",
          ink: "#E8EAED",
          border: "rgba(255, 255, 255, 0.1)",
        }
      : {
          background: "#FFFFFF",
          ink: "#202124",
          border: "rgba(0, 0, 0, 0.08)",
        };
  }, [isDark]);

  const rootRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const opts = React.useRef({
    colors,
    dotGap,
    radius,
    crop,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  });
  opts.current = {
    colors,
    dotGap,
    radius,
    crop,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  };

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    let colorActive = false;
    let lastColorToggleTime = 0;
    let wave = { x: 0, y: 0, t: -1, target: 0 };

    // Flat array layout: [x, y, vx, vy, hx, hy, rad, r, g, b, isLogo] (11 floats per dot)
    let dots = new Float32Array(0);
    let count = 0;
    let dotColorProgress = new Float32Array(0);

    // Pre-load the official GDG Logo so it is rendered in halftone dots as well
    const logoImg = new Image();
    logoImg.src = "/images/gdg-logo.png";

    const layout = () => {
      const o = opts.current;
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Create two offscreen canvas masks: one for GDG Logo, one for Wordmark Text
      const maskLogo = document.createElement("canvas");
      maskLogo.width = w;
      maskLogo.height = h;
      const mLogo = maskLogo.getContext("2d", { willReadFrequently: true });

      const maskText = document.createElement("canvas");
      maskText.width = w;
      maskText.height = h;
      const mText = maskText.getContext("2d", { willReadFrequently: true });

      if (!mLogo || !mText) return;

      // Available vertical space for the interactive halftone artwork
      const availTop = Math.min(130, h * 0.24);
      const availBottom = h - 35;
      const availH = Math.max(120, availBottom - availTop);

      // 1. Resolve clean font family for Canvas 2D (Canvas silently ignores var(--...) strings)
      let canvasFont = '"Product Sans", "Google Sans", system-ui, sans-serif';
      try {
        const computed = getComputedStyle(document.body).fontFamily;
        if (computed) {
          const sanitized = computed.replace(/var\([^)]+\),?\s*/g, "").trim();
          if (sanitized) {
            canvasFont = `${sanitized}, "Product Sans", "Google Sans", system-ui, sans-serif`;
          }
        }
      } catch {
        // Fallback to Product Sans stack
      }

      // 2. Calculate typography layout for the wordmark
      const word = o.wordmark || "GDG • BPPIMT, KOLKATA";
      mText.font = `bold 100px ${canvasFont}`;
      const measure100 = mText.measureText(word).width || 800;
      // Target width is ~88% of screen width (min 300, max 1050px)
      const targetW = Math.max(300, Math.min(w * 0.88, 1050));
      const fontSize = Math.max(28, (targetW / measure100) * 100);
      mText.font = `bold ${Math.round(fontSize)}px ${canvasFont}`;
      const box = mText.measureText(word);
      const cap = box.actualBoundingBoxAscent || fontSize * 0.72;

      // 3. Logo sizing proportional to canvas
      let logoH = Math.min(h * 0.18, 75);
      let logoW = logoH * (692 / 406);
      if (logoImg.complete && logoImg.naturalWidth > 0 && logoImg.naturalHeight > 0) {
        logoW = logoH * (logoImg.naturalWidth / logoImg.naturalHeight);
      }
      const logoTextGap = Math.max(14, fontSize * 0.24);

      // 4. Pin wordmark snug to the bottom edge with minimal gap (zero extra dead space)
      const bottomPadding = 8;
      const textBaseline = h - bottomPadding;
      const logoY = textBaseline - cap - logoTextGap - logoH;
      const logoX = (w - logoW) / 2;
      const textX = (w - box.width) / 2;

      // 5. Draw GDG Logo on maskLogo
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        mLogo.drawImage(logoImg, logoX, logoY, logoW, logoH);
      }

      // 6. Render Google 4-Color Gradient for the Wordmark Text on maskText
      const textGrad = mText.createLinearGradient(textX, 0, textX + box.width, 0);
      textGrad.addColorStop(0.0, "#4285F4"); // Google Blue
      textGrad.addColorStop(0.32, "#EA4335"); // Google Red
      textGrad.addColorStop(0.68, "#FBBC04"); // Google Yellow
      textGrad.addColorStop(1.0, "#34A853"); // Google Green

      mText.fillStyle = textGrad;
      mText.textBaseline = "alphabetic";
      mText.fillText(word, textX, textBaseline);

      const imgLogo = mLogo.getImageData(0, 0, w, h).data;
      const imgText = mText.getImageData(0, 0, w, h).data;
      const dotSpacing = Math.max(4, o.dotGap);
      const cols = Math.ceil(w / dotSpacing);
      const rows = Math.ceil(h / dotSpacing);
      const tmp: number[] = [];

      // 7. Sample cells to create the halftone dot grid
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let logoAlpha = 0, logoR = 0, logoG = 0, logoB = 0, logoCount = 0;
          let textAlpha = 0, textR = 0, textG = 0, textB = 0, textCount = 0;

          // 3x3 supersampling inside each cell
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * dotSpacing + ((sx + 0.5) * dotSpacing) / 3));
              const y = Math.min(h - 1, Math.floor(gy * dotSpacing + ((sy + 0.5) * dotSpacing) / 3));
              const idx = (y * w + x) * 4;

              const la = imgLogo[idx + 3];
              logoAlpha += la;
              if (la > 30) {
                logoR += imgLogo[idx];
                logoG += imgLogo[idx + 1];
                logoB += imgLogo[idx + 2];
                logoCount++;
              }

              const ta = imgText[idx + 3];
              textAlpha += ta;
              if (ta > 30) {
                textR += imgText[idx];
                textG += imgText[idx + 1];
                textB += imgText[idx + 2];
                textCount++;
              }
            }
          }

          const covLogo = logoAlpha / (9 * 255);
          const covText = textAlpha / (9 * 255);

          if (covLogo >= 0.05) {
            const hx = gx * dotSpacing + dotSpacing / 2;
            const hy = gy * dotSpacing + dotSpacing / 2;
            const r = logoCount > 0 ? Math.round(logoR / logoCount) : 66;
            const g = logoCount > 0 ? Math.round(logoG / logoCount) : 133;
            const b = logoCount > 0 ? Math.round(logoB / logoCount) : 244;
            // [x, y, vx, vy, hx, hy, rad, r, g, b, isLogo]
            tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(covLogo, dotSpacing), r, g, b, 1);
          } else if (covText >= 0.05) {
            const hx = gx * dotSpacing + dotSpacing / 2;
            const hy = gy * dotSpacing + dotSpacing / 2;
            const r = textCount > 0 ? Math.round(textR / textCount) : 66;
            const g = textCount > 0 ? Math.round(textG / textCount) : 133;
            const b = textCount > 0 ? Math.round(textB / textCount) : 244;
            // [x, y, vx, vy, hx, hy, rad, r, g, b, isLogo]
            tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(covText, dotSpacing), r, g, b, 0);
          }
        }
      }

      dots = new Float32Array(tmp);
      count = tmp.length / 11;

      // Initialize or preserve dot color progress
      const newProgress = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const isLogo = dots[i * 11 + 10];
        newProgress[i] = isLogo === 1 ? 1 : colorActive ? 1 : 0;
      }
      dotColorProgress = newProgress;
      awake = true;
    };

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      layout();
    } else {
      logoImg.onload = () => {
        layout();
        wake();
      };
    }

    const draw = (now: number) => {
      const o = opts.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.colors.background;
      ctx.fillRect(0, 0, w, h);

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.95;
      const waveAge = wave.t < 0 ? 1e9 : now - wave.t;
      const waveR = waveAge * 1.15;
      let moving = false;

      const isDarkTheme = o.colors.ink === "#E8EAED";
      const monoR = isDarkTheme ? 232 : 32;
      const monoG = isDarkTheme ? 234 : 33;
      const monoB = isDarkTheme ? 237 : 36;

      for (let i = 0; i < count; i++) {
        const j = i * 11;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];
        const rad = dots[j + 6];
        const cr = dots[j + 7];
        const cg = dots[j + 8];
        const cb = dots[j + 9];
        const isLogo = dots[j + 10];

        // Animate color transition for text dots
        if (isLogo === 0 && wave.t >= 0) {
          const dist = Math.hypot(hx - wave.x, hy - wave.y);
          if (waveR >= dist) {
            const diff = wave.target - dotColorProgress[i];
            if (Math.abs(diff) > 0.008) {
              dotColorProgress[i] += diff * 0.12;
              moving = true;
            } else {
              dotColorProgress[i] = wave.target;
            }
          } else {
            // Wave hasn't reached this dot yet; keep animating
            moving = true;
          }
        }

        if (!reduced) {
          // Shockwave ripple ring physics on click
          if (ringAge < 900) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 28);
            if (band > 0) {
              const f = band * 3.4 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }

          // Pointer spring repulsion
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r);
          x = s[0];
          y = s[1];
          vx = s[2];
          vy = s[3];

          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true;
          } else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }

        // Base color calculation: Logo is always official colors; text starts monochrome and blooms on click
        let baseR: number, baseG: number, baseB: number;
        if (isLogo === 1) {
          baseR = cr;
          baseG = cg;
          baseB = cb;
        } else {
          const blend = dotColorProgress[i];
          baseR = Math.round(monoR + (cr - monoR) * blend);
          baseG = Math.round(monoG + (cg - monoG) * blend);
          baseB = Math.round(monoB + (cb - monoB) * blend);
        }

        // Color temperature glow when displaced by cursor
        const k = hwfWarmth(x, y, hx, hy, 28);
        if (k > 0.02) {
          const blend = isLogo === 1 ? 1 : dotColorProgress[i];
          if (blend > 0.2) {
            const nr = Math.min(255, Math.round(baseR + (255 - baseR) * k * 0.85));
            const ng = Math.min(255, Math.round(cg + (255 - cg) * k * 0.85));
            const nb = Math.min(255, Math.round(cb + (255 - cb) * k * 0.85));
            ctx.fillStyle = `rgb(${nr},${ng},${nb})`;
          } else {
            if (isDarkTheme) {
              const nr = Math.min(255, Math.round(baseR + 25 * k));
              const ng = Math.min(255, Math.round(baseG + 25 * k));
              const nb = Math.min(255, Math.round(baseB + 25 * k));
              ctx.fillStyle = `rgb(${nr},${ng},${nb})`;
            } else {
              const nr = Math.max(0, Math.round(baseR - 30 * k));
              const ng = Math.max(0, Math.round(baseG - 30 * k));
              const nb = Math.max(0, Math.round(baseB - 30 * k));
              ctx.fillStyle = `rgb(${nr},${ng},${nb})`;
            }
          }
        } else {
          ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
        }

        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 6.2832);
        ctx.fill();
      }

      // Keep animation loop alive if moving, during ripple ring, or during color wave
      awake = moving || ringAge < 900 || waveAge < 1400 || px > -1e4;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent): [number, number] => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };

    const onMove = (e: PointerEvent) => {
      if (!opts.current.interactive) return;
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };

    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };

    const onDown = (e: PointerEvent) => {
      if (!opts.current.interactive || reduced) return;
      if ((e.target as HTMLElement).closest("a,button")) return;
      const p = toLocal(e);
      const now = performance.now();

      // Trigger physical shockwave ripple
      ring = { x: p[0], y: p[1], t: now };

      // Trigger color bloom / wave on wordmark
      if (!colorActive) {
        colorActive = true;
        lastColorToggleTime = now;
        wave = { x: p[0], y: p[1], t: now, target: 1 };
      } else {
        if (now - lastColorToggleTime > 1200) {
          colorActive = false;
          lastColorToggleTime = now;
          wave = { x: p[0], y: p[1], t: now, target: 0 };
        } else {
          // Rapid click: refresh wave to keep colors active
          wave = { x: p[0], y: p[1], t: now, target: 1 };
        }
      }
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);

    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(root);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        layout();
        wake();
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [wordmark, dotGap, crop, fontFamily, fontWeight, colors]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      className={`hwf-root ${className}`}
      style={
        {
          height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-border": colors.border,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />

      {/* Top Header Row with Studio info and Links */}
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>{label}</strong>
          <span>{meta}</span>
        </div>
        <div className="hwf-nav">
          {columns.map((col) => (
            <nav className="hwf-col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href || "#"}
                      target={l.href?.startsWith("http") ? "_blank" : undefined}
                      rel={l.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Hairline Rule with Back-to-Top Button */}
      <div className="hwf-rule">
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={toTop}>
            Back to top ↑
          </button>
        ) : null}
      </div>
    </footer>
  );
}


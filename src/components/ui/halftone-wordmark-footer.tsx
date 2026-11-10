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
      { label: "LinkedIn", href: "https://www.linkedin.com/company/gdg-bppimt/" },
      { label: "WhatsApp", href: "https://chat.whatsapp.com/invite/gdg-bppimt" },
      { label: "Instagram", href: "https://www.instagram.com/gdg_bppimt" },
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
  min-height: 100dvh;
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
  gap: 32px; padding: clamp(28px, 4vw, 44px) clamp(20px, 4vw, 48px) clamp(24px, 3.5vw, 36px);
  background: var(--hwf-top-bg);
  border-bottom: 1px solid var(--hwf-border);
  font-size: 11px; letter-spacing: .15em; text-transform: uppercase; line-height: 1.75;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.hwf-brand strong { display: block; font-weight: 700; font-size: 14px; letter-spacing: 0.05em; color: var(--hwf-ink); }
.hwf-brand span { display: block; margin-top: 4px; color: var(--hwf-muted); text-transform: none; letter-spacing: normal; font-size: 12px; font-weight: 400; }
.hwf-collab {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 14px;
  padding-top: 10px; border-top: 1px solid var(--hwf-border);
}
.hwf-collab-cross {
  font-size: 11px; color: var(--hwf-muted); opacity: 0.6; font-weight: 500; user-select: none;
}
.hwf-collab-logo {
  display: flex; align-items: center; justify-content: center;
}
.hwf-collab-logo-bppimt {
  border-radius: 9999px; background-color: #ffffff; padding: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.hwf-nav { display: flex; flex-wrap: wrap; gap: clamp(24px, 4vw, 56px); }
.hwf-col h3 { margin: 0 0 10px 0; font: inherit; color: var(--hwf-muted); font-weight: 700; letter-spacing: 0.12em; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.hwf-col a {
  color: var(--hwf-link); text-decoration: none; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: color .2s ease, background-size .35s ease;
}
.hwf-col a:hover { color: var(--hwf-accent); background-size: 100% 1px; }
.hwf-col a:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; }
.hwf-mascot-wrapper {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  pointer-events: auto;
  line-height: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.hwf-mascot-img {
  width: clamp(230px, 25vw, 370px);
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: auto;
  filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.12));
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease;
}
.hwf-mascot-img:hover {
  transform: scale(1.03) translateY(-4px);
  filter: drop-shadow(0 8px 24px rgba(66, 133, 244, 0.3));
}
.dark .hwf-mascot-img {
  filter: drop-shadow(0 0 20px rgba(66, 133, 244, 0.22)) drop-shadow(0 6px 16px rgba(0, 0, 0, 0.6));
}
.dark .hwf-mascot-img:hover {
  filter: drop-shadow(0 0 28px rgba(66, 133, 244, 0.4)) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.8));
}
@media (max-width: 860px) {
  .hwf-top {
    padding-bottom: 125px !important;
  }
  .hwf-mascot-img {
    width: clamp(190px, 48vw, 280px);
  }
}
.hwf-rule {
  position: relative; z-index: 2; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: 0 clamp(20px, 4vw, 48px); padding-top: 14px;
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
}
.hwf-up {
  color: var(--hwf-muted); text-decoration: none; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  font-weight: 600; transition: color .2s ease;
}
.hwf-up:hover {
  color: var(--hwf-accent);
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Before mounting, default to light theme to match SSR and avoid hydration mismatch
  const isDark = mounted && resolvedTheme === "dark";

  const colors = React.useMemo(() => {
    return isDark
      ? {
          background: "#131314",
          topBackground: "#1A1B1E",
          ink: "#E8EAED",
          muted: "#9AA0A6",
          link: "#BDC1C6",
          accent: "#8AB4F8",
          border: "rgba(255, 255, 255, 0.12)",
        }
      : {
          background: "#FFFFFF",
          topBackground: "#F8F9FA", // Soft faded Google Material surface
          ink: "#202124",
          muted: "#5F6368",
          link: "#3C4043",
          accent: "#1A73E8",
          border: "#DADCE0", // Clean, visible divider line
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

      // Available vertical space for the interactive halftone artwork on full-page frame
      const ruleEl = root.querySelector(".hwf-rule") as HTMLElement | null;
      let topUIBottom = 160;
      if (ruleEl) {
        topUIBottom = Math.round(ruleEl.getBoundingClientRect().bottom - rect.top) + 20;
      }
      const availTop = Math.max(140, Math.min(topUIBottom, Math.round(h * 0.3)));
      const availBottom = h - Math.max(24, Math.round(h * 0.05));
      const availH = Math.max(140, availBottom - availTop);

      // 1. Resolve bold high-impact font family for Canvas 2D (like 21st.dev bold wordmark)
      const canvasFont = 'Impact, "Arial Black", "Product Sans", "Google Sans", system-ui, sans-serif';

      // 2. Calculate typography layout for the wordmark to fill the page width and height
      const word = o.wordmark || "GDG • BPPIMT, KOLKATA";
      mText.font = `900 100px ${canvasFont}`;
      const measure100 = mText.measureText(word).width || 850;

      // Target width: Fill ~95% to 97% of page width, leaving clean edge padding
      const maxFillW = Math.max(300, w - Math.max(24, Math.round(w * 0.04)));
      let fontSize = (maxFillW / measure100) * 100;

      // 3. Size GDG Logo proportionally to match the bold expanded wordmark
      let logoH = Math.min(Math.round(availH * 0.36), Math.max(70, Math.round(fontSize * 1.05)));
      let logoW = logoH * (692 / 406);
      if (logoImg.complete && logoImg.naturalWidth > 0 && logoImg.naturalHeight > 0) {
        logoW = logoH * (logoImg.naturalWidth / logoImg.naturalHeight);
      }
      const logoTextGap = Math.max(16, Math.round(availH * 0.04));

      // 4. Calculate vertical stretch & cap height to fill vertical space like 21st.dev
      mText.font = `900 ${Math.round(fontSize)}px ${canvasFont}`;
      const box = mText.measureText(word);
      const naturalCap = box.actualBoundingBoxAscent || fontSize * 0.78;
      const naturalDescent = box.actualBoundingBoxDescent || fontSize * 0.16;

      // Vertical space target: allow text to expand vertically while strictly staying in frame
      const targetTextH = Math.max(naturalCap, (availH - logoH - logoTextGap) * 0.62);
      let textScaleY = Math.min(1.45, Math.max(1.0, targetTextH / naturalCap));

      // Calculate total effective artwork height with vertical scaling
      let effectiveCap = naturalCap * textScaleY;
      let effectiveDescent = naturalDescent * textScaleY;
      let totalArtworkH = logoH + logoTextGap + effectiveCap + effectiveDescent;

      // Safety check: Ensure total artwork never overflows availH
      if (totalArtworkH > availH * 0.88) {
        const vScale = (availH * 0.88) / totalArtworkH;
        fontSize = Math.round(fontSize * vScale);
        logoH = Math.round(logoH * vScale);
        logoW = Math.round(logoW * vScale);
        textScaleY = Math.max(1.0, textScaleY * vScale);
        mText.font = `900 ${Math.round(fontSize)}px ${canvasFont}`;
        effectiveCap = (box.actualBoundingBoxAscent || fontSize * 0.78) * textScaleY;
        effectiveDescent = (box.actualBoundingBoxDescent || fontSize * 0.16) * textScaleY;
        totalArtworkH = logoH + logoTextGap + effectiveCap + effectiveDescent;
      }

      // Re-measure box at final font size
      const finalBox = mText.measureText(word);

      // 5. Center-aligned framing within available vertical space
      const availCenter = availTop + (availBottom - availTop) * 0.5;
      let logoY = Math.round(availCenter - totalArtworkH / 2);
      if (logoY < availTop + 10) logoY = availTop + 10;
      if (logoY + totalArtworkH > availBottom) {
        logoY = availBottom - totalArtworkH;
      }
      const textBaseline = Math.round(logoY + logoH + logoTextGap + effectiveCap);
      const logoX = Math.round((w - logoW) / 2);
      const textX = Math.round((w - finalBox.width) / 2);

      // 6. Draw GDG Logo on maskLogo
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        mLogo.drawImage(logoImg, logoX, logoY, logoW, logoH);
      }

      // 7. Render Google 4-Color Gradient for Wordmark Text on maskText with vertical scale
      mText.save();
      mText.translate(textX, textBaseline);
      mText.scale(1, textScaleY);

      const textGrad = mText.createLinearGradient(0, 0, finalBox.width, 0);
      textGrad.addColorStop(0.0, "#4285F4"); // Google Blue
      textGrad.addColorStop(0.32, "#EA4335"); // Google Red
      textGrad.addColorStop(0.68, "#FBBC04"); // Google Yellow
      textGrad.addColorStop(1.0, "#34A853"); // Google Green

      mText.fillStyle = textGrad;
      mText.textBaseline = "alphabetic";
      mText.fillText(word, 0, 0);
      mText.restore();

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
          minHeight: height || "100dvh",
          "--hwf-bg": colors.background,
          "--hwf-top-bg": colors.topBackground,
          "--hwf-ink": colors.ink,
          "--hwf-muted": colors.muted,
          "--hwf-link": colors.link,
          "--hwf-accent": colors.accent,
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

          {/* Collaboration Logos */}
          <div className="hwf-collab">
            <div className="hwf-collab-logo">
              <img
                src="/images/gdg-logo.svg"
                alt="Google Developer Groups"
                loading="lazy"
                decoding="async"
                width={80}
                height={28}
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
            <div className="hwf-collab-cross" aria-hidden="true">✕</div>
            <div className="hwf-collab-logo">
              <img
                src="/images/bppimt-logo.png"
                alt="B.P. Poddar Institute of Management and Technology"
                loading="lazy"
                decoding="async"
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 3D Mascot Resting on the Dividing Line */}
        <div className="hwf-mascot-wrapper">
          <img
            src="/images/gdg-mascot-welcome.png"
            alt="Welcome to GDG On Campus - Code, Create, Connect"
            className="hwf-mascot-img"
            width={762}
            height={327}
            loading="lazy"
            decoding="async"
          />
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


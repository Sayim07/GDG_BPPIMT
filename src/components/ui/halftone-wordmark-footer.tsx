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
    padding-bottom: 120px !important;
  }
  .hwf-mascot-img {
    width: clamp(185px, 46vw, 260px);
  }
}
@media (max-width: 767px) {
  .hwf-root {
    height: auto !important;
    min-height: 0 !important;
  }
  .hwf-top {
    gap: 20px;
    padding: 24px 18px 104px !important;
  }
  .hwf-nav {
    width: 100%;
    justify-content: space-between;
    gap: 20px;
  }
  .hwf-mascot-img {
    width: clamp(165px, 44vw, 225px);
  }
  .hwf-hint {
    display: none;
  }
}
.hwf-mobile-stage {
  position: relative;
  z-index: 1;
  width: 100%;
  pointer-events: none;
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
  const stageRef = React.useRef<HTMLDivElement | null>(null);
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
      const stageEl = stageRef.current;
      let rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      const isMobile = w < 768;

      // Resolve actual bottom edge of top footer UI + rule so artwork never hides behind .hwf-top
      const ruleEl = root.querySelector(".hwf-rule") as HTMLElement | null;
      let topUIBottom = 160;
      if (ruleEl) {
        topUIBottom = Math.round(ruleEl.getBoundingClientRect().bottom - rect.top) + (isMobile ? 14 : 20);
      }

      const canvasFont = 'Impact, "Arial Black", "Product Sans", "Google Sans", system-ui, sans-serif';
      const word = o.wordmark || "GDG • BPPIMT, KOLKATA";

      // Wrap onto 2 balanced lines on mobile so wordmark stays bold & eliminates bottom void space
      let lines: string[] = [word];
      if (isMobile && word.length > 12) {
        if (word.includes(",")) {
          const commaIdx = word.indexOf(",");
          const first = word.slice(0, commaIdx).trim();
          const second = word.slice(commaIdx + 1).trim();
          if (first && second) lines = [first, second];
        } else {
          const parts = word.trim().split(/\s+/);
          if (parts.length >= 2) {
            const mid = Math.ceil(parts.length / 2);
            lines = [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
          }
        }
      }

      const measureCanvas = document.createElement("canvas");
      const mMeasure = measureCanvas.getContext("2d");
      if (!mMeasure) return;

      mMeasure.font = `900 100px ${canvasFont}`;
      let maxMeasure100 = 0;
      for (const ln of lines) {
        maxMeasure100 = Math.max(maxMeasure100, mMeasure.measureText(ln).width || 400);
      }

      const logoAspect =
        logoImg.complete && logoImg.naturalWidth > 0 && logoImg.naturalHeight > 0
          ? logoImg.naturalWidth / logoImg.naturalHeight
          : 692 / 406;

      h = Math.max(1, Math.round(rect.height));
      let fontSize = 48;
      let logoH = 72;
      let logoW = 122;
      let textScaleY = 1.0;
      let effectiveCap = 40;
      let lineGap = 10;
      let logoTextGap = 18;
      let logoY = topUIBottom + 10;
      const lineBaselines: number[] = [];
      const lineWidths: number[] = [];

      if (isMobile) {
        const maxFillW = Math.max(220, w - 32);
        fontSize = Math.min(68, Math.max(32, (maxFillW / maxMeasure100) * 100 * 0.94));
        mMeasure.font = `900 ${Math.round(fontSize)}px ${canvasFont}`;
        const sampleBox = mMeasure.measureText(lines[0]);
        const naturalCap = sampleBox.actualBoundingBoxAscent || fontSize * 0.76;
        const naturalDescent = sampleBox.actualBoundingBoxDescent || fontSize * 0.14;

        textScaleY = 1.12;
        effectiveCap = naturalCap * textScaleY;
        const effectiveDescent = naturalDescent * textScaleY;
        lineGap = Math.max(10, Math.round(fontSize * 0.24));
        logoTextGap = 16;

        logoH = Math.min(92, Math.max(58, Math.round(fontSize * 1.38)));
        logoW = logoH * logoAspect;
        if (logoW > w * 0.44) {
          logoW = Math.round(w * 0.44);
          logoH = Math.round(logoW / logoAspect);
        }

        const totalTextH = lines.length * effectiveCap + Math.max(0, lines.length - 1) * lineGap + effectiveDescent;
        const totalArtworkH = logoH + logoTextGap + totalTextH;
        const topPad = 14;
        const bottomPad = 28;
        const neededStageH = Math.round(topPad + totalArtworkH + bottomPad);

        if (stageEl) {
          const prevStageH = parseFloat(stageEl.style.height) || 0;
          if (Math.abs(prevStageH - neededStageH) > 2) {
            stageEl.style.height = `${neededStageH}px`;
            rect = root.getBoundingClientRect();
            h = Math.max(1, Math.round(rect.height));
          }
        }

        logoY = topUIBottom + topPad;
        let curY = logoY + logoH + logoTextGap + effectiveCap;
        for (let li = 0; li < lines.length; li++) {
          lineBaselines.push(Math.round(curY));
          lineWidths.push(mMeasure.measureText(lines[li]).width);
          curY += effectiveCap + lineGap;
        }
      } else {
        if (stageEl && stageEl.style.height !== "0px") {
          stageEl.style.height = "0px";
          rect = root.getBoundingClientRect();
          h = Math.max(1, Math.round(rect.height));
        }

        const availTop = Math.max(140, topUIBottom);
        const availBottom = h - Math.max(24, Math.round(h * 0.05));
        const availH = Math.max(140, availBottom - availTop);

        const maxFillW = Math.max(300, w - Math.max(24, Math.round(w * 0.04)));
        fontSize = (maxFillW / maxMeasure100) * 100;

        logoH = Math.min(Math.round(availH * 0.36), Math.max(70, Math.round(fontSize * 1.05)));
        logoW = logoH * logoAspect;
        logoTextGap = Math.max(16, Math.round(availH * 0.04));

        mMeasure.font = `900 ${Math.round(fontSize)}px ${canvasFont}`;
        const box = mMeasure.measureText(lines[0]);
        const naturalCap = box.actualBoundingBoxAscent || fontSize * 0.78;
        const naturalDescent = box.actualBoundingBoxDescent || fontSize * 0.16;

        const targetTextH = Math.max(naturalCap, (availH - logoH - logoTextGap) * 0.62);
        textScaleY = Math.min(1.45, Math.max(1.0, targetTextH / naturalCap));

        effectiveCap = naturalCap * textScaleY;
        let effectiveDescent = naturalDescent * textScaleY;
        let totalArtworkH = logoH + logoTextGap + effectiveCap + effectiveDescent;

        if (totalArtworkH > availH * 0.88) {
          const vScale = (availH * 0.88) / totalArtworkH;
          fontSize = Math.round(fontSize * vScale);
          logoH = Math.round(logoH * vScale);
          logoW = Math.round(logoW * vScale);
          textScaleY = Math.max(1.0, textScaleY * vScale);
          mMeasure.font = `900 ${Math.round(fontSize)}px ${canvasFont}`;
          const updatedBox = mMeasure.measureText(lines[0]);
          effectiveCap = (updatedBox.actualBoundingBoxAscent || fontSize * 0.78) * textScaleY;
          effectiveDescent = (updatedBox.actualBoundingBoxDescent || fontSize * 0.16) * textScaleY;
          totalArtworkH = logoH + logoTextGap + effectiveCap + effectiveDescent;
        }

        const availCenter = availTop + (availBottom - availTop) * 0.5;
        logoY = Math.round(availCenter - totalArtworkH / 2);
        if (logoY < availTop + 10) logoY = availTop + 10;
        if (logoY + totalArtworkH > availBottom) {
          logoY = availBottom - totalArtworkH;
        }
        lineBaselines.push(Math.round(logoY + logoH + logoTextGap + effectiveCap));
        lineWidths.push(mMeasure.measureText(lines[0]).width);
      }

      dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
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

      const logoX = Math.round((w - logoW) / 2);

      // Draw GDG Logo on maskLogo
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        mLogo.drawImage(logoImg, logoX, logoY, logoW, logoH);
      }

      // Render Google 4-Color Gradient for Wordmark Text on maskText
      mText.font = `900 ${Math.round(fontSize)}px ${canvasFont}`;
      mText.textBaseline = "alphabetic";
      for (let li = 0; li < lines.length; li++) {
        const lineStr = lines[li];
        const lw = lineWidths[li];
        const lx = Math.round((w - lw) / 2);
        const ly = lineBaselines[li];

        mText.save();
        mText.translate(lx, ly);
        mText.scale(1, textScaleY);

        const textGrad = mText.createLinearGradient(0, 0, Math.max(1, lw), 0);
        textGrad.addColorStop(0.0, "#4285F4"); // Google Blue
        textGrad.addColorStop(0.32, "#EA4335"); // Google Red
        textGrad.addColorStop(0.68, "#FBBC04"); // Google Yellow
        textGrad.addColorStop(1.0, "#34A853"); // Google Green

        mText.fillStyle = textGrad;
        mText.fillText(lineStr, 0, 0);
        mText.restore();
      }

      const imgLogo = mLogo.getImageData(0, 0, w, h).data;
      const imgText = mText.getImageData(0, 0, w, h).data;
      const dotSpacing = isMobile ? Math.max(4, Math.min(o.dotGap, 5)) : Math.max(4, o.dotGap);
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

    const onTouchEnd = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        onLeave();
      }
    };

    layout();
    draw(performance.now());
    wake();

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerup", onTouchEnd);
    root.addEventListener("pointercancel", onLeave);
    root.addEventListener("pointerdown", onDown);

    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      const cw = Math.round(cr.width);
      const ch = Math.round(cr.height);
      if (cw === lastW && (cw < 768 ? Math.abs(ch - lastH) < 4 : ch === lastH)) return;
      lastW = cw;
      lastH = ch;
      layout();
      draw(performance.now());
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
        draw(performance.now());
        wake();
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerup", onTouchEnd);
      root.removeEventListener("pointercancel", onLeave);
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
            src="/images/gdg-mascot-dream-build.png"
            alt="Dream. Build. Innovate. Together at GDG"
            className="hwf-mascot-img"
            width={762}
            height={327}
            loading="eager"
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

      {/* Dynamic Artwork Spacer on Mobile (prevents 100dvh jump & bottom void) */}
      <div ref={stageRef} className="hwf-mobile-stage" aria-hidden="true" />
    </footer>
  );
}


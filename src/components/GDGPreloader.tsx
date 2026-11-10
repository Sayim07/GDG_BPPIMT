"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface GDGPreloaderProps {
  /** Optional callback fired when the preloader finishes and unmounts */
  onComplete?: () => void;
  /** Total duration in ms before exit starts (default: 2800ms) */
  duration?: number;
}

export default function GDGPreloader({
  onComplete,
  duration = 2800,
}: GDGPreloaderProps) {
  const [stage, setStage] = useState<"bounce" | "logo" | "exit" | "done">(
    "bounce"
  );

  useEffect(() => {
    // 1. Switch from bouncing dots to SVG logo reveal
    const logoTimer = setTimeout(() => {
      setStage("logo");
    }, 1350);

    // 2. Trigger fade-out curtain exit
    const exitTimer = setTimeout(() => {
      setStage("exit");
    }, duration);

    // 3. Unmount completely from DOM
    const doneTimer = setTimeout(() => {
      setStage("done");
      onComplete?.();
    }, duration + 550);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onComplete]);

  if (stage === "done") return null;

  return (
    <div
      role="status"
      aria-label="Loading Google Developer Groups On Campus BPPIMT"
      className={`gdg-preloader-root fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-500 ease-in-out ${
        stage === "exit"
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
    >
      <style>{`
        .gdg-preloader-root {
          --gdg-bg: #ffffff;
          --gdg-text-primary: #171717;
          --gdg-text-secondary: #5f6368;
          --gdg-seg-stroke: #171717;
          --gdg-outer-stroke: #737373;
          --gdg-glow: rgba(66, 133, 244, 0.08);
          background-color: var(--gdg-bg);
          color: var(--gdg-text-primary);
        }

        @media (prefers-color-scheme: dark) {
          .gdg-preloader-root {
            --gdg-bg: #0a0a0a;
            --gdg-text-primary: #f8f9fa;
            --gdg-text-secondary: #9aa0a6;
            --gdg-seg-stroke: #171717;
            --gdg-outer-stroke: #a3a3a3;
            --gdg-glow: rgba(66, 133, 244, 0.14);
          }
        }

        html.dark .gdg-preloader-root,
        .dark .gdg-preloader-root {
          --gdg-bg: #0a0a0a;
          --gdg-text-primary: #f8f9fa;
          --gdg-text-secondary: #9aa0a6;
          --gdg-seg-stroke: #171717;
          --gdg-outer-stroke: #a3a3a3;
          --gdg-glow: rgba(66, 133, 244, 0.14);
        }

        html.light .gdg-preloader-root,
        .light .gdg-preloader-root {
          --gdg-bg: #ffffff;
          --gdg-text-primary: #171717;
          --gdg-text-secondary: #5f6368;
          --gdg-seg-stroke: #171717;
          --gdg-outer-stroke: #737373;
          --gdg-glow: rgba(66, 133, 244, 0.08);
        }

        /* Scaled down dot animation distance */
        @keyframes gdgDotWave {
          0%, 100% {
            transform: translateY(0px) scaleY(1) scaleX(1);
          }
          35% {
            transform: translateY(-14px) scaleY(1.08) scaleX(0.94);
          }
          70% {
            transform: translateY(4px) scaleY(0.92) scaleX(1.06);
          }
        }

        @keyframes gdgOutlineDraw {
          0% {
            stroke-dashoffset: 900;
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .gdg-dot {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          animation: gdgDotWave 0.72s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          will-change: transform, opacity;
        }

        /* Slightly larger dots for desktop */
        @media (min-width: 640px) {
          .gdg-dot {
            width: 16px;
            height: 16px;
          }
        }

        .gdg-seg {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease-out;
        }

        .gdg-outline-active {
          stroke-dasharray: 900;
          animation: gdgOutlineDraw 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
        }
      `}</style>

      {/* Subtle Ambient Background Glow (Scaled down) */}
      <div
        className="pointer-events-none absolute h-56 w-56 sm:h-72 sm:w-72 rounded-full blur-3xl transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle, var(--gdg-glow) 0%, transparent 70%)",
          opacity: stage === "logo" ? 1 : 0.4,
        }}
      />

      {/* Center Stage Container */}
      <div className="relative flex flex-col items-center justify-center px-6">
        {/* Shrunk Logo Container: Mobile (h-20 w-40), Desktop (h-28 w-52) */}
        <div className="relative flex h-20 w-40 items-center justify-center sm:h-28 sm:w-52">
          {/* STAGE 1: Bouncing Google Dots */}
          <div
            className={`absolute flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-in-out ${
              stage === "bounce"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50 pointer-events-none"
            }`}
          >
            <span
              className="gdg-dot"
              style={{ backgroundColor: "#4285F4", animationDelay: "0ms" }}
            />
            <span
              className="gdg-dot"
              style={{ backgroundColor: "#EA4335", animationDelay: "120ms" }}
            />
            <span
              className="gdg-dot"
              style={{ backgroundColor: "#FBBC04", animationDelay: "240ms" }}
            />
            <span
              className="gdg-dot"
              style={{ backgroundColor: "#34A853", animationDelay: "360ms" }}
            />
          </div>

          {/* STAGE 2: Custom GDG SVG Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="41 134 419 245"
            preserveAspectRatio="xMidYMid meet"
            className={`h-full w-full overflow-visible transition-opacity duration-300 ${
              stage === "bounce" ? "opacity-0" : "opacity-100"
            }`}
          >
            <title>Google Developer Groups Logo</title>
            <desc>
              Four rounded interlocking colored segments in red, blue, green and
              yellow.
            </desc>

            {/* Red Segment (Top-Left) */}
            <path
              className="gdg-seg"
              style={{
                opacity: stage === "bounce" ? 0 : 1,
                transform:
                  stage === "bounce"
                    ? "translate(-28px, -24px) scale(0.35)"
                    : "translate(0px, 0px) scale(1)",
                transitionDelay: "0ms",
              }}
              d="M 228.0,183.0 L 226.0,175.0 L 222.0,167.0 L 213.0,157.0 L 199.0,150.0 L 183.0,149.0 L 173.0,152.0 L 166.0,156.0 L 97.0,206.0 L 109.0,208.0 L 120.0,213.0 L 165.0,246.0 L 171.0,249.0 L 213.0,219.0 L 220.0,212.0 L 224.0,206.0 L 227.0,198.0 Z"
              fill="#EA4335"
              stroke="var(--gdg-seg-stroke)"
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Blue Segment (Bottom-Left) */}
            <path
              className="gdg-seg"
              style={{
                opacity: stage === "bounce" ? 0 : 1,
                transform:
                  stage === "bounce"
                    ? "translate(-28px, 24px) scale(0.35)"
                    : "translate(0px, 0px) scale(1)",
                transitionDelay: "70ms",
              }}
              d="M 66.0,229.0 L 58.0,242.0 L 56.0,250.0 L 56.0,260.0 L 58.0,269.0 L 62.0,277.0 L 74.0,289.0 L 173.0,359.0 L 183.0,362.0 L 199.0,361.0 L 210.0,356.0 L 220.0,347.0 L 226.0,336.0 L 228.0,328.0 L 228.0,319.0 L 224.0,305.0 L 220.0,299.0 L 213.0,292.0 L 112.0,220.0 L 103.0,217.0 L 87.0,217.0 L 76.0,221.0 Z"
              fill="#4285F4"
              stroke="var(--gdg-seg-stroke)"
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Green Segment (Top-Right) */}
            <path
              className="gdg-seg"
              style={{
                opacity: stage === "bounce" ? 0 : 1,
                transform:
                  stage === "bounce"
                    ? "translate(28px, -24px) scale(0.35)"
                    : "translate(0px, 0px) scale(1)",
                transitionDelay: "140ms",
              }}
              d="M 293.0,161.0 L 289.0,166.0 L 284.0,177.0 L 283.0,194.0 L 285.0,202.0 L 288.0,208.0 L 293.0,215.0 L 300.0,221.0 L 392.0,287.0 L 403.0,293.0 L 413.0,295.0 L 429.0,293.0 L 440.0,287.0 L 447.0,280.0 L 452.0,272.0 L 455.0,263.0 L 455.0,248.0 L 450.0,235.0 L 440.0,224.0 L 344.0,155.0 L 336.0,151.0 L 329.0,149.0 L 315.0,149.0 L 302.0,154.0 Z"
              fill="#34A853"
              stroke="var(--gdg-seg-stroke)"
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Yellow Segment (Bottom-Right) */}
            <path
              className="gdg-seg"
              style={{
                opacity: stage === "bounce" ? 0 : 1,
                transform:
                  stage === "bounce"
                    ? "translate(28px, 24px) scale(0.35)"
                    : "translate(0px, 0px) scale(1)",
                transitionDelay: "210ms",
              }}
              d="M 413.0,305.0 L 412.0,304.0 L 410.0,305.0 L 402.0,303.0 L 392.0,299.0 L 344.0,264.0 L 339.0,263.0 L 312.0,282.0 L 307.0,287.0 L 301.0,290.0 L 293.0,297.0 L 288.0,304.0 L 285.0,311.0 L 284.0,331.0 L 286.0,335.0 L 286.0,338.0 L 290.0,345.0 L 298.0,354.0 L 310.0,360.0 L 320.0,362.0 L 326.0,361.0 L 327.0,362.0 L 338.0,359.0 L 339.0,357.0 L 346.0,354.0 L 347.0,352.0 L 350.0,351.0 Z"
              fill="#FBBC04"
              stroke="var(--gdg-seg-stroke)"
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Right Outer Contour Line */}
            <path
              className={stage !== "bounce" ? "gdg-outline-active" : "opacity-0"}
              d="M 319.0,139.0 L 299.0,144.0 L 298.0,146.0 L 293.0,147.0 L 293.0,149.0 L 290.0,152.0 L 287.0,152.0 L 288.0,153.0 L 277.0,167.0 L 277.0,172.0 L 274.0,178.0 L 274.0,195.0 L 277.0,207.0 L 285.0,220.0 L 291.0,226.0 L 298.0,230.0 L 300.0,234.0 L 299.0,233.0 L 301.0,232.0 L 313.0,241.0 L 313.0,245.0 L 315.0,243.0 L 330.0,253.0 L 332.0,256.0 L 328.0,256.0 L 328.0,259.0 L 319.0,266.0 L 314.0,267.0 L 316.0,268.0 L 306.0,275.0 L 303.0,275.0 L 304.0,276.0 L 299.0,279.0 L 298.0,277.0 L 298.0,280.0 L 285.0,291.0 L 277.0,304.0 L 275.0,310.0 L 274.0,333.0 L 278.0,342.0 L 277.0,344.0 L 280.0,346.0 L 282.0,351.0 L 288.0,358.0 L 287.0,359.0 L 289.0,358.0 L 294.0,364.0 L 295.0,363.0 L 299.0,367.0 L 313.0,371.0 L 325.0,372.0 L 332.0,370.0 L 333.0,371.0 L 346.0,365.0 L 348.0,366.0 L 347.0,365.0 L 350.0,362.0 L 351.0,364.0 L 352.0,361.0 L 353.0,363.0 L 353.0,361.0 L 358.0,357.0 L 359.0,358.0 L 360.0,355.0 L 370.0,348.0 L 374.0,348.0 L 374.0,346.0 L 377.0,343.0 L 380.0,343.0 L 382.0,339.0 L 390.0,335.0 L 395.0,330.0 L 398.0,333.0 L 396.0,330.0 L 399.0,327.0 L 402.0,327.0 L 406.0,322.0 L 415.0,316.0 L 417.0,317.0 L 416.0,316.0 L 421.0,311.0 L 423.0,311.0 L 444.0,295.0 L 446.0,296.0 L 445.0,294.0 L 453.0,288.0 L 459.0,279.0 L 463.0,269.0 L 465.0,253.0 L 463.0,242.0 L 459.0,232.0 L 454.0,225.0 L 445.0,217.0 L 446.0,215.0 L 444.0,216.0 L 435.0,210.0 L 433.0,207.0 L 430.0,206.0 L 430.0,204.0 L 429.0,205.0 L 423.0,200.0 L 421.0,200.0 L 409.0,191.0 L 406.0,187.0 L 405.0,188.0 L 390.0,176.0 L 382.0,172.0 L 380.0,168.0 L 377.0,168.0 L 372.0,164.0 L 373.0,163.0 L 370.0,163.0 L 352.0,150.0 L 351.0,147.0 L 349.0,148.0 L 346.0,146.0 L 346.0,144.0 L 345.0,145.0 L 331.0,140.0 Z"
              fill="none"
              stroke="var(--gdg-outer-stroke)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Left Outer Contour Line */}
            <path
              className={stage !== "bounce" ? "gdg-outline-active" : "opacity-0"}
              d="M 186.0,139.0 L 175.0,141.0 L 165.0,146.0 L 164.0,145.0 L 163.0,147.0 L 159.0,147.0 L 161.0,148.0 L 159.0,150.0 L 157.0,149.0 L 158.0,150.0 L 148.0,158.0 L 147.0,157.0 L 141.0,163.0 L 137.0,163.0 L 139.0,164.0 L 137.0,166.0 L 136.0,165.0 L 134.0,168.0 L 131.0,168.0 L 129.0,172.0 L 122.0,176.0 L 121.0,175.0 L 120.0,178.0 L 106.0,188.0 L 105.0,187.0 L 99.0,193.0 L 95.0,194.0 L 95.0,196.0 L 81.0,206.0 L 79.0,206.0 L 76.0,210.0 L 74.0,210.0 L 67.0,216.0 L 65.0,215.0 L 66.0,217.0 L 60.0,222.0 L 59.0,221.0 L 60.0,222.0 L 56.0,226.0 L 52.0,234.0 L 49.0,236.0 L 50.0,239.0 L 48.0,242.0 L 46.0,258.0 L 50.0,275.0 L 52.0,276.0 L 52.0,279.0 L 62.0,292.0 L 63.0,291.0 L 65.0,293.0 L 64.0,296.0 L 66.0,294.0 L 78.0,303.0 L 79.0,306.0 L 80.0,304.0 L 88.0,311.0 L 90.0,311.0 L 91.0,314.0 L 92.0,313.0 L 108.0,325.0 L 107.0,326.0 L 108.0,325.0 L 120.0,333.0 L 121.0,336.0 L 123.0,335.0 L 123.0,337.0 L 124.0,336.0 L 131.0,343.0 L 134.0,343.0 L 139.0,347.0 L 138.0,348.0 L 141.0,348.0 L 156.0,359.0 L 158.0,362.0 L 159.0,361.0 L 160.0,364.0 L 161.0,362.0 L 164.0,365.0 L 163.0,366.0 L 164.0,365.0 L 167.0,367.0 L 165.0,368.0 L 169.0,367.0 L 175.0,370.0 L 192.0,372.0 L 207.0,368.0 L 208.0,369.0 L 209.0,367.0 L 211.0,367.0 L 222.0,359.0 L 229.0,351.0 L 232.0,345.0 L 234.0,344.0 L 233.0,343.0 L 237.0,333.0 L 237.0,316.0 L 233.0,303.0 L 234.0,302.0 L 231.0,300.0 L 226.0,291.0 L 212.0,280.0 L 213.0,277.0 L 212.0,279.0 L 210.0,279.0 L 196.0,268.0 L 198.0,267.0 L 196.0,266.0 L 195.0,268.0 L 190.0,263.0 L 181.0,258.0 L 179.0,255.0 L 191.0,246.0 L 192.0,247.0 L 192.0,245.0 L 197.0,244.0 L 195.0,243.0 L 209.0,233.0 L 212.0,232.0 L 213.0,234.0 L 212.0,231.0 L 222.0,224.0 L 229.0,216.0 L 231.0,211.0 L 233.0,209.0 L 234.0,210.0 L 233.0,207.0 L 237.0,195.0 L 237.0,178.0 L 229.0,160.0 L 216.0,147.0 L 209.0,144.0 L 208.0,142.0 L 206.0,143.0 L 203.0,141.0 Z"
              fill="none"
              stroke="var(--gdg-outer-stroke)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Scaled Typography Reveal */}
        <div
          className={`mt-2 flex flex-col items-center text-center transition-all duration-500 ease-out ${
            stage !== "bounce"
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <h1
            className="text-base font-bold tracking-tight sm:text-xl"
            style={{ color: "var(--gdg-text-primary)" }}
          >
            Google Developer Groups
          </h1>

          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase sm:text-xs">
            <span className="text-[#4285F4] font-semibold">ON CAMPUS</span>
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: "var(--gdg-text-secondary)" }}
            />
            <span style={{ color: "var(--gdg-text-secondary)" }} className="hidden sm:inline">
              B. P. Poddar Institute of Management & Technology
            </span>
            <span className="sm:hidden" style={{ color: "var(--gdg-text-secondary)" }}>
              BPPIMT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const GlassTiles = dynamic(
  () => import("@/components/ui/glass-tiles").then((m) => m.GlassTiles),
  { ssr: false }
);

function MobileStaticGlassTiles({ isDark }: { isDark: boolean }) {
  const ground = isDark ? "#12151b" : "#ffffff";
  const grout = isDark ? "#080a0d" : "#e5e9f0";
  const tileFill = isDark ? "#12151b" : "#ffffff";
  const tileBorder = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const specHighlight = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.85)";
  const patternId = isDark ? "mobile-gt-pattern-dark" : "mobile-gt-pattern-light";

  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: ground }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        suppressHydrationWarning
      >
        <defs>
          <pattern
            id={patternId}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <rect width="48" height="48" fill={grout} />
            <rect
              x="1.5"
              y="1.5"
              width="45"
              height="45"
              rx="9"
              fill={tileFill}
              stroke={tileBorder}
              strokeWidth="1"
            />
            <path
              d="M 9 2.5 L 39 2.5"
              stroke={specHighlight}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export function CardsGlassBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const readDomDark = () => {
      const html = document.documentElement;
      return (
        html.classList.contains("dark") ||
        html.getAttribute("data-theme") === "dark"
      );
    };

    setIsDark(readDomDark());

    // React immediately if theme toggle mutates class or data-theme on <html>
    const observer = new MutationObserver(() => {
      setIsDark(readDomDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Sync directly with next-themes without latching to stale DOM state
  useEffect(() => {
    if (mounted && resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return <div className="w-full h-full bg-surface-page dark:bg-[#12151b]" />;
  }

  if (isMobile) {
    return <MobileStaticGlassTiles isDark={isDark} />;
  }

  return (
    <div className="w-full h-full">
      <GlassTiles
        isDark={isDark}
        columns={15}
        speed={0.5}
        className="w-full h-full"
      />
    </div>
  );
}
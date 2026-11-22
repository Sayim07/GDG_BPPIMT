"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const GlassTiles = dynamic(
  () => import("@/components/ui/glass-tiles").then((m) => m.GlassTiles),
  { ssr: false }
);

export function CardsGlassBackground() {
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

  return (
    <div className="w-full h-full">
      <GlassTiles
        key={isDark ? "dark" : "light"}
        isDark={isDark}
        columns={15}
        speed={0.5}
        className="w-full h-full"
      />
    </div>
  );
}

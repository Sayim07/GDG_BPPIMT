"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { GlassTiles } from "@/components/ui/glass-tiles";

export function CardsGlassBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

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

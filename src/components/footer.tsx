"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import heavy HalftoneWordmark canvas out of critical initial layout bundle
const HalftoneWordmarkFooter = dynamic(
  () =>
    import("@/components/ui/halftone-wordmark-footer").then(
      (m) => m.HalftoneWordmarkFooter
    ),
  {
    ssr: false,
    loading: () => (
      <footer className="w-full min-h-[50vh] bg-surface-card border-t border-border-subtle flex items-center justify-center">
        <p className="text-xs text-text-tertiary">Google Developer Groups on Campus • BPPIMT</p>
      </footer>
    ),
  }
);

export function Footer() {
  return (
    <HalftoneWordmarkFooter
      wordmark="GDG • BPPIMT, KOLKATA"
      label="GDG on Campus BPPIMT"
      meta="B.P. Poddar Institute of Management and Technology • Kolkata"
      dotGap={6}
      radius={95}
      height="100dvh"
    />
  );
}

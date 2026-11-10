import * as React from "react";

interface GridBackgroundProps {
  className?: string;
}

/**
 * Grid Background Component
 * Clean, non-blinking, uniform full-height grid background inspired by @meghtrix/components/grid-background.
 * Ensures consistent visibility across the entire page from top to bottom while scrolling.
 */
export function GridBackground({ className = "" }: GridBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Static Subtle Ambient GDG Top Glow (Zero blinking or pulsing) */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#4285F4]/12 via-[#EA4335]/5 to-transparent pointer-events-none" />

      {/* 2. Full-Height Uniform 40px Orthogonal Grid (Consistently visible all the way down) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(66, 133, 244, 0.13) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(66, 133, 244, 0.13) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 3. Full-Height Uniform Cross Diagonal Pattern (meghtrix style) */}
      <div
        className="absolute inset-0 opacity-45 dark:opacity-35"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(66, 133, 244, 0.08) 0, rgba(66, 133, 244, 0.08) 1px, transparent 1px, transparent 24px),
            repeating-linear-gradient(-45deg, rgba(66, 133, 244, 0.08) 0, rgba(66, 133, 244, 0.08) 1px, transparent 1px, transparent 24px)
          `,
        }}
      />
    </div>
  );
}

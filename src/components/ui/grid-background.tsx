import * as React from "react";

interface GridBackgroundProps {
  className?: string;
  variant?: "default" | "warm-paper" | "retro-green" | "retro-red";
}

/**
 * Grid Background Component
 * Supports default modern cyber-blue grid, retro warm-paper, retro-green, or retro-red technical grid.
 */
export function GridBackground({
  className = "",
  variant = "default",
}: GridBackgroundProps) {
  if (variant === "retro-red") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {/* 1. Subtle Reddish Sunbeam / Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-[700px] bg-gradient-to-b from-[#EA4335]/20 via-[#FDF2F2]/30 to-transparent dark:from-[#EA4335]/15 dark:via-transparent pointer-events-none" />

        {/* 2. Full-Height Uniform Reddish Orthogonal Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(234, 67, 53, 0.28) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(234, 67, 53, 0.28) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* 3. Subtle micro-point intersection dots for architectural texture */}
        <div
          className="absolute inset-0 opacity-35 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(234, 67, 53, 0.55) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>
    );
  }

  if (variant === "retro-green") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {/* 1. Subtle Greenish Sunbeam / Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-[700px] bg-gradient-to-b from-[#34A853]/20 via-[#EEF7EE]/30 to-transparent dark:from-[#34A853]/15 dark:via-transparent pointer-events-none" />

        {/* 2. Full-Height Uniform Greenish Orthogonal Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(52, 168, 83, 0.28) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(52, 168, 83, 0.28) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* 3. Subtle micro-point intersection dots for architectural texture */}
        <div
          className="absolute inset-0 opacity-35 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(52, 168, 83, 0.55) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>
    );
  }

  if (variant === "warm-paper") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {/* 1. Subtle Warm Sunbeam / Paper Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-[700px] bg-gradient-to-b from-[#FBBC04]/15 via-[#F5EEDB]/30 to-transparent dark:from-[#FBBC04]/10 dark:via-transparent pointer-events-none" />

        {/* 2. Full-Height Uniform Warm Orthogonal Grid (Matching placement tracker style) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(160, 140, 95, 0.24) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(160, 140, 95, 0.24) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* 3. Subtle micro-point intersection dots for architectural texture */}
        <div
          className="absolute inset-0 opacity-25 dark:opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(130, 110, 70, 0.45) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>
    );
  }

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

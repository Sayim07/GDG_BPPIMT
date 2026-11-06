"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, ChevronDown } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import statsData from "@/data/stats.json";
import { ChapterConfig, StatItem } from "@/types/schema";
import { ShapeGrid } from "@/components/ui/shape-grid";

export function Hero() {
  const chapter = chapterConfig as ChapterConfig;
  const stats = (statsData as StatItem[]) || [];
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="relative w-full min-h-[calc(100dvh-4rem)] flex flex-col justify-between bg-surface-page border-b border-border-subtle overflow-hidden">
      {/* Interactive ShapeGrid Background Effect - Hero Section Only */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ShapeGrid
          shape="square"
          cellSize={44}
          lineWidth={1}
          direction="diagonal"
          speed={0.2}
          lineColor={isDark ? "rgba(255, 255, 255, 0.08)" : "#e8eaed"}
          hoverColor={isDark ? "#8ab4f8" : "#4285F4"}
          hoverFillColor={isDark ? "rgba(138, 180, 248, 0.12)" : "rgba(66, 133, 244, 0.08)"}
          fillOpacity={0.16}
          rainbow={true}
          radius={1.8}
          trail={0.5}
          glow={isDark ? 0.45 : 0.25}
          twinkle={0.06}
          fade={0.85}
          clickCascade={true}
          intro={true}
        />
      </div>

      {/* Authentic Google 4-Color Accent Bar */}
      <div className="relative z-10 w-full grid grid-cols-4 h-1">
        <div className="bg-gdg-blue h-full" />
        <div className="bg-gdg-red h-full" />
        <div className="bg-gdg-yellow h-full" />
        <div className="bg-gdg-green h-full" />
      </div>

      {/* Main Centered Hero Content */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Main Headline */}
          {chapter.headline && (
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary max-w-4xl leading-tight">
              {chapter.headline}
            </h1>
          )}

          {/* Subtitle */}
          {chapter.subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto mt-6 leading-relaxed">
              {chapter.subtitle}
            </p>
          )}

          {/* Action CTAs */}
          {chapter.primaryCtaText && chapter.primaryCtaUrl && (
            <div className="flex items-center justify-center gap-6 mt-10">
              <Link
                href={chapter.primaryCtaUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-sm transition-all"
              >
                <span>{chapter.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/team"
                className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 group"
              >
                <span>Meet the Team</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          )}

          {/* Stats Metrics (if provided) */}
          {stats.length > 0 && (
            <div className="mt-16 pt-10 border-t border-border-subtle w-full max-w-2xl grid grid-cols-3 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={stat.label || idx}>
                  <div className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-text-tertiary mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subtle Scroll Hint at Bottom of Full-Page Hero */}
      <div className="relative z-10 w-full pb-8 flex flex-col items-center justify-center text-text-tertiary pointer-events-none select-none">
        <span className="text-[11px] font-medium tracking-widest uppercase opacity-60">
          Scroll to explore
        </span>
        <ChevronDown className="w-4 h-4 mt-1 opacity-50 animate-bounce" />
      </div>
    </div>
  );
}

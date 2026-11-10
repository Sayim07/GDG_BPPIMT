"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, ChevronDown, Users } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import statsData from "@/data/stats.json";
import { ChapterConfig, StatItem } from "@/types/schema";
import { ShapeGrid } from "@/components/ui/shape-grid";
import { StrokeText } from "@/components/ui/stroke-text";
import { TextType } from "@/components/ui/text-type";

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

      {/* Authentic Google 4-Color Accent Bar with Smooth Blend Effect */}
      <div
        className="relative z-10 w-full h-1"
        style={{
          background:
            "linear-gradient(90deg, #4285F4 0%, #4285F4 15%, #EA4335 36%, #EA4335 50%, #FBBC04 66%, #FBBC04 78%, #34A853 92%, #34A853 100%)",
        }}
      />

      {/* Main Centered Hero Content */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Main Headline - Large, expansive StrokeText with authentic GDG colors */}
          {chapter.headline && (
            <h1 className="w-full max-w-6xl mx-auto flex items-center justify-center font-heading text-center">
              <span className="sr-only">{chapter.headline}</span>
              <StrokeText
                text={chapter.headline}
                fontSize={108}
                fontWeight={800}
                gdgColors={true}
                gdgColorMode="gradient"
                isDark={isDark}
                strokeWidth={2.5}
                drawDuration={1.4}
                fillDelay={0.2}
                fillMode="wipe"
                wipeFrom="left"
                hoverRedraw={true}
                shiny={true}
                shineColor="#ffffff"
                shineSpeed={2.5}
                shineWidth={22}
                shineGlow={0.3}
                followPointer={true}
                fontFamily="var(--font-product-sans), Product Sans, system-ui, sans-serif"
                letterSpacing={-2}
                className="w-full"
              />
            </h1>
          )}

          {/* Subtitle with TextType typing animation */}
          {chapter.subtitle && (
            <div className="max-w-3xl mx-auto mt-6 sm:mt-8 text-center">
              <TextType
                text={chapter.subtitle}
                as="p"
                className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed inline-block"
                typingSpeed={26}
                deletingSpeed={16}
                pauseDuration={3500}
                initialDelay={350}
                showCursor={true}
                cursorStyle="bar"
                cursorColor={isDark ? "#8ab4f8" : "#4285F4"}
                typeEffect="fade"
                loop={false}
              />
            </div>
          )}

          {/* Action CTAs */}
          {chapter.primaryCtaText && chapter.primaryCtaUrl && (
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mt-8 sm:mt-10">
              <Link
                href={chapter.primaryCtaUrl}
                className="btn-sweep-blue inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-bold shadow-sm cursor-pointer"
              >
                <span>{chapter.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/team"
                className="btn-sweep-green inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-bold shadow-sm cursor-pointer group"
              >
                <Users className="w-4 h-4" />
                <span>Meet the Team</span>
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

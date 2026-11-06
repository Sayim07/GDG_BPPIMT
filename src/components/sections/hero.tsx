import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import statsData from "@/data/stats.json";
import { ChapterConfig, StatItem } from "@/types/schema";

export function Hero() {
  const chapter = chapterConfig as ChapterConfig;
  const stats = (statsData as StatItem[]) || [];

  return (
    <div className="relative w-full bg-surface-page border-b border-border-subtle">
      {/* Authentic Google 4-Color Accent Bar */}
      <div className="w-full grid grid-cols-4 h-1">
        <div className="bg-gdg-blue h-full" />
        <div className="bg-gdg-red h-full" />
        <div className="bg-gdg-yellow h-full" />
        <div className="bg-gdg-green h-full" />
      </div>

      <section className="w-full py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Chapter Descriptor (Clean semantic text, no artificial floating capsule pill) */}
          {chapter.badge && (
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-text-tertiary mb-4">
              {chapter.badge}
            </p>
          )}

          {/* Main Headline */}
          {chapter.headline && (
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary max-w-3xl leading-tight">
              {chapter.headline}
            </h1>
          )}

          {/* Subtitle */}
          {chapter.subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto mt-6 leading-relaxed">
              {chapter.subtitle}
            </p>
          )}

          {/* Action CTAs: Focused primary action with clean secondary navigation */}
          {chapter.primaryCtaText && chapter.primaryCtaUrl && (
            <div className="flex items-center justify-center gap-6 mt-8">
              <Link
                href={chapter.primaryCtaUrl}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
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

          {/* Stats Metrics (Clean inline typography, no nested card container) */}
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
    </div>
  );
}

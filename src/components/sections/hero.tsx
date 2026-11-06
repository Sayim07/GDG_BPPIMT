"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import statsData from "@/data/stats.json";
import { ChapterConfig, StatItem } from "@/types/schema";

export function Hero() {
  const chapter = chapterConfig as ChapterConfig;
  const stats = (statsData as StatItem[]) || [];

  return (
    <div className="relative w-full overflow-hidden bg-surface-page">
      {/* Google Quad-Color Accent Line */}
      <div className="w-full grid grid-cols-4 h-1">
        <div className="bg-gdg-blue h-full" />
        <div className="bg-gdg-red h-full" />
        <div className="bg-gdg-yellow h-full" />
        <div className="bg-gdg-green h-full" />
      </div>

      <section className="w-full py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Chapter Badge (Only renders if badge data exists) */}
          {chapter.badge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-subtle border border-border-subtle shadow-sm mb-6 transition-transform hover:scale-105 duration-200"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gdg-blue inline-block" />
                <span className="w-2 h-2 rounded-full bg-gdg-red inline-block" />
                <span className="w-2 h-2 rounded-full bg-gdg-yellow inline-block" />
                <span className="w-2 h-2 rounded-full bg-gdg-green inline-block" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-text-secondary">
                {chapter.badge}
              </span>
            </motion.div>
          )}

          {/* Main Headline (Purely from data) */}
          {chapter.headline && (
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight"
            >
              {chapter.headline}
            </motion.h1>
          )}

          {/* Subtitle (Only renders if subtitle data exists) */}
          {chapter.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto mt-6 leading-relaxed"
            >
              {chapter.subtitle}
            </motion.p>
          )}

          {/* Dynamic CTAs */}
          {(chapter.primaryCtaText || chapter.secondaryCtaText) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
            >
              {chapter.primaryCtaText && chapter.primaryCtaUrl && (
                <Link
                  href={chapter.primaryCtaUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
                >
                  <span>{chapter.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {chapter.secondaryCtaText && chapter.secondaryCtaUrl && (
                <Link
                  href={chapter.secondaryCtaUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-card text-text-primary text-sm font-medium border border-border-subtle shadow-sm hover:bg-surface-subtle transition-all"
                >
                  <span>{chapter.secondaryCtaText}</span>
                  <UserPlus className="w-4 h-4 text-text-secondary" />
                </Link>
              )}
            </motion.div>
          )}

          {/* Stats Bar (Only renders if stats data is non-empty) */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-14 w-full max-w-2xl bg-surface-card border border-border-subtle rounded-2xl p-4 sm:p-6 flex items-center justify-around shadow-sm text-center"
            >
              {stats.map((stat, idx) => (
                <React.Fragment key={stat.label || idx}>
                  {idx > 0 && <div className="w-px h-8 bg-border-subtle" />}
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-text-tertiary mt-1 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

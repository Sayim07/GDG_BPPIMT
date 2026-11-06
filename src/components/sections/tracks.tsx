"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Brain, Smartphone, ShieldCheck, ArrowUpRight } from "lucide-react";
import tracksData from "@/data/tracks.json";
import { TrackItem } from "@/types/schema";

const iconMap = {
  cloud: Cloud,
  ai: Brain,
  mobile: Smartphone,
  security: ShieldCheck,
};

const colorConfig = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-gdg-blue",
    borderHover: "hover:border-gdg-blue/60 dark:hover:border-gdg-blue/50",
    glowHover: "group-hover:shadow-[0_8px_30px_rgb(66,133,244,0.12)]",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-gdg-red",
    borderHover: "hover:border-gdg-red/60 dark:hover:border-gdg-red/50",
    glowHover: "group-hover:shadow-[0_8px_30px_rgb(234,67,53,0.12)]",
  },
  yellow: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-gdg-yellow/60 dark:hover:border-gdg-yellow/50",
    glowHover: "group-hover:shadow-[0_8px_30px_rgb(251,188,4,0.12)]",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-gdg-green",
    borderHover: "hover:border-gdg-green/60 dark:hover:border-gdg-green/50",
    glowHover: "group-hover:shadow-[0_8px_30px_rgb(52,168,83,0.12)]",
  },
};

export function Tracks() {
  const tracks = (tracksData as TrackItem[]) || [];

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <section id="tracks" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-card border-y border-border-subtle transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-text-tertiary font-semibold">
              Domains & Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1">
              Explore Technology Tracks
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-md">
            Dive into specialized domains guided by experienced campus leads, hands-on labs, and open source projects.
          </p>
        </div>

        {/* Dynamic Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, idx) => {
            const Icon = track.icon ? iconMap[track.icon] : Cloud;
            const colors = track.accentColor ? colorConfig[track.accentColor] : colorConfig.blue;

            return (
              <motion.div
                key={track.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`bg-surface-page border border-border-subtle ${colors.borderHover} ${colors.glowHover} rounded-2xl p-6 shadow-sm transition-all duration-300 flex flex-col justify-between group cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {Icon && (
                      <div className={`w-11 h-11 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  {track.title && (
                    <h3 className="text-lg font-semibold text-text-primary mb-2 tracking-tight group-hover:text-primary transition-colors">
                      {track.title}
                    </h3>
                  )}
                  {track.description && (
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                      {track.description}
                    </p>
                  )}
                </div>

                {track.tags && track.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle">
                    {track.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-surface-subtle text-text-secondary text-xs font-medium group-hover:bg-surface-page transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

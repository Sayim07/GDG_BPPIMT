"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Terminal, Rocket, ArrowRight } from "lucide-react";
import pillarsData from "@/data/pillars.json";
import { PillarItem } from "@/types/schema";

const iconMap = {
  connect: Users,
  learn: Terminal,
  grow: Rocket,
};

const colorConfig = {
  blue: {
    bar: "bg-gdg-blue",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconText: "text-gdg-blue",
  },
  red: {
    bar: "bg-gdg-red",
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconText: "text-gdg-red",
  },
  green: {
    bar: "bg-gdg-green",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconText: "text-gdg-green",
  },
};

export function Pillars() {
  const items = (pillarsData as PillarItem[]) || [];

  // If no pillars data exists, render nothing (zero hardcoding)
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section id="about" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-2">
            Connect. Learn. Grow.
          </h2>
        </div>

        {/* Dynamic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon ? iconMap[item.icon] : Users;
            const colors = item.accentColor ? colorConfig[item.accentColor] : colorConfig.blue;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-surface-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.bar}`} />

                <div>
                  {Icon && (
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconText} mb-6 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  )}

                  {item.title && (
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.ctaText && (
                  <div className={`mt-6 pt-4 flex items-center gap-2 ${colors.iconText} text-xs font-semibold uppercase tracking-wider`}>
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

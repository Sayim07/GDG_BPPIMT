import React from "react";
import { Users, Code, TrendingUp, ArrowRight } from "lucide-react";
import pillarsData from "@/data/pillars.json";
import { PillarItem } from "@/types/schema";

const iconMap = {
  connect: Users,
  learn: Code,
  grow: TrendingUp,
};

const colorConfig = {
  blue: {
    accent: "bg-gdg-blue",
    text: "text-gdg-blue",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
  },
  red: {
    accent: "bg-gdg-red",
    text: "text-gdg-red",
    iconBg: "bg-red-50 dark:bg-red-950/30",
  },
  green: {
    accent: "bg-gdg-green",
    text: "text-gdg-green",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
};

export function Pillars({ isCard = false }: { isCard?: boolean } = {}) {
  const items = (pillarsData as PillarItem[]) || [];

  if (!items || items.length === 0) {
    return null;
  }

  const content = (
    <div className="w-full">
      {/* Editorial Section Header */}
      <div className="mb-4 sm:mb-10">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Community Pillars
        </p>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1 sm:mt-1.5">
          Connect. Learn. Grow.
        </h2>
      </div>

      {/* Flat Material Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon ? iconMap[item.icon] : Users;
          const colors = item.accentColor ? colorConfig[item.accentColor] : colorConfig.blue;

          return (
            <div
              key={item.id || idx}
              className="bg-surface-card border border-border-subtle hover:border-border-strong rounded-xl sm:rounded-2xl p-4 sm:p-7 flex flex-col justify-between transition-colors duration-150 group"
            >
              <div>
                {/* Subtle Accent Line */}
                <div className={`w-7 sm:w-8 h-1 rounded-full ${colors.accent} mb-2.5 sm:mb-5`} />

                {item.title && (
                  <h3 className="font-heading text-base sm:text-xl font-bold text-text-primary mb-1 sm:mb-2">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-xs sm:text-sm text-text-secondary leading-snug sm:leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {item.ctaText && (
                <div className={`mt-3 pt-2.5 sm:mt-6 sm:pt-4 border-t border-border-subtle flex items-center justify-between text-[11px] sm:text-xs font-semibold ${colors.text} tracking-wider uppercase`}>
                  <span>{item.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isCard) {
    return <div className="p-4 sm:p-10">{content}</div>;
  }

  return (
    <section id="about" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}
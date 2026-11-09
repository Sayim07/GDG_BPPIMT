import React from "react";
import { Cloud, Cpu, Smartphone, ShieldCheck, ArrowUpRight } from "lucide-react";
import tracksData from "@/data/tracks.json";
import { TrackItem } from "@/types/schema";

const iconMap = {
  cloud: Cloud,
  ai: Cpu,
  mobile: Smartphone,
  security: ShieldCheck,
};

const colorConfig = {
  blue: {
    accentBar: "bg-gdg-blue",
    text: "text-gdg-blue",
    hoverBorder: "hover:border-gdg-blue/50",
  },
  red: {
    accentBar: "bg-gdg-red",
    text: "text-gdg-red",
    hoverBorder: "hover:border-gdg-red/50",
  },
  yellow: {
    accentBar: "bg-gdg-yellow",
    text: "text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-gdg-yellow/50",
  },
  green: {
    accentBar: "bg-gdg-green",
    text: "text-gdg-green",
    hoverBorder: "hover:border-gdg-green/50",
  },
};

export function Tracks({ isCard = false }: { isCard?: boolean } = {}) {
  const tracks = (tracksData as TrackItem[]) || [];

  if (!tracks || tracks.length === 0) {
    return null;
  }

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Specialized Tracks
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1.5">
            Technical Domains
          </h2>
        </div>
        <p className="text-sm text-text-secondary max-w-md leading-relaxed">
          Hands-on learning, study groups, and hack sprints guided by student domain leads and industry mentors.
        </p>
      </div>

      {/* Flat Grid: Clean Google 1px Border Accent, No Artificial Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tracks.map((track, idx) => {
          const Icon = track.icon ? iconMap[track.icon] : Cloud;
          const colors = track.accentColor ? colorConfig[track.accentColor] : colorConfig.blue;

          return (
            <div
              key={track.id || idx}
              className={`bg-surface-page border border-border-subtle ${colors.hoverBorder} rounded-2xl p-5 sm:p-6 transition-colors duration-150 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Google Brand Color Dot */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.accentBar}`} />
                    {Icon && <Icon className={`w-4 h-4 ${colors.text}`} />}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary transition-colors" />
                </div>

                {track.title && (
                  <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary mb-2 tracking-tight">
                    {track.title}
                  </h3>
                )}
                {track.description && (
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                    {track.description}
                  </p>
                )}
              </div>

              {track.tags && track.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle">
                  {track.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-surface-subtle text-text-secondary text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isCard) {
    return <div className="p-6 sm:p-10">{content}</div>;
  }

  return (
    <section id="tracks" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-card border-y border-border-subtle transition-colors">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Brain,
  Cloud,
  Palette,
  Briefcase,
  Megaphone,
  Network
} from "lucide-react";
import teamData from "@/data/team.json";
import chapterConfig from "@/data/chapter.json";
import { TeamMember, ChapterConfig } from "@/types/schema";
import { DepthCarousel } from "@/components/ui/depth-carousel";

const badgeStyles = {
  blue: "bg-blue-500/10 text-[#4285F4] border-blue-500/20",
  red: "bg-red-500/10 text-[#EA4335] border-red-500/20",
  yellow: "bg-amber-500/10 text-[#FBBC04] border-amber-500/20",
  green: "bg-emerald-500/10 text-[#34A853] border-emerald-500/20",
};

const avatarAccents = {
  blue: "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30",
  red: "bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/30",
  yellow: "bg-[#FBBC04]/10 text-[#FBBC04] border-[#FBBC04]/30",
  green: "bg-[#34A853]/10 text-[#34A853] border-[#34A853]/30",
};

const domainIcons: Record<string, React.ReactNode> = {
  Tech: <Code2 className="w-3.5 h-3.5" />,
  AIML: <Brain className="w-3.5 h-3.5" />,
  Cloud: <Cloud className="w-3.5 h-3.5" />,
  Design: <Palette className="w-3.5 h-3.5" />,
  Management: <Briefcase className="w-3.5 h-3.5" />,
  Marketing: <Megaphone className="w-3.5 h-3.5" />,
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function Team({ isCard = false }: { isCard?: boolean } = {}) {
  const members = (teamData as TeamMember[]) || [];
  const chapter = chapterConfig as ChapterConfig;
  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  // 3 On-Campus Organizers
  const organizers = members.filter(m => m.category === "organizer");
  // 6 Domain Leads
  const leads = members.filter(m => m.category === "lead");
  // Core Team Members
  const coreMembers = members.filter(m => m.category === "core");

  // Items for 3D Depth Carousel: Organizers + Leads
  const carouselItems = [...organizers, ...leads].map(m => ({
    name: m.name,
    role: m.role,
    domain: m.domain,
    category: m.category,
    badgeColor: m.badgeColor,
    bio: m.bio,
    image: m.avatarUrl
  }));

  const domainCategories = ["All", "Tech", "AIML", "Cloud", "Design", "Management", "Marketing"];

  const filteredCoreMembers = coreMembers.filter(m => {
    if (selectedDomain === "All") return true;
    return (
      m.role.toLowerCase().includes(selectedDomain.toLowerCase()) ||
      m.domain?.toLowerCase().includes(selectedDomain.toLowerCase())
    );
  });

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
          Organizers & Leads
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mt-2.5 max-w-2xl mx-auto leading-relaxed">
          The official student team driving Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology
        </p>
      </div>

      {/* 3D Depth Carousel for Organizers & Leads */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-4xl py-2">
          <DepthCarousel
            items={carouselItems}
            cardWidth={280}
            cardHeight={360}
            depth={180}
            spread={80}
            tilt={16}
            visibleCards={3}
            autoplay={true}
            autoplayDelay={3600}
            className="h-[390px] sm:h-[420px]"
          />
        </div>

        {/* View Full Team CTA Button - Always fully in view */}
        <div className="mt-8 sm:mt-10 mb-2 text-center">
          <Link
            href="/team"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all group"
          >
            <Network className="w-4 h-4 text-white/90" />
            <span>View Full Team & Org Tree ({members.length})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Standalone Full Directory (only if !isCard and not navigating to /team) */}
      {!isCard && (
        <div className="w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-border-subtle">
          <div className="text-center mb-6">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Official Core Team Directory
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Selected student developers across technical, creative, and operational domains
            </p>

            {/* Domain Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {domainCategories.map(domain => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => setSelectedDomain(domain)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedDomain === domain
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-subtle text-text-secondary hover:text-text-primary border border-border-subtle"
                  }`}
                >
                  {domainIcons[domain]}
                  <span>{domain}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredCoreMembers.map(member => {
              const badgeClass = badgeStyles[member.badgeColor || "blue"];
              const avatarAccent = avatarAccents[member.badgeColor || "blue"];

              return (
                <div
                  key={member.id}
                  className="rounded-xl border border-border-subtle bg-surface-page p-4 hover:border-border-strong hover:shadow-sm transition-all flex items-start gap-3.5"
                >
                  <div
                    className={`w-11 h-11 rounded-full border-2 bg-gradient-to-b flex items-center justify-center flex-shrink-0 shadow-inner ${avatarAccent}`}
                  >
                    <span className="font-heading text-xs font-bold">
                      {getInitials(member.name)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading text-sm font-bold text-text-primary truncate">
                        {member.name}
                      </h4>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border flex-shrink-0 ${badgeClass}`}>
                        {member.domain}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-[11px] text-text-tertiary mt-1.5 line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (isCard) {
    return <div className="p-6 sm:p-8 md:p-10">{content}</div>;
  }

  return (
    <section id="team" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface-card border-t border-border-subtle transition-colors">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}

export default Team;
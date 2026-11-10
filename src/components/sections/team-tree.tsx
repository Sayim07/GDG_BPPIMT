"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Brain,
  Cloud,
  Palette,
  Briefcase,
  Megaphone,
  Crown,
  Mail,
  Github,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Network,
  ArrowLeft,
  GraduationCap,
  Layers,
  UserCheck
} from "lucide-react";
import teamData from "@/data/team.json";
import { TeamMember } from "@/types/schema";

interface DomainBranch {
  id: string;
  name: string;
  icon: React.ReactNode;
  brandColor: string;
  badgeStyle: string;
  cardBorder: string;
  leadId: string;
}

const DOMAIN_BRANCHES: DomainBranch[] = [
  {
    id: "Tech",
    name: "Tech & Architecture",
    icon: <Code2 className="w-4 h-4 text-[#4285F4]" />,
    brandColor: "#4285F4",
    badgeStyle: "bg-blue-500/10 text-[#4285F4] border-blue-500/20",
    cardBorder: "hover:border-[#4285F4]/50",
    leadId: "sayim-mullick"
  },
  {
    id: "AIML",
    name: "AI & Machine Learning",
    icon: <Brain className="w-4 h-4 text-[#EA4335]" />,
    brandColor: "#EA4335",
    badgeStyle: "bg-red-500/10 text-[#EA4335] border-red-500/20",
    cardBorder: "hover:border-[#EA4335]/50",
    leadId: "raktik-ghosh"
  },
  {
    id: "Cloud",
    name: "Cloud & DevOps",
    icon: <Cloud className="w-4 h-4 text-[#FBBC04]" />,
    brandColor: "#FBBC04",
    badgeStyle: "bg-amber-500/10 text-[#FBBC04] border-amber-500/20",
    cardBorder: "hover:border-amber-500/50",
    leadId: "aaryan-kumar"
  },
  {
    id: "Design",
    name: "Design & UI/UX",
    icon: <Palette className="w-4 h-4 text-[#4285F4]" />,
    brandColor: "#4285F4",
    badgeStyle: "bg-blue-500/10 text-[#4285F4] border-blue-500/20",
    cardBorder: "hover:border-[#4285F4]/50",
    leadId: "narayan-kumar-jha"
  },
  {
    id: "Management",
    name: "Operations & Logistics",
    icon: <Briefcase className="w-4 h-4 text-[#34A853]" />,
    brandColor: "#34A853",
    badgeStyle: "bg-emerald-500/10 text-[#34A853] border-emerald-500/20",
    cardBorder: "hover:border-[#34A853]/50",
    leadId: "aadipto-ghosh"
  },
  {
    id: "Marketing",
    name: "Marketing & Outreach",
    icon: <Megaphone className="w-4 h-4 text-[#EA4335]" />,
    brandColor: "#EA4335",
    badgeStyle: "bg-red-500/10 text-[#EA4335] border-red-500/20",
    cardBorder: "hover:border-[#EA4335]/50",
    leadId: "satarupa-sarkar"
  }
];

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

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Reusable Full-Size Member Card Component
 * Supports real avatarUrl / photo attachment or beautiful GDG initials monogram fallback
 */
function FullMemberCard({
  member,
  tierLabel,
  isExecutive = false
}: {
  member: TeamMember;
  tierLabel?: string;
  isExecutive?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const badgeClass = badgeStyles[member.badgeColor || "blue"];
  const avatarAccent = avatarAccents[member.badgeColor || "blue"];

  // Extract academic year if present in bio (e.g. "3rd Year | Core Team")
  const yearMatch = member.bio?.match(/(\d+(?:st|nd|rd|th)\s+Year)/i);
  const yearBadge = yearMatch ? yearMatch[1] : null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-5 sm:p-6 text-center shadow-xs hover:border-border-strong hover:shadow-md transition-all flex flex-col items-center justify-between w-full ${
        isExecutive ? "max-w-sm" : ""
      }`}
    >
      {/* Google 4-Color Accent Strip at the top of every card */}
      <div className="absolute top-0 inset-x-0 h-1.5 grid grid-cols-4">
        <div className="bg-[#4285F4] h-full" />
        <div className="bg-[#EA4335] h-full" />
        <div className="bg-[#FBBC04] h-full" />
        <div className="bg-[#34A853] h-full" />
      </div>

      {/* Domain / Tier Pill at top right or center */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 mt-1">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}>
          {member.domain || "GDG Chapter"}
        </span>

        {yearBadge ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-text-tertiary bg-surface-subtle px-2 py-0.5 rounded-full border border-border-subtle">
            <GraduationCap className="w-3 h-3" />
            <span>{yearBadge}</span>
          </span>
        ) : isExecutive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#34A853] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Organizer</span>
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
            {tierLabel || "Core Team"}
          </span>
        )}
      </div>

      {/* Avatar Container: Full-size Photo with Monogram Fallback */}
      <div className="relative my-2 flex flex-col items-center">
        <div
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 bg-gradient-to-b flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200 ${avatarAccent}`}
        >
          {member.avatarUrl && !imageError ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight select-none">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      </div>

      {/* Name and Role */}
      <div className="w-full mt-2">
        <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary tracking-tight leading-snug">
          {member.name}
        </h3>
        <p className="text-xs text-text-secondary mt-1 font-medium">
          {member.role}
        </p>
      </div>

      {/* Social / Contact Links Footer */}
      <div className="mt-4 pt-3 border-t border-border-subtle/80 w-full flex items-center justify-center gap-3">
        {member.socials?.email && (
          <a
            href={`mailto:${member.socials.email}`}
            className="p-1.5 rounded-full bg-surface-subtle hover:bg-surface-page text-text-tertiary hover:text-primary transition-colors border border-border-subtle"
            title={`Email ${member.name}`}
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        )}

        {member.socials?.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-surface-subtle hover:bg-surface-page text-text-tertiary hover:text-text-primary transition-colors border border-border-subtle"
            title={`GitHub of ${member.name}`}
            aria-label={`GitHub profile of ${member.name}`}
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}

        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-surface-subtle hover:bg-surface-page text-text-tertiary hover:text-[#4285F4] transition-colors border border-border-subtle"
            title={`LinkedIn of ${member.name}`}
            aria-label={`LinkedIn profile of ${member.name}`}
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}

        {!member.socials?.email && !member.socials?.github && !member.socials?.linkedin && (
          <span className="text-[10px] text-text-tertiary font-medium">
            GDG on Campus BPPIMT
          </span>
        )}
      </div>
    </div>
  );
}

export function TeamTree() {
  const members = (teamData as TeamMember[]) || [];
  const [activeDomain, setActiveDomain] = useState<string>("All");

  const organizers = members.filter(m => m.category === "organizer");
  const leads = members.filter(m => m.category === "lead");
  const coreMembers = members.filter(m => m.category === "core");

  // Map core team members to their functional domain
  const getCoreMembersForDomain = (domainId: string) => {
    switch (domainId) {
      case "Tech":
        return coreMembers.filter(m => m.role.toLowerCase().includes("tech"));
      case "AIML":
        return coreMembers.filter(m => m.role.toLowerCase().includes("aiml"));
      case "Cloud":
        return coreMembers.filter(m => m.role.toLowerCase().includes("cloud"));
      case "Design":
        return coreMembers.filter(m => m.role.toLowerCase().includes("design"));
      case "Management":
        return coreMembers.filter(m => m.role.toLowerCase().includes("management"));
      case "Marketing":
        return coreMembers.filter(m => m.role.toLowerCase().includes("marketing"));
      default:
        return [];
    }
  };

  const visibleBranches = DOMAIN_BRANCHES.filter(b => {
    if (activeDomain === "All") return true;
    return b.id === activeDomain;
  });

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation & Title */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Chapter Leadership & Organizational Tree
        </h1>
        <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-2xl mx-auto">
          Official hierarchical structure of Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology
        </p>

        {/* Real Chapter Statistics Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface-card text-xs font-semibold text-text-secondary shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span>3 On-Campus Organizers</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface-card text-xs font-semibold text-text-secondary shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span>6 Domain Leads</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface-card text-xs font-semibold text-text-secondary shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            <span>{coreMembers.length} Core Contributors</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface-card text-xs font-semibold text-text-secondary shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
            <span>{members.length} Total Members</span>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveDomain("All")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeDomain === "All"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-subtle text-text-secondary hover:text-text-primary border border-border-subtle"
            }`}
          >
            All Tree Branches
          </button>
          {DOMAIN_BRANCHES.map(b => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveDomain(b.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeDomain === b.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-subtle text-text-secondary hover:text-text-primary border border-border-subtle"
              }`}
            >
              {b.icon}
              <span>{b.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* TREE LEVEL 1: 3 ON-CAMPUS ORGANIZERS (EXECUTIVE TIER)              */}
      {/* ================================================================= */}
      <div className="w-full flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-text-primary bg-surface-subtle border border-border-subtle mb-6 shadow-xs">
          <Crown className="w-4 h-4 text-[#FBBC04]" />
          <span>Tier 1: On-Campus Organizers (Executive Leadership)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-2">
          {organizers.map(org => (
            <FullMemberCard
              key={org.id}
              member={org}
              tierLabel="Executive"
              isExecutive={true}
            />
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* CENTRAL CONNECTING TREE STEM: ORGANIZERS -> DOMAIN BRANCHES        */}
      {/* ================================================================= */}
      <div className="w-full flex flex-col items-center my-8 sm:my-10">
        {/* Vertical Central Trunk with Google Colors */}
        <div className="w-1 h-12 bg-gradient-to-b from-[#4285F4] via-[#EA4335] to-[#34A853] rounded-full" />

        {/* Central Tree Junction Node */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-text-secondary bg-surface-card border border-border-subtle shadow-xs my-2">
          <Network className="w-3.5 h-3.5 text-primary" />
          <span>Tier 2: Functional Domain Leads & Core Teams</span>
        </div>

        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden lg:block w-full max-w-6xl h-0.5 bg-border-subtle relative mt-2">
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* ================================================================= */}
      {/* TREE LEVEL 2 & 3: DOMAIN BRANCHES (LEAD + CORE MEMBERS FULL CARDS) */}
      {/* ================================================================= */}
      <div className="w-full space-y-12 sm:space-y-16">
        {visibleBranches.map(branch => {
          const lead = leads.find(l => l.id === branch.leadId);
          const branchCoreMembers = getCoreMembersForDomain(branch.id);

          return (
            <div
              key={branch.id}
              className="w-full rounded-3xl border border-border-subtle bg-surface-card/60 p-6 sm:p-8 shadow-xs hover:border-border-strong transition-all relative overflow-hidden"
            >
              {/* Subtle Domain Accent Color Indicator */}
              <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ backgroundColor: branch.brandColor }}
              />

              {/* Branch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle flex-shrink-0">
                    {branch.icon}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                      {branch.name}
                    </h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Domain Branch &bull; Led by {lead?.name || "Team Lead"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${branch.badgeStyle}`}>
                    {branchCoreMembers.length + (lead ? 1 : 0)} Official Members
                  </span>
                </div>
              </div>

              {/* Tree Hierarchy within the Domain */}
              <div className="mt-8 flex flex-col items-center">

                {/* --- DOMAIN LEAD CARD (TIER 2 NODE) --- */}
                {lead && (
                  <div className="w-full max-w-sm flex flex-col items-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-text-tertiary bg-surface-subtle border border-border-subtle mb-3">
                      <UserCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Domain Lead</span>
                    </div>

                    <FullMemberCard
                      member={lead}
                      tierLabel="Team Lead"
                      isExecutive={false}
                    />

                    {/* Connecting Vertical Stem down to Core Members */}
                    <div className="w-0.5 h-8 bg-border-subtle my-2" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border-strong -mt-1 mb-2" />
                  </div>
                )}

                {/* --- CORE TEAM MEMBERS CARDS (TIER 3 NODES) --- */}
                <div className="w-full mt-2">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-0.5 w-12 bg-border-subtle" />
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary bg-surface-subtle px-3 py-1 rounded-full border border-border-subtle">
                      Core Contributors ({branchCoreMembers.length})
                    </span>
                    <div className="h-0.5 w-12 bg-border-subtle" />
                  </div>

                  {branchCoreMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                      {branchCoreMembers.map(member => (
                        <FullMemberCard
                          key={member.id}
                          member={member}
                          tierLabel="Core Contributor"
                          isExecutive={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto text-center p-6 rounded-2xl border border-dashed border-border-subtle bg-surface-subtle/50">
                      <p className="text-xs text-text-secondary font-medium">
                        Google Cloud Study Jams & Community Cohort
                      </p>
                      <span className="text-[11px] text-text-tertiary mt-1 block">
                        Technical workshops and study paths guided directly by Cloud Lead
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Return to Homepage Button */}
      <div className="mt-16 pt-8 border-t border-border-subtle w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-subtle hover:bg-surface-page border border-border-subtle hover:border-border-strong text-text-primary text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        <p className="text-xs text-text-tertiary text-center sm:text-right">
          Official Team Directory &bull; Google Developer Groups on Campus BPPIMT
        </p>
      </div>
    </div>
  );
}

export default TeamTree;
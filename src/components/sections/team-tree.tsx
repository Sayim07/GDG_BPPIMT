"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Github,
  Linkedin,
  ShieldCheck,
  Network,
  ArrowLeft,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  Filter,
  ChevronDown,
  Check
} from "lucide-react";
import {
  TechDomainIcon,
  AimlDomainIcon,
  CloudDomainIcon,
  DesignDomainIcon,
  ManagementDomainIcon,
  MarketingDomainIcon,
  TeamsClusterIcon
} from "@/components/ui/domain-icons";
import teamData from "@/data/team.json";
import { TeamMember } from "@/types/schema";

interface DomainBranch {
  id: string;
  name: string;
  icon: React.ReactNode;
  brandColor: string;
  badgeStyle: string;
  cardBorder: string;
  containerBg: string;
  leadId: string;
}

const DOMAIN_BRANCHES: DomainBranch[] = [
  {
    id: "Tech",
    name: "Tech & Architecture",
    icon: <TechDomainIcon className="w-5 h-5 text-[#4285F4]" />,
    brandColor: "#4285F4",
    badgeStyle: "bg-blue-500/15 text-[#1a73e8] dark:text-[#8ab4f8] border-blue-500/30",
    cardBorder: "border-blue-500/40 hover:border-blue-500 hover:shadow-[0_12px_36px_rgba(66,133,244,0.18)]",
    containerBg: "from-blue-500/[0.04] via-transparent to-blue-500/[0.02] border-blue-500/25",
    leadId: "sayim-mullick"
  },
  {
    id: "AIML",
    name: "AI & Machine Learning",
    icon: <AimlDomainIcon className="w-5 h-5 text-[#EA4335]" />,
    brandColor: "#EA4335",
    badgeStyle: "bg-red-500/15 text-[#d93025] dark:text-[#f28b82] border-red-500/30",
    cardBorder: "border-red-500/40 hover:border-red-500 hover:shadow-[0_12px_36px_rgba(234,67,53,0.18)]",
    containerBg: "from-red-500/[0.04] via-transparent to-red-500/[0.02] border-red-500/25",
    leadId: "raktik-ghosh"
  },
  {
    id: "Cloud",
    name: "Cloud & DevOps",
    icon: <CloudDomainIcon className="w-5 h-5 text-[#FBBC04]" />,
    brandColor: "#FBBC04",
    badgeStyle: "bg-amber-500/15 text-[#e37400] dark:text-[#fdd663] border-amber-500/30",
    cardBorder: "border-amber-500/40 hover:border-amber-500 hover:shadow-[0_12px_36px_rgba(251,188,4,0.18)]",
    containerBg: "from-amber-500/[0.04] via-transparent to-amber-500/[0.02] border-amber-500/25",
    leadId: "aaryan-kumar"
  },
  {
    id: "Design",
    name: "Design & UI/UX",
    icon: <DesignDomainIcon className="w-5 h-5 text-[#4285F4]" />,
    brandColor: "#4285F4",
    badgeStyle: "bg-blue-500/15 text-[#1a73e8] dark:text-[#8ab4f8] border-blue-500/30",
    cardBorder: "border-blue-500/40 hover:border-blue-500 hover:shadow-[0_12px_36px_rgba(66,133,244,0.18)]",
    containerBg: "from-blue-500/[0.04] via-transparent to-blue-500/[0.02] border-blue-500/25",
    leadId: "narayan-kumar-jha"
  },
  {
    id: "Management",
    name: "Operations & Logistics",
    icon: <ManagementDomainIcon className="w-5 h-5 text-[#34A853]" />,
    brandColor: "#34A853",
    badgeStyle: "bg-emerald-500/15 text-[#188038] dark:text-[#81c995] border-emerald-500/30",
    cardBorder: "border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_12px_36px_rgba(52,168,83,0.18)]",
    containerBg: "from-emerald-500/[0.04] via-transparent to-emerald-500/[0.02] border-emerald-500/25",
    leadId: "aadipto-ghosh"
  },
  {
    id: "Marketing",
    name: "Marketing & Outreach",
    icon: <MarketingDomainIcon className="w-5 h-5 text-[#EA4335]" />,
    brandColor: "#EA4335",
    badgeStyle: "bg-red-500/15 text-[#d93025] dark:text-[#f28b82] border-red-500/30",
    cardBorder: "border-red-500/40 hover:border-red-500 hover:shadow-[0_12px_36px_rgba(234,67,53,0.18)]",
    containerBg: "from-red-500/[0.04] via-transparent to-red-500/[0.02] border-red-500/25",
    leadId: "satarupa-sarkar"
  }
];

const badgeStyles = {
  blue: "bg-blue-500/15 text-[#1a73e8] dark:text-[#8ab4f8] border-blue-500/30",
  red: "bg-red-500/15 text-[#d93025] dark:text-[#f28b82] border-red-500/30",
  yellow: "bg-amber-500/15 text-[#e37400] dark:text-[#fdd663] border-amber-500/30",
  green: "bg-emerald-500/15 text-[#188038] dark:text-[#81c995] border-emerald-500/30",
};

const avatarAccents = {
  blue: "bg-[#4285F4]/15 text-[#1a73e8] dark:text-[#8ab4f8] border-[#4285F4]/40 shadow-[0_0_20px_rgba(66,133,244,0.15)]",
  red: "bg-[#EA4335]/15 text-[#d93025] dark:text-[#f28b82] border-[#EA4335]/40 shadow-[0_0_20px_rgba(234,67,53,0.15)]",
  yellow: "bg-[#FBBC04]/15 text-[#e37400] dark:text-[#fdd663] border-[#FBBC04]/40 shadow-[0_0_20px_rgba(251,188,4,0.15)]",
  green: "bg-[#34A853]/15 text-[#188038] dark:text-[#81c995] border-[#34A853]/40 shadow-[0_0_20px_rgba(52,168,83,0.15)]",
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * On-Campus Organizer Card
 * Clean, authoritative presence with authentic 4-color Google bar and high contrast.
 */
function ExecutiveOrganizerCard({ member }: { member: TeamMember }) {
  const [imageError, setImageError] = useState(false);
  const avatarAccent = avatarAccents[member.badgeColor || "blue"];

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#202124] p-7 sm:p-8 text-center shadow-[0_12px_36px_-6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_22px_50px_-8px_rgba(66,133,244,0.22)] hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-between w-full">
      {/* Google 4-Color Accent Strip */}
      <div className="absolute top-0 inset-x-0 h-2 grid grid-cols-4">
        <div className="bg-[#4285F4] h-full" />
        <div className="bg-[#EA4335] h-full" />
        <div className="bg-[#FBBC04] h-full" />
        <div className="bg-[#34A853] h-full" />
      </div>

      {/* Top Leadership Badge */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 mt-1">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/25 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>On-Campus Organizer</span>
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-tertiary bg-surface-subtle px-2.5 py-1 rounded-full border border-border-subtle">
          <span>GDG Chapter</span>
        </span>
      </div>

      {/* Scaled Avatar */}
      <div className="relative my-3 flex flex-col items-center">
        <div
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 bg-gradient-to-b flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 ${avatarAccent}`}
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
            <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight select-none">
              {getInitials(member.name)}
            </span>
          )}
        </div>
        {/* Verified Badge Pin */}
        <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-[#202124] rounded-full shadow-md">
          <CheckCircle2 className="w-5 h-5 text-[#4285F4] fill-white dark:fill-[#202124]" />
        </div>
      </div>

      {/* High-Contrast Typography Hierarchy */}
      <div className="w-full mt-3">
        <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 mt-1.5 uppercase tracking-wide">
          {member.role}
        </p>
        <span className="inline-block mt-2 text-xs font-semibold text-text-tertiary bg-surface-subtle px-3 py-1 rounded-full border border-border-subtle">
          Google Developer Groups on Campus
        </span>
      </div>

      {/* Social / Contact Links Footer */}
      <div className="mt-5 pt-4 border-t border-border-subtle w-full flex items-center justify-center gap-3">
        {member.socials?.email && (
          <a
            href={`mailto:${member.socials.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-[#1a73e8] dark:text-[#8ab4f8] text-xs font-bold border border-blue-500/30 transition-all hover:scale-105"
            title={`Email ${member.name}`}
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Connect</span>
          </a>
        )}

        {member.socials?.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-primary transition-colors border border-border-subtle shadow-xs"
            title={`GitHub of ${member.name}`}
            aria-label={`GitHub profile of ${member.name}`}
          >
            <Github className="w-4 h-4" />
          </a>
        )}

        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-[#4285F4] transition-colors border border-border-subtle shadow-xs"
            title={`LinkedIn of ${member.name}`}
            aria-label={`LinkedIn profile of ${member.name}`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Domain Lead Card
 * Positioned as the authoritative lead node for its respective domain branch.
 */
function DomainLeadCard({
  member,
  branch
}: {
  member: TeamMember;
  branch: DomainBranch;
}) {
  const [imageError, setImageError] = useState(false);
  const badgeClass = badgeStyles[member.badgeColor || "blue"];
  const avatarAccent = avatarAccents[member.badgeColor || "blue"];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-[#202124] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgb(0,0,0,0.45)] border-2 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-between w-full h-full ${branch.cardBorder}`}
    >
      {/* Top Accent Strip with Domain Color */}
      <div
        className="absolute top-0 inset-x-0 h-1.5"
        style={{ backgroundColor: branch.brandColor }}
      />

      {/* Top Pill Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 mt-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
          {branch.icon}
          <span>{member.domain || branch.name}</span>
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-text-primary bg-surface-subtle px-2.5 py-0.5 rounded-full border border-border-subtle">
          <UserCheck className="w-3.5 h-3.5 text-primary" />
          <span>Team Lead</span>
        </span>
      </div>

      {/* Avatar Container */}
      <div className="relative my-2 flex flex-col items-center">
        <div
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 bg-gradient-to-b flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 ${avatarAccent}`}
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
            <span className="font-heading text-xl sm:text-2xl font-black tracking-tight select-none">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      </div>

      {/* High-Contrast Name and Role */}
      <div className="w-full mt-2">
        <h4 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-primary transition-colors">
          {member.name}
        </h4>
        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 mt-1">
          {member.role}
        </p>
      </div>

      {/* Contact Links */}
      <div className="mt-4 pt-3.5 border-t border-border-subtle w-full flex items-center justify-center gap-3">
        {member.socials?.email && (
          <a
            href={`mailto:${member.socials.email}`}
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-primary transition-colors border border-border-subtle shadow-xs"
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
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-primary transition-colors border border-border-subtle shadow-xs"
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
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-[#4285F4] transition-colors border border-border-subtle shadow-xs"
            title={`LinkedIn of ${member.name}`}
            aria-label={`LinkedIn profile of ${member.name}`}
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}

        {!member.socials?.email && !member.socials?.github && !member.socials?.linkedin && (
          <span className="text-[11px] text-text-tertiary font-semibold uppercase tracking-wider">
            Domain Lead
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Core Contributor Card
 * High-stature, equal-sized profile card matching the domain lead card.
 */
function CoreContributorCard({
  member,
  branch
}: {
  member: TeamMember;
  branch: DomainBranch;
}) {
  const [imageError, setImageError] = useState(false);
  const badgeClass = badgeStyles[member.badgeColor || "blue"];
  const avatarAccent = avatarAccents[member.badgeColor || "blue"];

  // Academic year if present (e.g. "3rd Year | Core Team")
  const yearMatch = member.bio?.match(/(\d+(?:st|nd|rd|th)\s+Year)/i);
  const yearBadge = yearMatch ? yearMatch[1] : null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-[#202124] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgb(0,0,0,0.45)] border-2 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-between w-full ${branch.cardBorder}`}
    >
      {/* Top Accent Strip with Domain Color */}
      <div
        className="absolute top-0 inset-x-0 h-1.5"
        style={{ backgroundColor: branch.brandColor }}
      />

      {/* Top Header Pill Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 mt-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
          {branch.icon}
          <span>{member.domain || branch.name}</span>
        </span>

        {yearBadge ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-text-primary bg-surface-subtle px-2.5 py-0.5 rounded-full border border-border-subtle">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span>{yearBadge}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-text-primary bg-surface-subtle px-2.5 py-0.5 rounded-full border border-border-subtle">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>Core Team</span>
          </span>
        )}
      </div>

      {/* Avatar Container */}
      <div className="relative my-2 flex flex-col items-center">
        <div
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 bg-gradient-to-b flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 ${avatarAccent}`}
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
            <span className="font-heading text-xl sm:text-2xl font-black tracking-tight select-none">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      </div>

      {/* High-Contrast Name and Role */}
      <div className="w-full mt-2">
        <h4 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-primary transition-colors">
          {member.name}
        </h4>
        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 mt-1">
          {member.role}
        </p>
      </div>

      {/* Contact Links */}
      <div className="mt-4 pt-3.5 border-t border-border-subtle w-full flex items-center justify-center gap-3">
        {member.socials?.email && (
          <a
            href={`mailto:${member.socials.email}`}
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-primary transition-colors border border-border-subtle shadow-xs"
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
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-primary transition-colors border border-border-subtle shadow-xs"
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
            className="p-2 rounded-full bg-surface-subtle hover:bg-surface-page text-slate-700 dark:text-zinc-200 hover:text-[#4285F4] transition-colors border border-border-subtle shadow-xs"
            title={`LinkedIn of ${member.name}`}
            aria-label={`LinkedIn profile of ${member.name}`}
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}

        {!member.socials?.email && !member.socials?.github && !member.socials?.linkedin && (
          <span className="text-[11px] text-text-tertiary font-semibold uppercase tracking-wider py-1">
            GDG Core Team
          </span>
        )}
      </div>
    </div>
  );
}

export function TeamTree() {
  const members = (teamData as TeamMember[]) || [];
  const [activeDomain, setActiveDomain] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const activeBranchObj = DOMAIN_BRANCHES.find(b => b.id === activeDomain);

  return (
    <div className="w-full">
      {/* ================================================================= */}
      {/* HEADER SECTION (CLEAN & MINIMALIST WITH LEFT-ALIGNED FILTER MENU) */}
      {/* ================================================================= */}
      <div className="w-full text-left mb-10 sm:mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          OUR TEAM
        </h1>

        {/* LEFT-ALIGNED DOMAIN FILTER DROPDOWN MENU */}
        <div className="relative inline-block mt-6">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202124] border border-slate-200 dark:border-white/15 shadow-xs hover:border-primary text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer select-none"
            aria-label="Filter domain branches"
          >
            <TeamsClusterIcon className="w-4 h-4 text-primary" />
            <span>
              {activeDomain === "All"
                ? "All Branches (Full Tree)"
                : activeBranchObj?.name || activeDomain}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#202124] border border-slate-200 dark:border-white/15 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setActiveDomain("All");
                  setIsFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-left transition-colors cursor-pointer ${
                  activeDomain === "All"
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 dark:text-zinc-200 hover:bg-surface-subtle"
                }`}
              >
                <span>All Branches (Full Tree)</span>
                {activeDomain === "All" && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
              <div className="h-px bg-border-subtle my-1" />
              {DOMAIN_BRANCHES.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setActiveDomain(b.id);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-left transition-colors cursor-pointer ${
                    activeDomain === b.id
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-slate-700 dark:text-zinc-200 hover:bg-surface-subtle"
                  }`}
                >
                  {b.icon}
                  <span className="flex-1">{b.name}</span>
                  {activeDomain === b.id && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ON-CAMPUS ORGANIZERS (EXECUTIVE CHAPTER LEADERSHIP PARENT CARD)   */}
      {/* ================================================================= */}
      <div className="w-full rounded-3xl border border-blue-500/25 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-emerald-500/[0.03] p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all">
        {/* Google 4-Color Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-2 grid grid-cols-4">
          <div className="bg-[#4285F4] h-full" />
          <div className="bg-[#EA4335] h-full" />
          <div className="bg-[#FBBC04] h-full" />
          <div className="bg-[#34A853] h-full" />
        </div>

        {/* Section Header with prominent, authoritative typography */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle mb-8">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#202124] border-2 border-primary/40 shadow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                On-Campus Organizers
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300 mt-0.5">
                Executive Chapter Leadership &bull; Guiding GDG on Campus BPPIMT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold border shadow-xs bg-primary/10 text-primary border-primary/30">
              {organizers.length} Chapter Organizers
            </span>
          </div>
        </div>

        {/* 3 Executive Organizer Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {organizers.map(org => (
            <ExecutiveOrganizerCard key={org.id} member={org} />
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* CENTRAL CONNECTING TREE STEM: ORGANIZERS -> DOMAIN BRANCHES        */}
      {/* ================================================================= */}
      <div className="w-full flex flex-col items-center my-10 sm:my-14">
        {/* Vertical Central Trunk with Google Quad-Color Gradient */}
        <div className="w-1.5 h-16 bg-gradient-to-b from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] rounded-full shadow-sm" />

        {/* Central Tree Junction Node */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white bg-white dark:bg-[#202124] border-2 border-slate-200 dark:border-white/15 shadow-md my-3 ring-4 ring-primary/10">
          <Network className="w-4 h-4 text-primary" />
          <span>Functional Domain Leads &amp; Core Teams</span>
        </div>

        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden lg:block w-full max-w-6xl h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-zinc-600 to-transparent relative mt-3">
          <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
        </div>
      </div>

      {/* ================================================================= */}
      {/* DOMAIN BRANCHES (HORIZONTAL TREE FLOW: LEAD -> CORE CONTRIBUTORS) */}
      {/* ================================================================= */}
      <div className="w-full space-y-12 sm:space-y-16">
        {visibleBranches.map(branch => {
          const lead = leads.find(l => l.id === branch.leadId);
          const branchCoreMembers = getCoreMembersForDomain(branch.id);

          return (
            <div
              key={branch.id}
              className={`w-full rounded-3xl border bg-gradient-to-br ${branch.containerBg} p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all`}
            >
              {/* Domain Accent Color Indicator */}
              <div
                className="absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: branch.brandColor }}
              />

              {/* Branch Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
                <div className="flex items-center gap-3.5">
                  <div
                    className="p-3 rounded-2xl bg-white dark:bg-[#202124] border-2 shadow-sm flex-shrink-0"
                    style={{ borderColor: branch.brandColor }}
                  >
                    {branch.icon}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {branch.name}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300 mt-0.5">
                      Functional Domain Branch &bull; Led by {lead?.name || "Domain Lead"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border shadow-xs ${branch.badgeStyle}`}>
                    {branchCoreMembers.length + (lead ? 1 : 0)} Official Members
                  </span>
                </div>
              </div>

              {/* Organizational Tree within the Domain */}
              <div className="mt-8 flex flex-col items-center">
                {/* 1. DOMAIN LEAD CARD */}
                {lead && (
                  <div className="w-full max-w-[320px] sm:max-w-[340px] flex justify-center">
                    <DomainLeadCard member={lead} branch={branch} />
                  </div>
                )}

                {/* 2. TREE CONNECTOR ROOTS */}
                {branchCoreMembers.length === 2 && (
                  <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative my-2">
                    {/* Vertical trunk line down from Lead */}
                    <div
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: branch.brandColor, opacity: 0.8 }}
                    />
                    {/* Horizontal Branching Fork spanning to the 2 roots */}
                    <div className="w-1/2 relative h-6">
                      {/* Horizontal connecting bar */}
                      <div
                        className="absolute top-0 inset-x-0 h-1.5 rounded-full"
                        style={{ backgroundColor: branch.brandColor, opacity: 0.8 }}
                      />
                      {/* Central fork junction node */}
                      <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#202124] border-2 shadow-sm ring-4 ring-primary/10"
                        style={{ borderColor: branch.brandColor }}
                      />
                      {/* Left Root Drop Line into Member 1 */}
                      <div
                        className="absolute top-0 left-0 w-1.5 h-6 rounded-full"
                        style={{ backgroundColor: branch.brandColor, opacity: 0.8 }}
                      />
                      {/* Right Root Drop Line into Member 2 */}
                      <div
                        className="absolute top-0 right-0 w-1.5 h-6 rounded-full"
                        style={{ backgroundColor: branch.brandColor, opacity: 0.8 }}
                      />
                    </div>
                  </div>
                )}

                {branchCoreMembers.length === 1 && (
                  <div className="w-full flex flex-col items-center relative my-2">
                    {/* Single straight root line from Lead into Member 1 */}
                    <div
                      className="w-1.5 h-10 rounded-full"
                      style={{ backgroundColor: branch.brandColor, opacity: 0.8 }}
                    />
                    <div
                      className="w-4 h-4 rounded-full bg-white dark:bg-[#202124] border-2 -mt-2 shadow-sm ring-4 ring-primary/10"
                      style={{ borderColor: branch.brandColor }}
                    />
                  </div>
                )}

                {/* 3. CORE CONTRIBUTORS (EQUAL SIZE AS TEAM LEAD) */}
                {branchCoreMembers.length === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto w-full mt-1">
                    {branchCoreMembers.map(member => (
                      <CoreContributorCard key={member.id} member={member} branch={branch} />
                    ))}
                  </div>
                )}

                {branchCoreMembers.length === 1 && (
                  <div className="w-full max-w-[320px] sm:max-w-[340px] mx-auto flex justify-center mt-1">
                    {branchCoreMembers.map(member => (
                      <CoreContributorCard key={member.id} member={member} branch={branch} />
                    ))}
                  </div>
                )}

                {branchCoreMembers.length === 0 && (
                  <div className="w-full max-w-md mx-auto text-center p-8 mt-6 rounded-2xl border-2 border-dashed border-border-subtle bg-white/60 dark:bg-[#202124]/60 shadow-xs flex flex-col items-center justify-center">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 font-bold">
                      Google Cloud Study Jams &amp; Community Cohort
                    </p>
                    <span className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 block font-medium">
                      Technical workshops and study jams guided directly by Cloud Team Lead
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Return to Homepage Button */}
      <div className="mt-16 pt-8 border-t border-border-subtle w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#202124] hover:bg-surface-subtle border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 text-center sm:text-right">
          Official Team Directory &bull; Google Developer Groups on Campus BPPIMT
        </p>
      </div>
    </div>
  );
}

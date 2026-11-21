"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import {
  TechDomainIcon,
  AimlDomainIcon,
  CloudDomainIcon,
  DesignDomainIcon,
  ManagementDomainIcon,
  MarketingDomainIcon
} from "@/components/ui/domain-icons";
import teamData from "@/data/team.json";
import { TeamMember } from "@/types/schema";
import { ProfileCard } from "@/components/ui/profile-card";

interface DomainConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  brandColor: string;
  leadId: string;
  coreIds: [string, string];
}

const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    id: "Tech",
    name: "Tech & Architecture",
    icon: <TechDomainIcon className="w-4 h-4 text-[#4285F4]" />,
    brandColor: "#4285F4",
    leadId: "sayim-mullick",
    coreIds: ["bikramjit-pakhira", "sayantan-pachal"]
  },
  {
    id: "AIML",
    name: "AI & Machine Learning",
    icon: <AimlDomainIcon className="w-4 h-4 text-[#EA4335]" />,
    brandColor: "#EA4335",
    leadId: "raktik-ghosh",
    coreIds: ["mouli-biswas", "subhajit-majee"]
  },
  {
    id: "Cloud",
    name: "Cloud & DevOps",
    icon: <CloudDomainIcon className="w-4 h-4 text-[#FBBC04]" />,
    brandColor: "#FBBC04",
    leadId: "aaryan-kumar",
    coreIds: ["larenza-roy", "saurabh-kumar-singh"]
  },
  {
    id: "Design",
    name: "Design & UI/UX",
    icon: <DesignDomainIcon className="w-4 h-4 text-[#4285F4]" />,
    brandColor: "#4285F4",
    leadId: "narayan-kumar-jha",
    coreIds: ["alfia-ashraf", "sagnik-saha"]
  },
  {
    id: "Management",
    name: "Operations & Logistics",
    icon: <ManagementDomainIcon className="w-4 h-4 text-[#34A853]" />,
    brandColor: "#34A853",
    leadId: "aadipto-ghosh",
    coreIds: ["soham-bandyopadhyay", "sagnik-dutta"]
  },
  {
    id: "Marketing",
    name: "Marketing & Outreach",
    icon: <MarketingDomainIcon className="w-4 h-4 text-[#EA4335]" />,
    brandColor: "#EA4335",
    leadId: "satarupa-sarkar",
    coreIds: ["sakchham-kapoor", "shreyanka-satpathy"]
  }
];

function renderMemberCard(
  member: TeamMember,
  isOrganizer: boolean,
  isMain: boolean,
  brandColor: string
) {
  const handle = member.socials?.github
    ? member.socials.github.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')
    : member.id.replace(/-/g, '_');

  const memberCategory = isOrganizer ? "organizer" : (member.category || "core");

  let status = "Core Member";
  if (isOrganizer) {
    status = isMain ? "Lead Organizer" : "Organizer";
  } else if (memberCategory === "lead") {
    status = "Domain Lead";
  } else if (member.bio && member.bio.includes("Year")) {
    const yr = member.bio.split("|")[0].trim();
    status = `Core Member • ${yr}`;
  }

  return (
    <ProfileCard
      avatarUrl={member.avatarUrl}
      name={member.name}
      title={member.role}
      handle={handle}
      status={status}
      category={memberCategory}
      statusColor={brandColor || "#4285F4"}
      backdropColor={brandColor ? `${brandColor}22` : undefined}
      socials={member.socials}
      theme="dark"
      enableTilt={true}
      tiltStrength={12}
      holo={0.8}
      glare={0.5}
      parallax={0}
    />
  );
}

/**
 * Expandable 3-Card Cluster Component
 * Completely borderless/card-less background.
 * Profile cards feature the 3D holographic foil tilt and glare effect.
 * Unhovered: Only the main member card is visible.
 * Hovered: Left and right cards smoothly fan out.
 */
interface ExpandableTeamTrioProps {
  mainMember: TeamMember;
  leftMember: TeamMember;
  rightMember: TeamMember;
  domainName: string;
  brandColor: string;
  isOrganizer?: boolean;
}

function ExpandableTeamTrio({
  mainMember,
  leftMember,
  rightMember,
  brandColor,
  isOrganizer = false
}: ExpandableTeamTrioProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const isExpanded = isHovered || isToggled;

  const handleContainerClick = () => {
    setIsToggled(prev => !prev);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {isDesktop ? (
        /* DESKTOP: Centered flex stage with smooth left and right card fan-out */
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleContainerClick}
          className="relative w-full max-w-5xl mx-auto h-[460px] sm:h-[475px] flex items-center justify-center cursor-pointer select-none"
        >
          {/* 1. LEFT CO-MEMBER CARD */}
          <motion.div
            className="absolute z-10 flex-shrink-0"
            style={{
              pointerEvents: isExpanded ? "auto" : "none"
            }}
            animate={{
              x: isExpanded ? -330 : 0,
              y: 0,
              scale: isExpanded ? 1 : 0.95,
              opacity: isExpanded ? 1 : 0,
              zIndex: isExpanded ? 15 : 5,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
              mass: 0.8
            }}
          >
            {renderMemberCard(leftMember, isOrganizer, false, brandColor)}
          </motion.div>

          {/* 2. CENTER MAIN/LEAD CARD */}
          <motion.div
            className="relative z-20 flex-shrink-0"
            animate={{
              x: 0,
              y: 0,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
              mass: 0.8
            }}
          >
            {renderMemberCard(mainMember, isOrganizer, true, brandColor)}
          </motion.div>

          {/* 3. RIGHT CO-MEMBER CARD */}
          <motion.div
            className="absolute z-10 flex-shrink-0"
            style={{
              pointerEvents: isExpanded ? "auto" : "none"
            }}
            animate={{
              x: isExpanded ? 330 : 0,
              y: 0,
              scale: isExpanded ? 1 : 0.95,
              opacity: isExpanded ? 1 : 0,
              zIndex: isExpanded ? 15 : 5,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
              mass: 0.8
            }}
          >
            {renderMemberCard(rightMember, isOrganizer, false, brandColor)}
          </motion.div>
        </div>
      ) : (
        /* MOBILE (< 768px): Centered single card + tap to view vertical stack */
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[320px] flex justify-center">
            {renderMemberCard(mainMember, isOrganizer, true, brandColor)}
          </div>

          <button
            type="button"
            onClick={handleContainerClick}
            className="my-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 dark:bg-[#202124] text-slate-900 dark:text-white border border-[#ded5be] dark:border-white/10 shadow-sm text-xs font-bold hover:bg-white"
          >
            <span>{isExpanded ? "Collapse Team" : "Tap to view co-members"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full flex flex-col items-center gap-6 overflow-hidden"
              >
                <div className="w-full max-w-[320px] flex justify-center">
                  {renderMemberCard(leftMember, isOrganizer, false, brandColor)}
                </div>
                <div className="w-full max-w-[320px] flex justify-center">
                  {renderMemberCard(rightMember, isOrganizer, false, brandColor)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Main Team Section Component
 * Displays only the domain names and the centered holographic 3D tilt profile cards.
 * Zero background boxes or nested cards.
 */
export function TeamTree() {
  const members = (teamData as TeamMember[]) || [];
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const protyoy = members.find(m => m.id === "protyoy-bhandary") || members[0];
  const sagnik = members.find(m => m.id === "sagnik-maitra") || members[1];
  const sneha = members.find(m => m.id === "sneha-patra") || members[2];

  const filterOptions = [
    { id: "All", label: "All Teams" },
    { id: "Organizers", label: "Organizers" },
    { id: "Tech", label: "Tech" },
    { id: "AIML", label: "AI/ML" },
    { id: "Cloud", label: "Cloud" },
    { id: "Design", label: "Design" },
    { id: "Management", label: "Management" },
    { id: "Marketing", label: "Marketing" }
  ];

  const visibleDomains = DOMAIN_CONFIGS.filter(d => {
    if (activeFilter === "All") return true;
    return d.id === activeFilter;
  });

  const showOrganizers = activeFilter === "All" || activeFilter === "Organizers";

  return (
    <div className="w-full">
      {/* Top Header & Filter Pills */}
      <div className="w-full text-center mb-4 sm:mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          OUR TEAM
        </h1>

        {/* Domain Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none mt-2.5">
          {filterOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveFilter(option.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                activeFilter === option.id
                  ? "bg-slate-900 text-white shadow-md shadow-black/15 scale-105"
                  : "bg-white/85 dark:bg-[#202124] text-slate-800 dark:text-zinc-200 hover:text-black border border-[#ded5be] dark:border-white/10 hover:border-black/30 shadow-sm"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. On-Campus Organizers */}
      {showOrganizers && (
        <div className="w-full mb-10 sm:mb-14 flex flex-col items-center">
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4 text-center">
            On-Campus Organizers
          </h2>

          <ExpandableTeamTrio
            mainMember={protyoy}
            leftMember={sagnik}
            rightMember={sneha}
            domainName="Chapter Leadership"
            brandColor="#4285F4"
            isOrganizer={true}
          />
        </div>
      )}

      {/* 2. Functional Domain Teams */}
      <div className="w-full space-y-10 sm:space-y-14">
        {visibleDomains.map(domain => {
          const lead = members.find(m => m.id === domain.leadId) || members[0];
          const coreLeft = members.find(m => m.id === domain.coreIds[0]) || members[1];
          const coreRight = members.find(m => m.id === domain.coreIds[1]) || members[2];

          return (
            <div key={domain.id} className="w-full flex flex-col items-center">
              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4 text-center">
                {domain.name}
              </h2>

              <ExpandableTeamTrio
                key={domain.id}
                mainMember={lead}
                leftMember={coreLeft}
                rightMember={coreRight}
                domainName={domain.name}
                brandColor={domain.brandColor}
                isOrganizer={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamTree;

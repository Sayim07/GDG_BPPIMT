"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Globe,
  Linkedin,
  Github,
  MessageCircle,
  Instagram,
  Twitter,
  ArrowUpRight,
  Check,
  Copy
} from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import { ChapterConfig } from "@/types/schema";

export function SocialSection() {
  const chapter = chapterConfig as ChapterConfig;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleCopyLink = (url: string, name: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(name);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  interface SocialChannel {
    name: string;
    tagline: string;
    handle: string;
    description: string;
    href: string;
    icon: React.ElementType;
    accentColor: string;
    badge: string;
    characterImage: string;
    ctaText: string;
  }

  const socialChannels: SocialChannel[] = [
    {
      name: "Official Chapter",
      tagline: "Google Developer Student Portal",
      handle: "GDG on Campus BPPIMT",
      description:
        "RSVP to upcoming events, join hands-on workshops, earn certificates, and connect directly with fellow student builders.",
      href:
        chapter.communityUrl ||
        chapter.socials?.community ||
        "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/",
      icon: Globe,
      accentColor: "#4285F4",
      badge: "Google Community",
      characterImage: "/images/characters/google.png",
      ctaText: "Join Chapter"
    },
    {
      name: "LinkedIn",
      tagline: "Career, Mentorship & Highlights",
      handle: "gdg-bppimt",
      description:
        "Leadership spotlights, event announcements, speaker profiles, industry mentorship, and official chapter milestones.",
      href:
        chapter.socials?.linkedin ||
        "https://in.linkedin.com/company/gdgbppimt",
      icon: Linkedin,
      accentColor: "#0A66C2",
      badge: "Professional",
      characterImage: "/images/characters/linkedin.png",
      ctaText: "Connect"
    },
    {
      name: "GitHub",
      tagline: "Codebases & Community Projects",
      handle: "Sayim07 / GDG_BPPIMT",
      description:
        "Official repository of website, community open-source starter templates, hackathon codebases, and student pull requests.",
      href:
        chapter.socials?.github ||
        "https://github.com/Sayim07/GDG_BPPIMT",
      icon: Github,
      accentColor: isDark ? "#E6EDF3" : "#24292F",
      badge: "Open Source",
      characterImage: "/images/characters/github.png",
      ctaText: "Star & Fork"
    },
    {
      name: "WhatsApp Community",
      tagline: "Study Jams & Hackathon Alerts",
      handle: "Official Discussion Group",
      description:
        "Real-time announcements, instant hackathon team formations, quick peer problem-solving, and study jam notifications.",
      href:
        chapter.socials?.whatsapp ||
        "https://chat.whatsapp.com/invite/gdg-bppimt",
      icon: MessageCircle,
      accentColor: "#25D366",
      badge: "Instant Chat",
      characterImage: "/images/characters/whatsapp.png",
      ctaText: "Join Group"
    },
    {
      name: "Instagram",
      tagline: "Behind The Scenes & Culture",
      handle: "@gdg.bppimt",
      description:
        "Event recap reels, behind-the-scenes organizer culture, tech memes, countdown stories, and community visual highlights.",
      href:
        chapter.socials?.instagram ||
        "https://www.instagram.com/gdg.bppimt/",
      icon: Instagram,
      accentColor: "#E4405F",
      badge: "Visuals & Reels",
      characterImage: "/images/characters/instagram.png",
      ctaText: "Follow Us"
    },
    {
      name: "X (Twitter)",
      tagline: "Tech Announcements & Threads",
      handle: "@gdg_bppimt",
      description:
        "Live event coverage, Google developer announcements, keynote reactions, technology threads, and tech ecosystem news.",
      href:
        chapter.socials?.twitter ||
        "https://x.com/gdg_bppimt",
      icon: Twitter,
      accentColor: "#1DA1F2",
      badge: "Live Updates",
      characterImage: "/images/characters/twitter.png",
      ctaText: "Follow on X"
    }
  ];

  return (
    <div className="w-full pb-16">
      {/* Header Container */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        {/* Google 4-Color Accent Capsule */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border-subtle bg-surface-card shadow-xs mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gdg-blue" />
            <span className="w-2.5 h-2.5 rounded-full bg-gdg-red" />
            <span className="w-2.5 h-2.5 rounded-full bg-gdg-yellow" />
            <span className="w-2.5 h-2.5 rounded-full bg-gdg-green" />
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-text-secondary">
            Official Community Hub
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-text-primary">
          CONNECT WITH US
        </h1>
      </div>

      {/* 6 Social Cards Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-20 lg:gap-y-24 pt-10 sm:pt-14">
        {socialChannels.map((channel) => {
          const Icon = channel.icon;
          const isCopied = copiedLink === channel.name;

          return (
            <div
              key={channel.name}
              className="group relative flex flex-col justify-between rounded-3xl border border-border-subtle bg-surface-card hover:border-border-strong hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-visible"
              style={{
                boxShadow: isDark
                  ? "0 10px 30px -10px rgba(0,0,0,0.5)"
                  : "0 10px 30px -10px rgba(0,0,0,0.06)"
              }}
            >
              {/* Top Accent Strip in Channel Color */}
              <div
                className="absolute top-0 left-6 right-6 h-1 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: channel.accentColor }}
              />

              {/* 3D Character Avatar (Uniform positioning across all cards) */}
              <div className="absolute -top-10 sm:-top-12 lg:-top-14 right-2 sm:right-3 lg:right-4 w-32 h-32 sm:w-36 sm:h-36 lg:w-[152px] lg:h-[152px] pointer-events-none select-none z-20">
                {/* Soft Ambient Spotlight behind Character */}
                <div
                  className="absolute -inset-1 rounded-full blur-2xl opacity-25 group-hover:opacity-55 transition-opacity"
                  style={{ backgroundColor: channel.accentColor }}
                />
                <div className="relative w-full h-full">
                  <Image
                    src={channel.characterImage}
                    alt={`${channel.name} Mascot Character`}
                    width={160}
                    height={160}
                    priority
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out group-hover:scale-108 group-hover:-translate-y-2"
                  />
                </div>
              </div>

              {/* Main Card Content */}
              <div className="p-6 sm:p-7 pt-7 relative z-10 flex flex-col flex-1">
                {/* Top Row: Icon on left, with guaranteed safe right margin to avoid character */}
                <div className="flex items-start justify-between mb-4 pr-32">
                  {/* Channel Icon Container */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: `${channel.accentColor}18`,
                      color: channel.accentColor
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Badge Pill: Placed below Icon with zero chance of character overlap */}
                <div className="mb-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase"
                    style={{
                      backgroundColor: `${channel.accentColor}15`,
                      color: channel.accentColor
                    }}
                  >
                    {channel.badge}
                  </span>
                </div>

                {/* Channel Title & Tagline */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-text-primary group-hover:text-primary transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary/80 mt-0.5">
                    {channel.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-secondary mt-3 leading-relaxed flex-1">
                  {channel.description}
                </p>
              </div>

              {/* Card Footer: Handle, Copy Link & External CTA Button */}
              <div className="px-6 sm:px-7 py-4 bg-surface-subtle/50 dark:bg-surface-subtle/30 border-t border-border-subtle rounded-b-3xl flex items-center justify-between gap-3 relative z-10">
                {/* Handle / Channel Reference */}
                <span className="text-xs font-semibold text-text-secondary truncate max-w-[130px] sm:max-w-[160px]">
                  {channel.handle}
                </span>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(channel.href, channel.name)}
                    aria-label={`Copy ${channel.name} link`}
                    title="Copy Link"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-page transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-gdg-green" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* External Visit Button */}
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-transform duration-200 hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                    style={{ backgroundColor: channel.accentColor }}
                  >
                    <span>{channel.ctaText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SocialSection;

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ArrowUpRight,
  Sparkles,
  History,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import eventsData from "@/data/events.json";
import chapterConfig from "@/data/chapter.json";
import { EventItem, ChapterConfig } from "@/types/schema";
import { FoldText } from "@/components/ui/fold-text";

type EventWithMeta = Partial<EventItem> & {
  id?: string;
  title?: string;
  description?: string;
  month?: string;
  day?: string;
  location?: string;
  seats?: string;
  rsvpUrl?: string;
  date?: string;
  displayDate?: string;
  time?: string;
  tag?: string;
  registrationType?: string;
  bannerStyle?: "featured" | "design" | "challenge" | "genai" | "techfest" | "techsprint";
  status?: "upcoming" | "past";
  recapUrl?: string;
};

type Tab = "upcoming" | "past";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const DIRECT_EVENT_RSVP_URL = "https://gdg.community.dev/e/mc349m/";
const OFFICIAL_BPPIMT_CHAPTER_URL =
  "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/";

const BANNER_THEMES = [
  { bg: "bg-[#8ab4f8]", accent: "#4285F4" },
  { bg: "bg-[#81c995]", accent: "#34A853" },
  { bg: "bg-[#f28b82]", accent: "#EA4335" },
  { bg: "bg-[#fdd663]", accent: "#FBBC05" },
];

// All 14 Past Events from GDG On Campus BPPIMT
const BPPIMT_PAST_EVENTS: EventWithMeta[] = [
  {
    id: "pixel-to-perfection-day-3",
    title: "Pixel to Perfection: Mastering Design with Adobe Photoshop",
    description:
      "Hands-on UI/UX and graphic design workshop series focused on mastering Adobe Photoshop tools, composition, and visual storytelling.",
    date: "2026-05-30",
    displayDate: "May 30, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "External registration",
    tag: "Design Workshop",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "pixel-to-perfection-day-2",
    title: "Pixel to Perfection: Mastering Design with Adobe Photoshop",
    description:
      "Intermediate Adobe Photoshop design session covering layer blending, typography hierarchy, and digital poster creation.",
    date: "2026-05-23",
    displayDate: "May 23, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "External registration",
    tag: "Design Workshop",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "pixel-to-perfection-day-1",
    title: "Pixel to Perfection: Mastering Design with Adobe Photoshop",
    description:
      "Kickoff session of Pixel to Perfection introducing students to creative workflows and visual design fundamentals with Adobe Photoshop.",
    date: "2026-05-16",
    displayDate: "May 16, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "External registration",
    tag: "Design Workshop",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "techsprint-wrapup-2026",
    title: "TechSprint Wrapup and Winner Declaration",
    description:
      "Celebrating top builders, project demos, and official winner announcements for the BPPIMT TechSprint hackathon series.",
    date: "2026-01-25",
    displayDate: "Jan 25, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "TechSprint Finale",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "techsprint-improvement-day-2026",
    title: "Techsprint Improvement Day: Level Up Your Skills!",
    description:
      "Mentorship and sprint refinement session helping student teams polish their prototypes, architecture, and pitch decks.",
    date: "2026-01-11",
    displayDate: "Jan 11, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Mentorship",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "techsprint-101-2026",
    title: "TechSprint 101: Introduction to Google Technologies",
    description:
      "Orientation and developer onboarding session exploring Google Cloud, Firebase, Gemini APIs, and modern full-stack workflows.",
    date: "2026-01-05",
    displayDate: "Jan 5, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "TechSprint 101",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "google-cloud-study-jams-wrapup-2025",
    title: "Google Cloud Study Jams Wrap Up",
    description:
      "Closing ceremony and milestone celebration for students completing Google Cloud Arcade and Generative AI labs.",
    date: "2025-11-19",
    displayDate: "Nov 19, 2025",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Cloud Study Jams",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "techstorm-2-25",
    title: "Techstorm 2.25",
    description:
      "Annual TechFest flagship collaboration featuring coding battles, technical challenges, robotics, and creative student competitions.",
    date: "2025-05-29",
    displayDate: "May 29, 2025",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Annual TechFest",
    bannerStyle: "techfest",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "pixel-to-prototype-figma-2025",
    title: "Pixel To Prototype - Workshop on Frontend Design using Figma",
    description:
      "Live interactive workshop on wireframing, design systems, and clickable prototyping using Figma for frontend developers.",
    date: "2025-02-22",
    displayDate: "Feb 22, 2025",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Figma Workshop",
    bannerStyle: "design",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "tech-winter-break-2024",
    title: "Tech Winter Break + B. P. Poddar Institute of Management and Technology",
    description:
      "Winter developer sprint and Solution Challenge ideation camp empowering students to build impactful community solutions.",
    date: "2024-12-30",
    displayDate: "Dec 30, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Solution Challenge",
    bannerStyle: "challenge",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "build-with-ai-genai-2024",
    title: "Build with AI",
    description:
      "GenAI Study Jams info session and hands-on lab introducing Gemini models, prompt engineering, and AI application development.",
    date: "2024-10-15",
    displayDate: "Oct 15, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "GenAI Study Jams",
    bannerStyle: "genai",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "smart-coder-2-24",
    title: "Smart Coder 2.24",
    description:
      "Inter-college competitive programming and algorithmic problem-solving contest hosted at C Block, BPPIMT Campus.",
    date: "2024-09-21",
    displayDate: "Sep 21, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Coding Competition",
    bannerStyle: "techfest",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "juno-2-24",
    title: "Juno 2.24",
    description:
      "Arduino programming and embedded systems inter-college competition organized in collaboration with TechForum Abhiyantran.",
    date: "2024-09-20",
    displayDate: "Sep 20, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Hardware & Arduino",
    bannerStyle: "techfest",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
  {
    id: "forma-2-24",
    title: "Forma 2.24",
    description:
      "Hardware model design and engineering showcase competition hosted at D Block, BPPIMT Campus.",
    date: "2024-09-20",
    displayDate: "Sep 20, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    registrationType: "Free registration",
    tag: "Hardware Design",
    bannerStyle: "techfest",
    status: "past",
    recapUrl: OFFICIAL_BPPIMT_CHAPTER_URL,
  },
];

function parseDate(date?: string): Date | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

function isPastEvent(event: EventWithMeta, now: Date): boolean {
  const d = parseDate(event.date);
  if (d) {
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() < now.getTime();
  }
  return event.status === "past";
}

/* Rich Custom Banner matching GDG Event Aesthetics */
function EventCardBanner({
  event,
  idx,
  isFeatured,
}: {
  event: EventWithMeta;
  idx: number;
  isFeatured: boolean;
}) {
  const theme = BANNER_THEMES[idx % BANNER_THEMES.length];
  const style = isFeatured ? "featured" : event.bannerStyle || "techsprint";

  return (
    <div className={`${theme.bg} p-3.5 sm:p-4 border-b border-black/80`}>
      {style === "techsprint" ? (
        /* Dark TechSprint Globe + GDG Bracket Style (matches 2nd & 3rd screenshots) */
        <div className="relative h-36 sm:h-40 w-full rounded-xl border border-black/80 bg-[#18191c] overflow-hidden flex flex-col items-center justify-between p-3.5 shadow-xs">
          {/* GDG Colored Bracket Logo */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 mt-1">
            <span className="inline-block w-6 h-2.5 rounded-full bg-[#EA4335] -rotate-35 translate-x-1" />
            <span className="inline-block w-6 h-2.5 rounded-full bg-[#34A853] rotate-35 -translate-x-1" />
          </div>
          <div className="relative z-10 flex items-center justify-center gap-1.5 -mt-1">
            <span className="inline-block w-6 h-2.5 rounded-full bg-[#4285F4] rotate-35 translate-x-1" />
            <span className="inline-block w-6 h-2.5 rounded-full bg-[#FBBC05] -rotate-35 -translate-x-1" />
          </div>

          <p className="relative z-10 text-[11px] font-bold text-white/95 tracking-tight text-center line-clamp-1 px-2">
            {event.tag || "GDG On Campus BPPIMT"}
          </p>

          {/* Blue Wireframe Globe Arc at Bottom */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 70"
            className="w-40 h-14 text-[#4285F4] opacity-90 -mb-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <ellipse cx="100" cy="65" rx="85" ry="52" />
            <ellipse cx="100" cy="65" rx="52" ry="52" />
            <ellipse cx="100" cy="65" rx="20" ry="52" />
            <path d="M22 45 Q100 32 178 45" />
          </svg>
        </div>
      ) : style === "techfest" ? (
        /* Vibrant TechFest / Competition Dark Neon Style */
        <div className="relative h-36 sm:h-40 w-full rounded-xl border border-black/80 bg-gradient-to-br from-[#120c24] via-[#1f1138] to-[#0d192e] overflow-hidden flex flex-col justify-between p-3.5 shadow-xs text-white">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-purple-300/90">
            <span>BPPIMT TechForum</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
              {event.tag || "Competition"}
            </span>
          </div>

          <div className="text-center my-auto px-1">
            <p className="font-heading text-base sm:text-lg font-black tracking-wide uppercase bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent line-clamp-2">
              {event.title}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            <span className="ml-1 font-medium">GDG On Campus Collaboration</span>
          </div>
        </div>
      ) : (
        /* Light GDG Framed Banner Style (Featured Build.Learn.Connect, GenAI, Solution Challenge, Figma) */
        <div className="relative h-36 sm:h-40 w-full rounded-xl border border-black/80 bg-white overflow-hidden flex flex-col justify-between p-3.5 shadow-xs">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -left-6 w-16 h-16 rounded-full bg-[#FBBC05]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#EA4335]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-2.5 flex items-center gap-1"
          >
            <span className="w-3 h-3 rounded-full bg-[#4285F4]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
          </div>

          {/* Top GDG Header */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 pt-0.5">
            <span className="font-mono text-sm font-black tracking-tighter">
              <span className="text-[#EA4335]">&lt;</span>
              <span className="text-[#4285F4]">/</span>
              <span className="text-[#34A853]">&gt;</span>
            </span>
            <div className="text-left leading-tight">
              <p className="text-[11px] font-bold text-gray-800">Google Developer Groups</p>
              <p className="text-[9px] font-semibold text-[#4285F4]">
                On Campus • <span className="text-gray-600">BPPIMT</span>
              </p>
            </div>
          </div>

          {/* Center Headline */}
          {isFeatured ? (
            <div className="relative z-10 text-center my-auto">
              <p className="text-[10px] font-medium italic text-gray-500 mb-0.5">Get ready to</p>
              <div className="flex items-center justify-center gap-1.5 font-heading text-base sm:text-lg font-black tracking-tight">
                <span className="text-[#4285F4]">BUILD.</span>
                <span className="text-[#EA4335]">LEARN.</span>
                <span className="text-[#34A853]">CONNECT.</span>
              </div>
            </div>
          ) : style === "genai" ? (
            <div className="relative z-10 text-center my-auto">
              <p className="font-heading text-lg font-extrabold bg-gradient-to-r from-[#4285F4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent">
                GenAI Study Jams
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#4285F4] text-white text-[9px] font-bold uppercase tracking-wider">
                Build with AI
              </span>
            </div>
          ) : (
            <div className="relative z-10 text-center my-auto px-2">
              <p className="text-[10px] font-medium italic text-gray-500 mb-0.5">
                {event.tag || "Workshop"}
              </p>
              <p className="font-heading text-sm sm:text-base font-extrabold text-gray-900 line-clamp-2 tracking-tight">
                {event.title}
              </p>
            </div>
          )}

          {/* Bottom Location Pill */}
          <div className="relative z-10 flex items-center justify-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
              <MapPin className="w-2.5 h-2.5 text-[#EA4335]" />
              {isFeatured ? "C BLOCK, BPPIMT" : "BPPIMT Campus"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* Blink / Pulse Placeholder Slot for Right-Side Empty Columns */
function BlankBlinkEventCard({ slotIndex }: { slotIndex: number }) {
  const bannerTint =
    slotIndex % 2 === 0
      ? "bg-[#81c995]/30 border-b border-dashed border-border-strong"
      : "bg-[#f28b82]/30 border-b border-dashed border-border-strong";

  return (
    <div className="flex flex-col rounded-2xl border-2 border-dashed border-border-strong bg-surface-subtle/40 overflow-hidden select-none">
      <div className={`${bannerTint} p-3.5 sm:p-4`}>
        <div className="h-36 sm:h-40 w-full rounded-xl border border-dashed border-border-strong bg-surface-card/70 flex flex-col items-center justify-center p-4 text-center animate-pulse">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]/70 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]/70" />
          </div>
          <p className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">
            Next Event Dropping Soon
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            Stay tuned for announcements
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 bg-surface-card/60 animate-pulse">
        <div className="space-y-2.5">
          <div className="h-4 w-3/4 rounded-md bg-surface-subtle" />
          <div className="h-3 w-full rounded-md bg-surface-subtle/80" />
          <div className="h-3 w-5/6 rounded-md bg-surface-subtle/80" />
          <div className="pt-2 flex items-center gap-2">
            <div className="h-3.5 w-24 rounded bg-surface-subtle" />
          </div>
        </div>

        <div className="mt-5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-border-strong bg-surface-subtle/60 text-text-tertiary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Coming Soon...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Events({ isCard = false }: { isCard?: boolean } = {}) {
  const allEvents = (eventsData as unknown as EventWithMeta[]) || [];
  const chapter = chapterConfig as ChapterConfig;
  const communityLink = chapter.communityUrl || OFFICIAL_BPPIMT_CHAPTER_URL;
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [showAllPast, setShowAllPast] = useState(false);

  const PINNED_EVENT: EventWithMeta = {
    id: "gdg-bppimt-mc349m",
    title: "GDG On Campus BPPIMT — Featured Workshop",
    tag: "RSVP Open",
    registrationType: "Free registration",
    bannerStyle: "featured",
    description:
      "A community is built by the people in it. Join Google Developer Groups on Campus BPPIMT at C Block for our upcoming session.",
    date: "2026-11-25",
    displayDate: "Nov 25, 2026",
    month: "NOV",
    day: "25",
    time: "4:00 – 5:00 PM (IST)",
    location: "C BLOCK, BPPIMT",
    seats: "Open Registration",
    rsvpUrl: DIRECT_EVENT_RSVP_URL,
    status: "upcoming",
  };

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const time = (e: EventWithMeta) => parseDate(e.date)?.getTime() ?? 0;

    const up: EventWithMeta[] = [];
    const pa: EventWithMeta[] = [];
    allEvents.forEach((e) => (isPastEvent(e, now) ? pa : up).push(e));

    // Merge hardcoded BPPIMT past events avoiding duplicates by title + date
    BPPIMT_PAST_EVENTS.forEach((pe) => {
      const exists = pa.some(
        (existing) =>
          existing.title?.toLowerCase() === pe.title?.toLowerCase() &&
          existing.date === pe.date
      );
      if (!exists) {
        pa.push(pe);
      }
    });

    up.sort((a, b) => time(a) - time(b));
    pa.sort((a, b) => time(b) - time(a));

    const alreadyExists = [...up, ...pa].some((e) => e.rsvpUrl === DIRECT_EVENT_RSVP_URL);
    if (!alreadyExists) {
      if (isPastEvent(PINNED_EVENT, now)) {
        pa.unshift(PINNED_EVENT);
      } else {
        up.unshift(PINNED_EVENT);
      }
    }

    return {
      upcoming: up,
      past: pa,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPastTab = activeTab === "past";
  const visibleEvents = useMemo(() => {
    if (!isPastTab) return upcoming;
    return showAllPast ? past : past.slice(0, 6);
  }, [isPastTab, upcoming, past, showAllPast]);

  // Fill right-side empty slots on Upcoming tab so 3-column grid stays balanced
  const blankSlotsCount = !isPastTab ? Math.max(0, 3 - visibleEvents.length) : 0;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past", count: past.length },
  ];

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-2 sm:gap-4">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Community Calendar
          </p>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1 sm:mt-1.5">
            <FoldText
              text="Events Hub"
              trigger="scroll"
              foldStyle="paper"
              hinge="top"
              hoverRefold={true}
              duration={0.65}
              stagger={0.04}
            />
          </h2>
          {!isCard && (
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
              Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus BPPIMT.
            </p>
          )}
        </div>

        <Link
          href={communityLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline transition-colors flex-shrink-0"
        >
          <span>View Official Chapter Page</span>
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <div
          role="tablist"
          aria-label="Event type"
          className="inline-flex p-1 rounded-full bg-surface-subtle border border-border-subtle"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>{tab.label} Events</span>
                <span
                  className={`text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-surface-card text-text-secondary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {isPastTab && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Award className="w-4 h-4 text-[#34A853]" />
            <span>{past.length} Completed Campus Events</span>
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* 3-Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleEvents.map((event, idx) => {
              const d = parseDate(event.date);
              const month = event.month || (d ? MONTHS[d.getMonth()] : undefined);
              const day = event.day || (d ? String(d.getDate()) : undefined);
              const formattedDate =
                event.displayDate ||
                event.date ||
                (month && day ? `${month} ${day}` : "Upcoming");
              const actionUrl = isPastTab
                ? event.recapUrl || communityLink
                : event.rsvpUrl || DIRECT_EVENT_RSVP_URL;
              const isFeatured = !isPastTab && idx === 0;

              return (
                <div
                  key={event.id || idx}
                  className="flex flex-col rounded-2xl border border-black/80 dark:border-border-strong bg-surface-subtle/70 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Top Colored Banner */}
                  <EventCardBanner
                    event={event}
                    idx={idx}
                    isFeatured={isFeatured}
                  />

                  {/* Bottom Content Body */}
                  <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 bg-surface-card">
                    <div>
                      {/* Date & Registration Type Pill */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formattedDate}
                        </span>
                        {event.registrationType && (
                          <span className="text-[11px] font-bold text-text-primary bg-surface-subtle px-2 py-0.5 rounded-md border border-border-subtle">
                            {event.registrationType}
                          </span>
                        )}
                      </div>

                      {event.title && (
                        <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {event.title}
                        </h3>
                      )}

                      {event.description && (
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Time or Chapter Location */}
                      <div className="mt-3 space-y-1">
                        {event.time ? (
                          <p className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                            <Clock className="w-3 h-3 text-text-tertiary" />
                            <span>{event.time}</span>
                          </p>
                        ) : (
                          event.location && (
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary">
                              <MapPin className="w-3 h-3 text-[#EA4335] flex-shrink-0" />
                              <span className="line-clamp-1">{event.location}</span>
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-5 pt-1">
                      <Link
                        href={actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                      >
                        <span>{isPastTab ? "View More" : "Register / RSVP"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Right-Side Blink / Blank Slots on Upcoming Tab */}
            {Array.from({ length: blankSlotsCount }).map((_, slotIdx) => (
              <BlankBlinkEventCard
                key={`blank-slot-${slotIdx}`}
                slotIndex={visibleEvents.length + slotIdx}
              />
            ))}
          </div>

          {/* Expand / Collapse Button for All 14 Past Events */}
          {isPastTab && past.length > 6 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllPast((prev) => !prev)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border-strong bg-surface-card hover:bg-surface-subtle text-text-primary text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                {showAllPast ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Show All {past.length} Past Events</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (isCard) {
    return <div className="p-4 sm:p-10">{content}</div>;
  }

  return (
    <section id="events" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}

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
  time?: string;
  tag?: string;
  image?: string;
  status?: "upcoming" | "past";
  recapUrl?: string;
};

type Tab = "upcoming" | "past";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const DIRECT_EVENT_RSVP_URL = "https://gdg.community.dev/e/mc349m/";

const BANNER_THEMES = [
  { bg: "bg-[#8ab4f8]", accent: "#4285F4" },
  { bg: "bg-[#81c995]", accent: "#34A853" },
  { bg: "bg-[#f28b82]", accent: "#EA4335" },
  { bg: "bg-[#fdd663]", accent: "#FBBC05" },
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

/* Inner Banner Card Artwork */
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

  return (
    <div className={`${theme.bg} p-3.5 sm:p-4 border-b border-black/80`}>
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

        {/* Center Banner Headline */}
        {isFeatured ? (
          <div className="relative z-10 text-center my-auto">
            <p className="text-[10px] font-medium italic text-gray-500 mb-0.5">Get ready to</p>
            <div className="flex items-center justify-center gap-1.5 font-heading text-base sm:text-lg font-black tracking-tight">
              <span className="text-[#4285F4]">BUILD.</span>
              <span className="text-[#EA4335]">LEARN.</span>
              <span className="text-[#34A853]">CONNECT.</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center my-auto px-2">
            <p className="text-[10px] font-medium italic text-gray-500 mb-0.5">
              {event.tag || "Community Session"}
            </p>
            <p className="font-heading text-sm sm:text-base font-extrabold text-gray-900 line-clamp-2 uppercase tracking-tight">
              {event.title}
            </p>
          </div>
        )}

        {/* Bottom Location Pill */}
        <div className="relative z-10 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
            <MapPin className="w-2.5 h-2.5 text-[#EA4335]" />
            {event.location || "BPPIMT Campus"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* Blink / Pulse Placeholder Slot for Empty Right-Side Grid Columns */
function BlankBlinkEventCard({
  slotIndex,
  isPastTab,
}: {
  slotIndex: number;
  isPastTab: boolean;
}) {
  const bannerTint =
    slotIndex % 2 === 0
      ? "bg-[#81c995]/30 border-b border-dashed border-border-strong"
      : "bg-[#f28b82]/30 border-b border-dashed border-border-strong";

  return (
    <div className="flex flex-col rounded-2xl border-2 border-dashed border-border-strong bg-surface-subtle/40 overflow-hidden select-none">
      {/* Top Tinted Blinking Banner Area */}
      <div className={`${bannerTint} p-3.5 sm:p-4`}>
        <div className="h-36 sm:h-40 w-full rounded-xl border border-dashed border-border-strong bg-surface-card/70 flex flex-col items-center justify-center p-4 text-center animate-pulse">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]/70 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]/70" />
          </div>
          <p className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">
            {isPastTab ? "Archive Slot" : "Next Event Dropping Soon"}
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            {isPastTab ? "Recaps will appear here" : "Stay tuned for announcements"}
          </p>
        </div>
      </div>

      {/* Bottom Skeleton / Blink Body */}
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
            {isPastTab ? (
              <>
                <History className="w-3.5 h-3.5" />
                <span>Upcoming Recap</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Coming Soon...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Events({ isCard = false }: { isCard?: boolean } = {}) {
  const allEvents = (eventsData as unknown as EventWithMeta[]) || [];
  const chapter = chapterConfig as ChapterConfig;
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const PINNED_EVENT: EventWithMeta = {
    id: "gdg-bppimt-mc349m",
    title: "GDG On Campus BPPIMT — Featured Workshop",
    tag: "RSVP Open",
    description:
      "A community is built by the people in it. Join Google Developer Groups on Campus BPPIMT at C Block for our upcoming session.",
    date: "2026-11-25",
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

  const visibleEvents = activeTab === "upcoming" ? upcoming : past;
  const isPastTab = activeTab === "past";

  // Always fill up to 3 columns so right-side empty slots show blink/blank cards
  const blankSlotsCount = Math.max(0, 3 - visibleEvents.length);

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

        {chapter.communityUrl && (
          <Link
            href={chapter.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline transition-colors flex-shrink-0"
          >
            <span>View Official Chapter Page</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Event type"
        className="inline-flex p-1 mb-6 sm:mb-8 rounded-full bg-surface-subtle border border-border-subtle"
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
                  ? "bg-primary text-white"
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* 3-Column Grid with Event Cards + Right-Side Blink/Blank Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleEvents.map((event, idx) => {
              const d = parseDate(event.date);
              const month = event.month || (d ? MONTHS[d.getMonth()] : undefined);
              const day = event.day || (d ? String(d.getDate()) : undefined);
              const formattedDate =
                event.date || (month && day ? `${month} ${day}` : "Upcoming");
              const actionUrl = isPastTab
                ? event.recapUrl || chapter.communityUrl || DIRECT_EVENT_RSVP_URL
                : event.rsvpUrl || DIRECT_EVENT_RSVP_URL;
              const isFeatured = !isPastTab && idx === 0;

              return (
                <div
                  key={event.id || idx}
                  className="flex flex-col rounded-2xl border border-black/80 dark:border-border-strong bg-surface-subtle/70 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Top Colored Header Banner with Inner Framed Card */}
                  <EventCardBanner
                    event={event}
                    idx={idx}
                    isFeatured={isFeatured}
                  />

                  {/* Bottom Content Body */}
                  <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 bg-surface-card">
                    <div>
                      {event.title && (
                        <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                      )}

                      {event.description && (
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Date & Time Row */}
                      <div className="mt-3 space-y-1">
                        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-text-primary">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{formattedDate}</span>
                        </p>
                        {event.time && (
                          <p className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                            <Clock className="w-3 h-3 text-text-tertiary" />
                            <span>{event.time}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Blue Button */}
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

            {/* Right-Side Blink / Blank Placeholder Cards for both Upcoming & Past tabs */}
            {Array.from({ length: blankSlotsCount }).map((_, slotIdx) => (
              <BlankBlinkEventCard
                key={`blank-slot-${activeTab}-${slotIdx}`}
                slotIndex={visibleEvents.length + slotIdx}
                isPastTab={isPastTab}
              />
            ))}
          </div>
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

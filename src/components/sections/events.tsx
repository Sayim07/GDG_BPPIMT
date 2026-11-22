"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  ArrowUpRight,
  Sparkles,
  Bell,
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
  status?: "upcoming" | "past";
  recapUrl?: string;
};

type Tab = "upcoming" | "past";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const DIRECT_EVENT_RSVP_URL = "https://gdg.community.dev/e/mc349m/";

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

/* GDG Puzzle & Build. Learn. Connect. Decorative Visual for Featured Card */
function GdgCommunityArtwork() {
  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-border-subtle bg-surface-page/90 backdrop-blur-xs p-3.5 sm:p-4 overflow-hidden select-none">
      {/* Floating SVG Puzzle Pieces in Background */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className="pointer-events-none absolute -right-4 -top-4 w-24 h-24 opacity-20"
      >
        <path
          d="M20 20h30a8 8 0 0 1 16 0h30v30a8 8 0 0 1 0 16v30H66a8 8 0 0 1-16 0H20V66a8 8 0 0 1 0-16V20z"
          fill="#4285F4"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute right-14 -bottom-5 w-16 h-16 opacity-20 rotate-12"
      >
        <rect x="15" y="15" width="70" height="70" rx="14" fill="#34A853" />
      </svg>

      {/* Top GDG Bracket + Motto */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center font-mono text-xs font-extrabold tracking-tighter">
            <span className="text-[#EA4335]">&lt;</span>
            <span className="text-[#4285F4]">/</span>
            <span className="text-[#34A853]">&gt;</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
            GDG On Campus
          </span>
        </div>

        {/* 4-Color Google Dots */}
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
          <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
          <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
          <span className="w-2 h-2 rounded-full bg-[#34A853]" />
        </div>
      </div>

      {/* Poster Typography: BUILD. LEARN. CONNECT. */}
      <div className="relative z-10 leading-none space-y-0.5 my-1">
        <div className="font-heading text-base sm:text-lg font-black tracking-tight text-[#4285F4]">
          BUILD.
        </div>
        <div className="font-heading text-base sm:text-lg font-black tracking-tight text-[#EA4335]">
          LEARN.
        </div>
        <div className="font-heading text-base sm:text-lg font-black tracking-tight text-[#34A853]">
          CONNECT.
        </div>
      </div>

      {/* Bottom Tagline + Puzzle Blocks */}
      <div className="relative z-10 mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold tracking-wide text-text-secondary uppercase">
          Built by the{" "}
          <span className="font-bold">
            <span className="text-[#4285F4]">P</span>
            <span className="text-[#EA4335]">E</span>
            <span className="text-[#FBBC05]">O</span>
            <span className="text-[#34A853]">P</span>
            <span className="text-[#4285F4]">L</span>
            <span className="text-[#EA4335]">E</span>
          </span>
        </p>

        {/* Mini Puzzle Grid */}
        <div className="grid grid-cols-2 gap-1">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#4285F4]" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#EA4335]" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#34A853]" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#FBBC05]" />
        </div>
      </div>
    </div>
  );
}

export function Events({ isCard = false }: { isCard?: boolean } = {}) {
  const allEvents = (eventsData as unknown as EventWithMeta[]) || [];
  const chapter = chapterConfig as ChapterConfig;
  const communityLink = chapter.communityUrl || DIRECT_EVENT_RSVP_URL;
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const PINNED_EVENT: EventWithMeta = {
    id: "gdg-bppimt-mc349m",
    title: "GDG On Campus BPPIMT — Featured Event & Workshop",
    tag: "Build • Learn • Connect",
    description:
      "A community is built by the people in it. Join Google Developer Groups on Campus BPPIMT at C Block and click Register / RSVP to secure your spot directly.",
    date: "2026-11-25",
    month: "NOV",
    day: "25",
    time: "4:00 – 5:00 PM (IST)",
    location: "C BLOCK, BPPIMT Campus",
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
        className="inline-flex p-1 mb-5 sm:mb-8 rounded-full bg-surface-subtle border border-border-subtle"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {visibleEvents.length === 0 ? (
            /* Empty State */
            <div className="w-full bg-surface-card border border-border-subtle rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center">
              <div className="max-w-xl mx-auto flex flex-col items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-subtle text-primary flex items-center justify-center mb-3 sm:mb-4">
                  {isPastTab ? (
                    <History className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>

                <h3 className="font-heading text-lg sm:text-2xl font-bold text-text-primary tracking-tight">
                  {isPastTab
                    ? "Our story is just getting started."
                    : "Something exciting is brewing in the lab."}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary mt-2 sm:mt-2.5 leading-relaxed">
                  {isPastTab
                    ? "Once we wrap up our upcoming workshops, recaps, photos, and highlights will appear here."
                    : "We’re curating hands-on workshops, cloud study jams, and hackathon prep for this semester. The lineup will drop right here soon — don’t miss the announcements!"}
                </p>

                {!isPastTab && (
                  <div className="mt-5 sm:mt-6">
                    <Link
                      href={DIRECT_EVENT_RSVP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-hover transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Register / RSVP Now</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleEvents.map((event, idx) => {
                const d = parseDate(event.date);
                const month = event.month || (d ? MONTHS[d.getMonth()] : undefined);
                const day = event.day || (d ? String(d.getDate()) : undefined);
                const rsvpLink = event.rsvpUrl || DIRECT_EVENT_RSVP_URL;
                const isFeatured = !isPastTab && idx === 0;

                return (
                  <div
                    key={event.id || idx}
                    className={`relative overflow-hidden bg-surface-card border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group ${
                      isFeatured
                        ? "border-primary/40 shadow-sm hover:shadow-md"
                        : "border-border-subtle hover:border-border-strong"
                    } ${isPastTab ? "opacity-90" : ""}`}
                  >
                    {/* Subtle GDG 4-Color Top Bar & Background Puzzle Glow on Featured Card */}
                    {isFeatured && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(#4285F4_1.5px,transparent_1.5px)] [background-size:18px_18px]"
                        />
                      </>
                    )}

                    {/* Left Side: Date Badge + Event Details */}
                    <div className="relative z-10 flex items-start sm:items-center gap-3.5 sm:gap-5 flex-1">
                      {/* Date Badge */}
                      {month && day && (
                        <div className="flex-shrink-0 w-14 sm:w-18 rounded-xl overflow-hidden border border-border-subtle bg-surface-page text-center shadow-xs">
                          <div
                            className={`py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold tracking-wider text-white ${
                              isPastTab
                                ? "bg-text-tertiary"
                                : idx % 2 === 0
                                ? "bg-gdg-blue"
                                : "bg-gdg-green"
                            }`}
                          >
                            {month}
                          </div>
                          <div className="font-heading py-1 sm:py-1.5 text-lg sm:text-2xl font-extrabold text-text-primary">
                            {day}
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {!isPastTab && event.tag && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gdg-blue/10 text-gdg-blue text-[11px] sm:text-xs font-semibold">
                              <Calendar className="w-3 h-3" />
                              {event.tag}
                            </span>
                          )}
                          {isPastTab && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-subtle text-text-secondary text-[11px] sm:text-xs font-semibold">
                              <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              Completed
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-[11px] sm:text-xs font-medium">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#EA4335]" />
                              {event.location}
                            </span>
                          )}
                          {event.time && (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-[11px] sm:text-xs font-medium before:content-['•'] before:mr-2 before:text-text-tertiary">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FBBC05]" />
                              {event.time}
                            </span>
                          )}
                          {!isPastTab && event.seats && (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-[11px] sm:text-xs font-medium before:content-['•'] before:mr-2 before:text-text-tertiary">
                              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#34A853]" />
                              {event.seats}
                            </span>
                          )}
                        </div>

                        {event.title && (
                          <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                            <Link
                              href={rsvpLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {event.title}
                            </Link>
                          </h3>
                        )}
                        {event.description && (
                          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl leading-snug sm:leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Side: GDG Build.Learn.Connect Visual Card + Direct RSVP Button */}
                    <div className="relative z-10 flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 flex-shrink-0">
                      {isFeatured && (
                        <div className="w-full sm:w-52">
                          <GdgCommunityArtwork />
                        </div>
                      )}

                      {!isPastTab && (
                        <div className="flex flex-col items-stretch sm:items-end justify-center gap-1.5">
                          <Link
                            href={rsvpLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group/btn"
                          >
                            <span>Register / RSVP</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </Link>
                          <span className="text-[10px] text-text-tertiary text-center sm:text-right">
                            Your journey starts here →
                          </span>
                        </div>
                      )}

                      {isPastTab && event.recapUrl && (
                        <Link
                          href={event.recapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-border-subtle text-text-primary hover:bg-surface-subtle text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <span>View Recap</span>
                          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
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

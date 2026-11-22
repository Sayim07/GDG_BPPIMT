"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  ArrowUpRight,
  Calendar,
  Clock,
  Sparkles,
  History,
  ExternalLink,
} from "lucide-react";
import eventsData from "@/data/events.json";
import chapterConfig from "@/data/chapter.json";
import { EventItem, ChapterConfig } from "@/types/schema";
import { FoldText } from "@/components/ui/fold-text";

type EventWithMeta = EventItem & {
  date?: string;
  time?: string;
  tag?: string;
  status?: "upcoming" | "past";
  recapUrl?: string;
};

type Tab = "upcoming" | "past";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const OFFICIAL_CHAPTER_URL = "https://gdg.community.dev/gdg-on-campus-spcmht-kolkata-india/";

// Default upcoming event card with GDG On Campus SPCMHT styling & RSVP hyperlink
const DEFAULT_UPCOMING_EVENTS: EventWithMeta[] = [
  {
    id: "android-study-jam-spcmht",
    title: "Android Study Jam: Build your first app",
    tag: "Study Jam",
    description:
      "Join Google Developer Groups on Campus SPCMHT for an interactive, hands-on session on Kotlin and Jetpack Compose. Learn modern Android architecture and build your first app from scratch.",
    month: "OCT",
    day: "24",
    time: "2:00 PM – 5:00 PM IST",
    location: "SPCMHT Auditorium",
    seats: "Limited Seats Available",
    rsvpUrl: OFFICIAL_CHAPTER_URL,
    status: "upcoming",
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

export function Events({ isCard = false }: { isCard?: boolean } = {}) {
  const allEvents = (eventsData as EventWithMeta[]) || [];
  const chapter = chapterConfig as ChapterConfig;
  const chapterLink = chapter.communityUrl || OFFICIAL_CHAPTER_URL;
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const time = (e: EventWithMeta) => parseDate(e.date)?.getTime() ?? 0;

    const up: EventWithMeta[] = [];
    const pa: EventWithMeta[] = [];
    allEvents.forEach((e) => (isPastEvent(e, now) ? pa : up).push(e));

    up.sort((a, b) => time(a) - time(b));
    pa.sort((a, b) => time(b) - time(a));

    return {
      upcoming: up.length > 0 ? up : DEFAULT_UPCOMING_EVENTS,
      past: pa,
    };
  }, [allEvents]);

  const visibleEvents = activeTab === "upcoming" ? upcoming : past;
  const isPastTab = activeTab === "past";

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past", count: past.length },
  ];

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            GDG On Campus • SPCMHT
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1">
            <FoldText
              text="Upcoming Events"
              trigger="scroll"
              foldStyle="paper"
              hinge="top"
              hoverRefold={true}
              duration={0.65}
              stagger={0.04}
            />
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">
            Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus SPCMHT.
          </p>
        </div>

        <Link
          href={chapterLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline transition-colors flex-shrink-0"
        >
          <span>Official GDG Chapter Portal</span>
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
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
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-white shadow-sm"
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {visibleEvents.length === 0 ? (
            /* Empty State */
            <div className="w-full bg-surface-card border border-border-subtle rounded-2xl p-8 sm:p-12 text-center">
              <div className="max-w-xl mx-auto flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-surface-subtle text-primary flex items-center justify-center mb-4">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-text-primary tracking-tight">
                  Our story is just getting started.
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                  Once we wrap up our upcoming workshops, recaps, photos, and highlights will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {visibleEvents.map((event, idx) => {
                const d = parseDate(event.date);
                const month = event.month || (d ? MONTHS[d.getMonth()] : undefined);
                const day = event.day || (d ? String(d.getDate()) : undefined);
                const registrationHref = event.rsvpUrl || chapterLink;

                return (
                  <div
                    key={event.id || idx}
                    className={`relative overflow-hidden bg-surface-card border border-border-subtle hover:border-primary/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 group ${
                      isPastTab ? "opacity-90" : ""
                    }`}
                  >
                    {/* Subtle GDG Top Accent Bar */}
                    {!isPastTab && (
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 ${
                          idx % 2 === 0
                            ? "bg-gradient-to-r from-gdg-blue via-gdg-green to-gdg-yellow"
                            : "bg-gradient-to-r from-gdg-green via-gdg-blue to-gdg-red"
                        }`}
                      />
                    )}

                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                      {/* Date Badge */}
                      {month && day && (
                        <div className="flex-shrink-0 w-16 sm:w-20 rounded-xl overflow-hidden border border-border-subtle bg-surface-page text-center shadow-xs group-hover:scale-105 transition-transform">
                          <div
                            className={`py-1 text-[10px] sm:text-xs font-bold tracking-wider text-white uppercase ${
                              isPastTab
                                ? "bg-text-tertiary"
                                : idx % 2 === 0
                                ? "bg-gdg-blue"
                                : "bg-gdg-green"
                            }`}
                          >
                            {month}
                          </div>
                          <div className="font-heading py-2 text-xl sm:text-2xl font-extrabold text-text-primary">
                            {day}
                          </div>
                        </div>
                      )}

                      {/* Event Info */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          {!isPastTab && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gdg-blue/10 text-gdg-blue text-[11px] sm:text-xs font-semibold">
                              <Calendar className="w-3 h-3" />
                              {event.tag || "Workshop"}
                            </span>
                          )}
                          {isPastTab && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface-subtle border border-border-subtle text-text-secondary text-[11px] sm:text-xs font-semibold">
                              <History className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-[11px] sm:text-xs font-medium">
                              <MapPin className="w-3.5 h-3.5 text-gdg-red" />
                              {event.location}
                            </span>
                          )}
                          {event.time && (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-[11px] sm:text-xs font-medium">
                              <Clock className="w-3.5 h-3.5 text-gdg-yellow" />
                              {event.time}
                            </span>
                          )}
                          {!isPastTab && event.seats && (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-[11px] sm:text-xs font-medium">
                              <Users className="w-3.5 h-3.5 text-gdg-green" />
                              {event.seats}
                            </span>
                          )}
                        </div>

                        {event.title && (
                          <h3 className="font-heading text-base sm:text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                            <Link
                              href={registrationHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {event.title}
                            </Link>
                          </h3>
                        )}
                        {event.description && (
                          <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RSVP / Recap Hyperlink Button */}
                    {!isPastTab && (
                      <div className="flex-shrink-0 flex flex-col items-stretch md:items-end gap-1.5">
                        <Link
                          href={registrationHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group/btn"
                        >
                          <span>Register / RSVP</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                        <span className="text-[10px] sm:text-[11px] text-text-tertiary text-center md:text-right">
                          Opens GDG Community RSVP
                        </span>
                      </div>
                    )}

                    {isPastTab && event.recapUrl && (
                      <div className="flex-shrink-0 flex items-center md:justify-end">
                        <Link
                          href={event.recapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto px-5 py-2.5 rounded-full border border-border-subtle text-text-primary hover:bg-surface-subtle text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <span>View Event Recap</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
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

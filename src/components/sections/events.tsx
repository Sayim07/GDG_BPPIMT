"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, ArrowUpRight, Sparkles, Bell, History } from "lucide-react";
import eventsData from "@/data/events.json";
import chapterConfig from "@/data/chapter.json";
import { EventItem, ChapterConfig } from "@/types/schema";

/**
 * Extra optional fields used to split events into Upcoming / Past.
 * Add these to EventItem in "@/types/schema" when convenient.
 *
 *  - date:      ISO date, e.g. "2026-11-15" (recommended; auto-sorts events)
 *  - status:    "upcoming" | "past" (fallback when no date is given)
 *  - recapUrl:  optional link shown on past events
 */
type EventWithMeta = EventItem & {
  date?: string;
  status?: "upcoming" | "past";
  recapUrl?: string;
};

type Tab = "upcoming" | "past";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function parseDate(date?: string): Date | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

function isPastEvent(event: EventWithMeta, now: Date): boolean {
  const d = parseDate(event.date);
  if (d) {
    // An event stays "upcoming" until the end of its day
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() < now.getTime();
  }
  return event.status === "past";
}

export function Events() {
  const allEvents = (eventsData as EventWithMeta[]) || [];
  const chapter = chapterConfig as ChapterConfig;
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const time = (e: EventWithMeta) => parseDate(e.date)?.getTime() ?? 0;

    const up: EventWithMeta[] = [];
    const pa: EventWithMeta[] = [];
    allEvents.forEach((e) => (isPastEvent(e, now) ? pa : up).push(e));

    up.sort((a, b) => time(a) - time(b)); // soonest first
    pa.sort((a, b) => time(b) - time(a)); // most recent first
    return { upcoming: up, past: pa };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleEvents = activeTab === "upcoming" ? upcoming : past;
  const isPastTab = activeTab === "past";

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past", count: past.length },
  ];

  return (
    <section id="events" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Calendar
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1">
              Events
            </h2>
          </div>
          {chapter.communityUrl && (
            <Link
              href={chapter.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              <span>View Official Chapter Page</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Event type"
          className="inline-flex p-1 mb-10 rounded-full bg-surface-subtle border border-border-subtle"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${active
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                <span>{tab.label} Events</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-surface-card text-text-secondary"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {visibleEvents.length === 0 ? (
              /* Empty State */
              <div className="w-full bg-surface-card border border-border-subtle rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-gdg-blue to-transparent" />

                <div className="max-w-xl mx-auto flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-gdg-blue flex items-center justify-center mb-5 shadow-sm">
                    {isPastTab ? <History className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
                  </div>

                  <span className="inline-block px-3.5 py-1 rounded-full bg-surface-subtle border border-border-subtle text-xs font-medium text-text-secondary mb-3">
                    {isPastTab ? "No Past Events Yet" : "Events Loading..."}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                    {isPastTab
                      ? "Our story is just getting started."
                      : "Something exciting is brewing in the lab."}
                  </h3>

                  <p className="text-sm sm:text-base text-text-secondary mt-3 leading-relaxed">
                    {isPastTab
                      ? "Once we wrap up our first events, recaps and highlights will show up here."
                      : "We’re curating hands-on workshops, cloud study jams, and hackathon prep for this semester. The lineup will drop right here soon — don’t miss the announcements!"}
                  </p>

                  {!isPastTab && chapter.communityUrl && (
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                      <Link
                        href={chapter.communityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Get Official Updates</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {visibleEvents.map((event, idx) => {
                  const d = parseDate(event.date);
                  const month = event.month || (d ? MONTHS[d.getMonth()] : undefined);
                  const day = event.day || (d ? String(d.getDate()) : undefined);

                  return (
                    <motion.div
                      key={event.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className={`bg-surface-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group ${isPastTab ? "opacity-90" : ""
                        }`}
                    >
                      <div className="flex items-start sm:items-center gap-6">
                        {/* Date Badge */}
                        {month && day && (
                          <div className="flex-shrink-0 w-20 rounded-xl overflow-hidden border border-border-subtle bg-surface-page text-center shadow-sm">
                            <div
                              className={`py-1 text-xs font-semibold tracking-wider text-white ${isPastTab
                                  ? "bg-gray-400 dark:bg-gray-600"
                                  : idx % 2 === 0
                                    ? "bg-gdg-blue"
                                    : "bg-gdg-green"
                                }`}
                            >
                              {month}
                            </div>
                            <div className="py-2.5 text-2xl font-bold text-text-primary">
                              {day}
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {isPastTab && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-text-secondary text-xs font-medium">
                                <History className="w-3.5 h-3.5" />
                                Completed
                              </span>
                            )}
                            {event.location && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-gdg-blue text-xs font-medium">
                                <MapPin className="w-3.5 h-3.5" />
                                {event.location}
                              </span>
                            )}
                            {!isPastTab && event.seats && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-subtle text-text-secondary text-xs font-medium">
                                <Users className="w-3.5 h-3.5" />
                                {event.seats}
                              </span>
                            )}
                          </div>

                          {event.title && (
                            <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                          )}
                          {event.description && (
                            <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isPastTab && event.rsvpUrl && (
                        <div className="flex-shrink-0 flex items-center md:justify-end">
                          <Link
                            href={event.rsvpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                          >
                            <span>RSVP Now</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                      {isPastTab && event.recapUrl && (
                        <div className="flex-shrink-0 flex items-center md:justify-end">
                          <Link
                            href={event.recapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-6 py-2.5 rounded-full border border-border-strong text-text-primary hover:bg-surface-subtle text-sm font-medium transition-all flex items-center justify-center gap-2"
                          >
                            <span>View Recap</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Building,
  Tag,
  AlertCircle,
  FileText,
  ListChecks,
} from "lucide-react";
import { DetailedEvent, DIRECT_EVENT_RSVP_URL } from "@/data/all-events";
import { EventCardBanner } from "@/components/sections/events";
import { GridBackground } from "@/components/ui/grid-background";

interface EventDetailViewProps {
  event: DetailedEvent;
}

type TabKey = "about" | "highlights" | "prerequisites" | "venue";

export function EventDetailView({ event }: EventDetailViewProps) {
  const isPast = event.status === "past";
  const actionUrl = isPast
    ? event.recapUrl || DIRECT_EVENT_RSVP_URL
    : event.rsvpUrl || DIRECT_EVENT_RSVP_URL;

  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const tabs: { key: TabKey; label: string; icon: React.ElementType; available: boolean }[] = [
    {
      key: "about",
      label: "About Event",
      icon: FileText,
      available: true,
    },
    {
      key: "highlights",
      label: "Highlights & Agenda",
      icon: ListChecks,
      available: Boolean(event.highlights && event.highlights.length > 0),
    },
    {
      key: "prerequisites",
      label: "Prerequisites",
      icon: AlertCircle,
      available: Boolean(event.prerequisites && event.prerequisites.length > 0),
    },
    {
      key: "venue",
      label: "Venue & Location",
      icon: Building,
      available: true,
    },
  ];

  const visibleTabs = tabs.filter((t) => t.available);

  return (
    <main className="relative w-full min-h-screen py-8 sm:py-14 bg-[#FDF2F2] dark:bg-[#160c0c] text-slate-900 dark:text-zinc-100 transition-colors overflow-hidden">
      {/* Retro Reddish Technical Graph-Paper Grid Background */}
      <GridBackground variant="retro-red" />

      {/* Main Container - Full-Page Width with Retro Neo-Brutalist Layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Top Editorial Header */}
        <header className="space-y-4">
          {/* Retro Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {event.tag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-black uppercase bg-[#FFE600] text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
                <Tag className="w-3.5 h-3.5" />
                <span>{event.tag}</span>
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-black uppercase border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] ${
                isPast
                  ? "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
                  : "bg-[#34A853] text-white"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isPast ? "bg-zinc-400" : "bg-white animate-pulse"
                }`}
              />
              <span>{isPast ? "Concluded Event" : "Upcoming Event"}</span>
            </span>
            {event.registrationType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-[#E8F0FE] dark:bg-blue-950 text-[#1967D2] dark:text-blue-300 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
                {event.registrationType}
              </span>
            )}
          </div>

          {/* Event Title */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-black dark:text-white tracking-tight leading-[1.12]">
            {event.title}
          </h1>

          {/* Short Intro */}
          <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 font-medium max-w-3xl leading-relaxed">
            {event.shortDescription}
          </p>
        </header>

        {/* Wide Event Banner Graphic */}
        <div className="w-full rounded-2xl sm:rounded-3xl border-2 border-black dark:border-white/80 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.7)] overflow-hidden">
          <EventCardBanner
            event={event}
            idx={0}
            isFeatured={!isPast}
            size="lg"
          />
        </div>

        {/* Retro Info Stamp Tickets (Date, Time, Location) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-xl border-2 border-black dark:border-white/80 bg-white dark:bg-zinc-900 shadow-[3.5px_3.5px_0px_0px_#000] dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,0.7)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#4285F4]/15 border-2 border-black flex items-center justify-center text-[#1967D2] flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Event Date
              </p>
              <p className="text-sm sm:text-base font-bold text-black dark:text-white mt-0.5">
                {event.displayDate || event.date}
              </p>
            </div>
          </div>

          {event.time && (
            <div className="p-4 rounded-xl border-2 border-black dark:border-white/80 bg-white dark:bg-zinc-900 shadow-[3.5px_3.5px_0px_0px_#000] dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,0.7)] flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#FBBC04]/20 border-2 border-black flex items-center justify-center text-[#b06000] flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Session Time
                </p>
                <p className="text-sm sm:text-base font-bold text-black dark:text-white mt-0.5">
                  {event.time}
                </p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl border-2 border-black dark:border-white/80 bg-white dark:bg-zinc-900 shadow-[3.5px_3.5px_0px_0px_#000] dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,0.7)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#EA4335]/15 border-2 border-black flex items-center justify-center text-[#EA4335] flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Campus Location
              </p>
              <p className="text-sm sm:text-base font-bold text-black dark:text-white mt-0.5 line-clamp-1">
                {event.location}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Tabbed Navigation Controls */}
        <section className="space-y-4 pt-2">
          {/* Tab Options Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {visibleTabs.map((tab) => {
              const active = activeTab === tab.key;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black font-mono font-black text-xs sm:text-sm uppercase tracking-wide transition-all cursor-pointer ${
                    active
                      ? "bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                      : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black inline-block ml-0.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Area */}
          <div className="rounded-2xl border-2 border-black dark:border-white/80 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] p-6 sm:p-8 min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#4285F4] text-white border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      OVERVIEW
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4285F4]" />
                      <span>About this event</span>
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm md:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {event.fullDescription && event.fullDescription.length > 0 ? (
                      event.fullDescription.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{event.shortDescription}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "highlights" && (
                <motion.div
                  key="highlights"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#34A853] text-white border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      TAKEAWAYS
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
                      <span>Key Highlights & Agenda</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {event.highlights?.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-3.5 sm:p-4 rounded-xl border-2 border-black dark:border-white/70 bg-[#FFFDF9] dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.6)] flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#34A853] mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm md:text-base text-black dark:text-zinc-100 font-semibold leading-snug">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "prerequisites" && (
                <motion.div
                  key="prerequisites"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#FBBC05] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      GUIDELINES
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#FBBC05]" />
                      <span>Prerequisites & Requirements</span>
                    </h3>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl border-2 border-black bg-[#FEF3C7] dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-[3px_3px_0px_0px_#000] space-y-2.5">
                    <p className="font-mono font-bold text-xs sm:text-sm uppercase">
                      Please check the following prior to attending:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm font-medium pl-1 leading-relaxed">
                      {event.prerequisites?.map((req, rIdx) => (
                        <li key={rIdx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === "venue" && (
                <motion.div
                  key="venue"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#EA4335] text-white border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                      CAMPUS
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#EA4335]" />
                      <span>Venue & Campus Details</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border-2 border-black dark:border-white/70 bg-[#FFFDF9] dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.6)] flex items-start gap-3">
                      <Building className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Specific Hall / Room
                        </p>
                        <p className="text-sm sm:text-base font-bold text-black dark:text-white mt-0.5">
                          {event.venue || event.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-black dark:border-white/70 bg-[#FFFDF9] dark:bg-zinc-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.6)] flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#EA4335] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Institution
                        </p>
                        <p className="text-sm font-bold text-black dark:text-white mt-0.5">
                          B.P. Poddar Institute of Management and Technology
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          137, V.I.P. Road, Poddar Vihar, Kolkata, West Bengal 700052
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Bottom RSVP Action Box */}
        <div className="pt-2">
          <div className="p-5 sm:p-8 rounded-2xl border-[2.5px] border-black dark:border-white/90 bg-[#E8F0FE] dark:bg-[#1a2538] shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.85)] flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#FFE600] text-black border-[1.5px] border-black shadow-[1.5px_1.5px_0px_0px_#000] mb-2">
                {isPast ? "ARCHIVE STATUS: CONCLUDED" : "STATUS: ACTION REQUIRED"}
              </div>
              <h3 className="font-heading text-lg sm:text-2xl font-black text-black dark:text-white uppercase tracking-tight">
                {isPast ? "Official Event Recap & Details" : "Secure Your Seat Today"}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium mt-1">
                {isPast
                  ? "Explore the official session recap, highlights, and resources on the GDG Community platform."
                  : "Direct RSVP on the official Google Developer Groups Community platform."}
              </p>
            </div>

            <div className="w-full sm:w-auto flex-shrink-0">
              <Link
                href={actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl border-[2.5px] border-black bg-[#4285F4] hover:bg-[#3367D6] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              >
                <span>{isPast ? "View Official Recap" : "Register / RSVP Now"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Sparkles,
  Calendar,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { FoldText } from "@/components/ui/fold-text";
import {
  ALL_EVENTS,
  DetailedEvent,
  getUpcomingEvents,
  getPastEvents,
} from "@/data/all-events";

type Tab = "upcoming" | "past";

export const BANNER_THEMES = [
  { bg: "bg-[#8ab4f8]", accent: "#4285F4" },
  { bg: "bg-[#81c995]", accent: "#34A853" },
  { bg: "bg-[#f28b82]", accent: "#EA4335" },
  { bg: "bg-[#fdd663]", accent: "#FBBC05" },
];

/* Rich Custom Banner matching GDG Event Aesthetics */
export function EventCardBanner({
  event,
  idx = 0,
  isFeatured = false,
  className = "",
  size = "sm",
}: {
  event: Partial<DetailedEvent>;
  idx?: number;
  isFeatured?: boolean;
  className?: string;
  size?: "sm" | "lg";
}) {
  const theme = BANNER_THEMES[idx % BANNER_THEMES.length];
  const style = isFeatured ? "featured" : event.bannerStyle || "techsprint";
  const isLarge = size === "lg";

  return (
    <div
      className={`${theme.bg} ${
        isLarge ? "p-3 sm:p-5 md:p-6" : "p-2.5 sm:p-3"
      } border-b border-black/80 ${className}`}
    >
      {style === "techsprint" ? (
        <div
          className={`relative ${
            isLarge ? "h-40 sm:h-52 md:h-60" : "h-28 sm:h-32"
          } w-full rounded-xl sm:rounded-2xl border border-black/80 bg-[#18191c] overflow-hidden flex flex-col items-center justify-between ${
            isLarge ? "p-4 sm:p-6" : "p-2.5 sm:p-3"
          } shadow-xs`}
        >
          <div
            className={`relative z-10 flex items-center justify-center gap-1.5 ${
              isLarge ? "mt-1 sm:mt-2 scale-125" : "mt-0.5"
            }`}
          >
            <span className="inline-block w-5 h-2 rounded-full bg-[#EA4335] -rotate-35 translate-x-1" />
            <span className="inline-block w-5 h-2 rounded-full bg-[#34A853] rotate-35 -translate-x-1" />
          </div>
          <div
            className={`relative z-10 flex items-center justify-center gap-1.5 ${
              isLarge ? "-mt-0.5 scale-125" : "-mt-1"
            }`}
          >
            <span className="inline-block w-5 h-2 rounded-full bg-[#4285F4] rotate-35 translate-x-1" />
            <span className="inline-block w-5 h-2 rounded-full bg-[#FBBC05] -rotate-35 -translate-x-1" />
          </div>

          <p
            className={`relative z-10 ${
              isLarge ? "text-xs sm:text-sm md:text-base" : "text-[10.5px]"
            } font-bold text-white/95 tracking-tight text-center line-clamp-1 px-1`}
          >
            {event.tag || "GDG On Campus BPPIMT"}
          </p>

          <svg
            aria-hidden="true"
            viewBox="0 0 200 70"
            className={`${
              isLarge ? "w-44 sm:w-60 h-14 sm:h-20 -mb-3 sm:-mb-4" : "w-32 h-11 -mb-2.5"
            } text-[#4285F4] opacity-90`}
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
        <div
          className={`relative ${
            isLarge ? "h-40 sm:h-52 md:h-60" : "h-28 sm:h-32"
          } w-full rounded-xl sm:rounded-2xl border border-black/80 bg-gradient-to-br from-[#120c24] via-[#1f1138] to-[#0d192e] overflow-hidden flex flex-col justify-between ${
            isLarge ? "p-4 sm:p-6" : "p-2.5 sm:p-3"
          } shadow-xs text-white`}
        >
          <div
            className={`flex items-center justify-between ${
              isLarge ? "text-[10px] sm:text-xs" : "text-[8.5px]"
            } font-bold uppercase tracking-widest text-purple-300/90`}
          >
            <span>BPPIMT TechForum</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
              {event.tag || "Competition"}
            </span>
          </div>

          <div className="text-center my-auto px-1">
            <p
              className={`font-heading ${
                isLarge ? "text-lg sm:text-2xl md:text-3xl" : "text-sm sm:text-base"
              } font-black tracking-wide uppercase bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent line-clamp-2`}
            >
              {event.title}
            </p>
          </div>

          <div
            className={`flex items-center justify-center gap-1.5 ${
              isLarge ? "text-xs sm:text-sm" : "text-[9.5px]"
            } text-white/80`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            <span className="ml-1 font-medium">GDG On Campus</span>
          </div>
        </div>
      ) : (
        <div
          className={`relative ${
            isLarge ? "h-40 sm:h-52 md:h-60" : "h-28 sm:h-32"
          } w-full rounded-xl sm:rounded-2xl border border-black/80 bg-white overflow-hidden flex flex-col justify-between ${
            isLarge ? "p-4 sm:p-6" : "p-2.5 sm:p-3"
          } shadow-xs`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute ${
              isLarge ? "-top-8 -left-8 w-20 h-20" : "-top-5 -left-5 w-12 h-12"
            } rounded-full bg-[#FBBC05]`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute ${
              isLarge ? "-top-8 -right-8 w-20 h-20" : "-top-5 -right-5 w-12 h-12"
            } rounded-full bg-[#EA4335]`}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-1.5"
          >
            <span className={`${isLarge ? "w-3 h-3" : "w-2.5 h-2.5"} rounded-full bg-[#4285F4]`} />
            <span className={`${isLarge ? "w-2 h-2" : "w-1.5 h-1.5"} rounded-full bg-[#EA4335]`} />
            <span className={`${isLarge ? "w-2 h-2" : "w-1.5 h-1.5"} rounded-full bg-[#34A853]`} />
          </div>

          <div className="relative z-10 flex items-center justify-center gap-1.5 pt-0.5">
            <span
              className={`font-mono ${
                isLarge ? "text-base sm:text-lg" : "text-xs"
              } font-black tracking-tighter`}
            >
              <span className="text-[#EA4335]">&lt;</span>
              <span className="text-[#4285F4]">/</span>
              <span className="text-[#34A853]">&gt;</span>
            </span>
            <div className="text-left leading-tight">
              <p className={`${isLarge ? "text-xs sm:text-sm" : "text-[10px]"} font-bold text-gray-800`}>
                Google Developer Groups
              </p>
              <p className={`${isLarge ? "text-[10px] sm:text-xs" : "text-[8.5px]"} font-semibold text-[#4285F4]`}>
                On Campus • <span className="text-gray-600">BPPIMT</span>
              </p>
            </div>
          </div>

          {isFeatured ? (
            <div className="relative z-10 text-center my-auto">
              <p
                className={`${
                  isLarge ? "text-xs sm:text-sm" : "text-[9px]"
                } font-medium italic text-gray-500 mb-1`}
              >
                Get ready to
              </p>
              <div
                className={`flex items-center justify-center gap-2 font-heading ${
                  isLarge ? "text-xl sm:text-3xl md:text-4xl" : "text-sm sm:text-base"
                } font-black tracking-tight`}
              >
                <span className="text-[#4285F4]">BUILD.</span>
                <span className="text-[#EA4335]">LEARN.</span>
                <span className="text-[#34A853]">CONNECT.</span>
              </div>
            </div>
          ) : style === "genai" ? (
            <div className="relative z-10 text-center my-auto">
              <p
                className={`font-heading ${
                  isLarge ? "text-xl sm:text-3xl" : "text-base"
                } font-extrabold bg-gradient-to-r from-[#4285F4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent`}
              >
                GenAI Study Jams
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#4285F4] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Build with AI
              </span>
            </div>
          ) : (
            <div className="relative z-10 text-center my-auto px-1">
              <p
                className={`${
                  isLarge ? "text-xs sm:text-sm" : "text-[9.5px]"
                } font-medium italic text-gray-500 mb-0.5`}
              >
                {event.tag || "Workshop"}
              </p>
              <p
                className={`font-heading ${
                  isLarge ? "text-base sm:text-xl md:text-2xl" : "text-xs sm:text-sm"
                } font-extrabold text-gray-900 line-clamp-2 tracking-tight`}
              >
                {event.title}
              </p>
            </div>
          )}

          <div className="relative z-10 flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-1.5 ${
                isLarge ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[9px]"
              } rounded-full bg-gray-100 font-semibold text-gray-700`}
            >
              <MapPin className={`${isLarge ? "w-3.5 h-3.5" : "w-2.5 h-2.5"} text-[#EA4335]`} />
              {isFeatured ? "C BLOCK, BPPIMT" : "BPPIMT Campus"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* Blank / Pulse Placeholder Slot for Right-Side Empty Slots */
function BlankBlinkEventCard({ slotIndex }: { slotIndex: number }) {
  const bannerTint =
    slotIndex % 2 === 0
      ? "bg-[#81c995]/30 border-b border-dashed border-border-strong"
      : "bg-[#f28b82]/30 border-b border-dashed border-border-strong";

  return (
    <div className="w-[280px] sm:w-[320px] md:w-[335px] flex-shrink-0 snap-start flex flex-col rounded-2xl border-2 border-dashed border-border-strong bg-surface-subtle/40 overflow-hidden select-none">
      <div className={`${bannerTint} p-2.5 sm:p-3`}>
        <div className="h-28 sm:h-32 w-full rounded-xl border border-dashed border-border-strong bg-surface-card/70 flex flex-col items-center justify-center p-3 text-center animate-pulse">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]/70 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]/70" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]/70" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]/70" />
          </div>
          <p className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">
            Next Event Dropping Soon
          </p>
          <p className="text-[10.5px] text-text-tertiary mt-0.5">
            Stay tuned for announcements
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4 bg-surface-card/60 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded-md bg-surface-subtle" />
          <div className="h-3 w-full rounded-md bg-surface-subtle/80" />
          <div className="h-3 w-5/6 rounded-md bg-surface-subtle/80" />
          <div className="pt-1.5 flex items-center gap-2">
            <div className="h-3.5 w-24 rounded bg-surface-subtle" />
          </div>
        </div>

        <div className="mt-4 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border-strong bg-surface-subtle/60 text-text-tertiary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Coming Soon...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Events({ isCard = false }: { isCard?: boolean } = {}) {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const upcoming = useMemo(() => getUpcomingEvents(), []);
  const past = useMemo(() => getPastEvents(), []);

  const isPastTab = activeTab === "past";
  const visibleEvents = isPastTab ? past : upcoming;
  const blankSlotsCount = !isPastTab ? Math.max(0, 3 - visibleEvents.length) : 0;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past", count: past.length },
  ];

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  const scrollByDirection = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = Math.max(280, el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, activeTab]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-5 gap-2 sm:gap-4">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Community Calendar
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mt-0.5 sm:mt-1">
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
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus BPPIMT.
            </p>
          )}
        </div>

        {/* Action in Header */}
        {isCard && (
          /* Homepage: Button to view all events */
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-semibold transition-all shadow-xs flex-shrink-0"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>

      {/* Tabs & Horizontal Navigation Controls */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
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
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>{tab.label} Events</span>
                <span
                  className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-surface-card text-text-secondary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Arrow Buttons for Easy Horizontal Browsing */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isPastTab && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-text-secondary mr-2">
              <Award className="w-3.5 h-3.5 text-[#34A853]" />
              <span>{past.length} Completed Events</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => scrollByDirection("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-black/70 dark:border-border-strong bg-surface-card hover:bg-surface-subtle disabled:opacity-20 disabled:pointer-events-none transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4 text-text-primary" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-black/70 dark:border-border-strong bg-surface-card hover:bg-surface-subtle disabled:opacity-20 disabled:pointer-events-none transition-all shadow-xs"
          >
            <ChevronRight className="w-4 h-4 text-text-primary" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* Horizontal Scrolling Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-2.5 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-black/25 dark:scrollbar-thumb-white/25 select-none"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
            }}
          >
            {visibleEvents.map((event, idx) => {
              const formattedDate = event.displayDate || event.date || "Upcoming";
              const isFeatured = !isPastTab && idx === 0;

              return (
                <div
                  key={event.id || idx}
                  className="w-[280px] sm:w-[320px] md:w-[335px] flex-shrink-0 snap-start flex flex-col rounded-2xl border border-black/80 dark:border-border-strong bg-surface-subtle/70 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Top Colored Banner */}
                  <EventCardBanner
                    event={event}
                    idx={idx}
                    isFeatured={isFeatured}
                  />

                  {/* Bottom Content Body */}
                  <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4 bg-surface-card">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-text-secondary">
                          <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">{formattedDate}</span>
                        </span>
                        {event.registrationType && (
                          <span className="text-[10px] font-bold text-text-primary bg-surface-subtle px-1.5 py-0.5 rounded-md border border-border-subtle line-clamp-1">
                            {event.registrationType}
                          </span>
                        )}
                      </div>

                      {event.title && (
                        <h3 className="font-heading text-sm sm:text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          <Link
                            href={`/events/${event.id}`}
                            className="hover:underline"
                          >
                            {event.title}
                          </Link>
                        </h3>
                      )}

                      {event.shortDescription && (
                        <p className="text-[11px] sm:text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                          {event.shortDescription}
                        </p>
                      )}

                      <div className="mt-2.5 space-y-0.5">
                        {event.time && (
                          <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-text-secondary">
                            <Clock className="w-3 h-3 text-text-tertiary flex-shrink-0" />
                            <span className="line-clamp-1">{event.time}</span>
                          </p>
                        )}
                        {event.location && (
                          <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-text-tertiary">
                            <MapPin className="w-3 h-3 text-[#EA4335] flex-shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Button Area:
                        - On Homepage (isCard = true): NO RSVP or About button as requested (details in brief only)
                        - On Events Page (isCard = false): "About this event" button linking to /events/[id]
                    */}
                    {!isCard && (
                      <div className="mt-3.5 pt-1">
                        <Link
                          href={`/events/${event.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                        >
                          <span>About this event</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Right-Side Blink / Blank Slots on Upcoming Tab (No "About this event" or RSVP buttons) */}
            {Array.from({ length: blankSlotsCount }).map((_, slotIdx) => (
              <BlankBlinkEventCard
                key={`blank-slot-${slotIdx}`}
                slotIndex={visibleEvents.length + slotIdx}
              />
            ))}
          </div>

          {/* Bottom helper swipe text for mobile */}
          <div className="flex items-center justify-end text-[11px] text-text-tertiary mt-2 px-1">
            <span className="sm:hidden text-center w-full text-text-secondary font-medium">
              ← Swipe horizontally to explore events →
            </span>
            {isPastTab && (
              <span className="hidden sm:inline-flex items-center gap-1 font-medium text-[#34A853]">
                <Award className="w-3.5 h-3.5" />
                {past.length} Completed
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (isCard) {
    return <div className="p-4 sm:p-6 lg:p-7">{content}</div>;
  }

  return (
    <section id="events" className="w-full py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}

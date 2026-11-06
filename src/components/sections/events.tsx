"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, ArrowUpRight, Sparkles, Bell } from "lucide-react";
import eventsData from "@/data/events.json";
import chapterConfig from "@/data/chapter.json";
import { EventItem, ChapterConfig } from "@/types/schema";

export function Events() {
  const events = (eventsData as EventItem[]) || [];
  const chapter = chapterConfig as ChapterConfig;

  return (
    <section id="events" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Calendar
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1">
              Upcoming Events
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

        {/* Dynamic Content: Empty State vs Real Events */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-full bg-surface-card border border-border-subtle rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden"
          >
            {/* Subtle Google Blue Glow Line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-gdg-blue to-transparent" />

            <div className="max-w-xl mx-auto flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-gdg-blue flex items-center justify-center mb-5 shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>

              <span className="inline-block px-3.5 py-1 rounded-full bg-surface-subtle border border-border-subtle text-xs font-medium text-text-secondary mb-3">
                Events Loading...
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Something exciting is brewing in the lab.
              </h3>

              <p className="text-sm sm:text-base text-text-secondary mt-3 leading-relaxed">
                We’re curating hands-on workshops, cloud study jams, and hackathon prep for this semester. The lineup will drop right here soon — don’t miss the announcements!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                {chapter.communityUrl && (
                  <Link
                    href={chapter.communityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Get Official Updates</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {events.map((event, idx) => (
              <motion.div
                key={event.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-surface-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start sm:items-center gap-6">
                  {/* Date Badge */}
                  {event.month && event.day && (
                    <div className="flex-shrink-0 w-20 rounded-xl overflow-hidden border border-border-subtle bg-surface-page text-center shadow-sm">
                      <div className={`py-1 text-xs font-semibold tracking-wider text-white ${idx % 2 === 0 ? "bg-gdg-blue" : "bg-gdg-green"}`}>
                        {event.month}
                      </div>
                      <div className="py-2.5 text-2xl font-bold text-text-primary">
                        {event.day}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {event.location && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-gdg-blue text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      )}
                      {event.seats && (
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
                {event.rsvpUrl && (
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import { MapPin, Users, ArrowUpRight, Bell, Calendar } from "lucide-react";
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
            <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
              Community Calendar
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1.5">
              Upcoming Events
            </h2>
          </div>
          {chapter.communityUrl && (
            <Link
              href={chapter.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-colors"
            >
              <span>View Official Chapter Page</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Dynamic Content: Empty State vs Real Events */}
        {events.length === 0 ? (
          <div className="w-full bg-surface-card border border-border-subtle rounded-2xl p-8 sm:p-14 text-center">
            <div className="max-w-lg mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary mb-5">
                <Calendar className="w-5 h-5 text-primary" />
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Something exciting is brewing in the lab.
              </h3>

              <p className="text-sm sm:text-base text-text-secondary mt-3 leading-relaxed">
                We’re curating hands-on workshops, cloud study jams, and hackathon prep for this semester. The lineup will drop right here soon — stay tuned!
              </p>

              {chapter.communityUrl && (
                <div className="mt-8">
                  <Link
                    href={chapter.communityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Get Official Updates</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div
                key={event.id || idx}
                className="bg-surface-card border border-border-subtle hover:border-border-strong rounded-2xl p-6 sm:p-8 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="flex items-start sm:items-center gap-6">
                  {/* Date Badge */}
                  {event.month && event.day && (
                    <div className="flex-shrink-0 w-16 sm:w-20 rounded-xl overflow-hidden border border-border-subtle bg-surface-page text-center">
                      <div className={`py-1 text-xs font-bold tracking-wider text-white ${idx % 2 === 0 ? "bg-gdg-blue" : "bg-gdg-green"}`}>
                        {event.month}
                      </div>
                      <div className="font-heading py-2 text-2xl font-extrabold text-text-primary">
                        {event.day}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {event.location && (
                        <span className="inline-flex items-center gap-1 text-text-secondary text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
                          {event.location}
                        </span>
                      )}
                      {event.seats && (
                        <span className="inline-flex items-center gap-1 text-text-secondary text-xs font-medium before:content-['•'] before:mr-2 before:text-text-tertiary">
                          <Users className="w-3.5 h-3.5 text-text-tertiary" />
                          {event.seats}
                        </span>
                      )}
                    </div>

                    {event.title && (
                      <h3 className="font-heading text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
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
                      className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <span>RSVP</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

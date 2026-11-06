"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, MessageCircle, GraduationCap } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import { ChapterConfig } from "@/types/schema";

export function CommunityBanner() {
  const chapter = chapterConfig as ChapterConfig;

  // If no community links exist, return null
  if (!chapter.socials?.whatsapp && !chapter.socials?.discord) {
    return null;
  }

  return (
    <section id="join" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto rounded-3xl bg-surface-card border border-border-subtle p-8 sm:p-12 lg:p-16 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-gdg-blue text-xs font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Open to all {chapter.chapterName || "Campus"} Students</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
            Ready to accelerate your engineering journey?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary mt-3 leading-relaxed">
            Join our open student developer channels, attend weekend hack sprints, and access complimentary Google Cloud skill badges and workshops.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {chapter.socials.whatsapp && (
            <Link
              href={chapter.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp</span>
            </Link>
          )}
          {chapter.socials.discord && (
            <Link
              href={chapter.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-surface-page text-text-primary text-sm font-medium border border-border-subtle shadow-sm hover:bg-surface-subtle transition-all text-center"
            >
              <MessageSquare className="w-4 h-4 text-text-secondary" />
              <span>Join Discord</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

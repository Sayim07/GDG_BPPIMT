"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, Github, Twitter, Users, ArrowUpRight } from "lucide-react";
import teamData from "@/data/team.json";
import chapterConfig from "@/data/chapter.json";
import { TeamMember, ChapterConfig } from "@/types/schema";

const badgeColorMap = {
  blue: "bg-blue-50 dark:bg-blue-950/40 text-gdg-blue",
  red: "bg-red-50 dark:bg-red-950/40 text-gdg-red",
  yellow: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  green: "bg-emerald-50 dark:bg-emerald-950/40 text-gdg-green",
};

export function Team() {
  const members = (teamData as TeamMember[]) || [];
  const chapter = chapterConfig as ChapterConfig;

  return (
    <section id="team" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-card border-t border-border-subtle transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-text-tertiary font-semibold">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1">
            Chapter Leads
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            The student organizers driving GDG on Campus BPPIMT
          </p>
        </div>

        {/* Dynamic Content: Empty State vs Real Team */}
        {members.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-full bg-surface-page border border-border-subtle rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden"
          >
            {/* Subtle Google Green/Red Gradient Accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-gdg-green to-transparent" />

            <div className="max-w-xl mx-auto flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-gdg-green flex items-center justify-center mb-5 shadow-sm">
                <Users className="w-7 h-7" />
              </div>

              <span className="inline-block px-3.5 py-1 rounded-full bg-surface-subtle border border-border-subtle text-xs font-medium text-text-secondary mb-3">
                Squad Assembling...
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                The crew will arrive soon to your feed.
              </h3>

              <p className="text-sm sm:text-base text-text-secondary mt-3 leading-relaxed">
                From tech leads building the architecture to domain mentors guiding AI, Cloud & Web — the team driving GDG on Campus BPPIMT is finalizing preparations. The official roster reveal will drop shortly!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                {chapter.socials?.linkedin && (
                  <Link
                    href={chapter.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
                  >
                    <span>Connect on LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
                {chapter.socials?.discord && (
                  <Link
                    href={chapter.socials.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-card text-text-primary text-sm font-medium border border-border-subtle shadow-sm hover:bg-surface-subtle transition-all"
                  >
                    <span>Meet us on Discord</span>
                    <ArrowUpRight className="w-4 h-4 text-text-secondary" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, idx) => {
              const badgeClass = member.badgeColor ? badgeColorMap[member.badgeColor] : badgeColorMap.blue;

              return (
                <motion.div
                  key={member.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-surface-page border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-200 flex flex-col items-center text-center group"
                >
                  {/* Avatar (Image or Initial Monogram Fallback) */}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-border-subtle shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center bg-surface-subtle">
                    {member.avatarUrl ? (
                      <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Name & Role */}
                  {member.name && (
                    <h3 className="text-base font-semibold text-text-primary">
                      {member.name}
                    </h3>
                  )}
                  {member.role && (
                    <span className={`inline-block px-3 py-1 mt-1.5 rounded-full text-xs font-medium ${badgeClass}`}>
                      {member.role}
                    </span>
                  )}
                  {member.tagline && (
                    <p className="text-xs text-text-tertiary mt-2">
                      {member.tagline}
                    </p>
                  )}

                  {/* Socials */}
                  {member.socials && (member.socials.linkedin || member.socials.github || member.socials.twitter) && (
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-subtle w-full justify-center">
                      {member.socials.linkedin && (
                        <Link
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      )}
                      {member.socials.github && (
                        <Link
                          href={member.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                          aria-label={`${member.name} GitHub`}
                        >
                          <Github className="w-4 h-4" />
                        </Link>
                      )}
                      {member.socials.twitter && (
                        <Link
                          href={member.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                          aria-label={`${member.name} Twitter`}
                        >
                          <Twitter className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

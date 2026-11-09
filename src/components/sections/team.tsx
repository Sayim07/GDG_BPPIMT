import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Github, Twitter, Users, ArrowUpRight } from "lucide-react";
import teamData from "@/data/team.json";
import chapterConfig from "@/data/chapter.json";
import { TeamMember, ChapterConfig } from "@/types/schema";

const badgeColorMap = {
  blue: "text-gdg-blue bg-blue-50 dark:bg-blue-950/30",
  red: "text-gdg-red bg-red-50 dark:bg-red-950/30",
  yellow: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  green: "text-gdg-green bg-emerald-50 dark:bg-emerald-950/30",
};

export function Team({ isCard = false }: { isCard?: boolean } = {}) {
  const members = (teamData as TeamMember[]) || [];
  const chapter = chapterConfig as ChapterConfig;

  const content = (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Chapter Leadership
        </p>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1.5">
          Organizers & Leads
        </h2>
        <p className="text-sm text-text-secondary mt-1.5">
          The student team driving GDG on Campus BPPIMT
        </p>
      </div>

      {/* Dynamic Content: Empty State vs Real Team */}
      {members.length === 0 ? (
        <div className="w-full bg-surface-page border border-border-subtle rounded-2xl p-8 sm:p-12 text-center">
          <div className="max-w-lg mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary mb-4">
              <Users className="w-5 h-5 text-primary" />
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              The crew will arrive soon to your feed.
            </h3>

            <p className="text-sm text-text-secondary mt-2.5 leading-relaxed">
              From tech leads building the architecture to domain mentors guiding AI, Cloud & Web — the team driving GDG on Campus BPPIMT is finalizing preparations. The official roster reveal will drop shortly!
            </p>

            {chapter.socials?.linkedin && (
              <div className="mt-6">
                <Link
                  href={chapter.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {members.map((member, idx) => {
            const badgeClass = member.badgeColor ? badgeColorMap[member.badgeColor] : badgeColorMap.blue;

            return (
              <div
                key={member.id || idx}
                className="bg-surface-page border border-border-subtle hover:border-border-strong rounded-2xl p-5 transition-colors flex flex-col items-center text-center group"
              >
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border border-border-subtle flex items-center justify-center bg-surface-subtle">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span className="font-heading text-xl font-bold text-text-secondary">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
                  {member.name}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {member.role}
                </p>

                {/* Domain Tag */}
                {member.domain && (
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold mt-2.5 ${badgeClass}`}>
                    {member.domain}
                  </span>
                )}

                {/* Bio */}
                {member.bio && (
                  <p className="text-xs text-text-tertiary mt-2.5 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                {member.socials && (
                  <div className="flex items-center gap-3 mt-3.5 pt-3 border-t border-border-subtle w-full justify-center">
                    {member.socials.linkedin && (
                      <Link
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary hover:text-text-primary transition-colors"
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
                        className="text-text-tertiary hover:text-text-primary transition-colors"
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
                        className="text-text-tertiary hover:text-text-primary transition-colors"
                        aria-label={`${member.name} Twitter`}
                      >
                        <Twitter className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isCard) {
    return <div className="p-6 sm:p-10">{content}</div>;
  }

  return (
    <section id="team" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-surface-card border-t border-border-subtle transition-colors">
      <div className="max-w-6xl mx-auto">{content}</div>
    </section>
  );
}

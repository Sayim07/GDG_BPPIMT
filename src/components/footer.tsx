import React from "react";
import Link from "next/link";
import Image from "next/image";
import chapterConfig from "@/data/chapter.json";
import { ChapterConfig } from "@/types/schema";

export function Footer() {
  const chapter = chapterConfig as ChapterConfig;

  return (
    <footer className="w-full bg-surface-card border-t border-border-subtle transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/gdg-logo.png"
              alt="GDG on Campus BPPIMT Logo"
              width={34}
              height={20}
              className="object-contain w-auto h-5"
            />
            <span className="font-semibold text-sm text-text-primary">
              Google Developer Groups on Campus • {chapter.chapterName}
            </span>
          </div>

          {/* Social Links (Dynamic) */}
          <div className="flex items-center gap-6">
            {chapter.socials.whatsapp && (
              <Link
                href={chapter.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                WhatsApp
              </Link>
            )}
            {chapter.socials.linkedin && (
              <Link
                href={chapter.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                LinkedIn
              </Link>
            )}
            {chapter.socials.github && (
              <Link
                href={chapter.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                GitHub
              </Link>
            )}
            {chapter.communityUrl && (
              <Link
                href={chapter.communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Google Community Page
              </Link>
            )}
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>
            {chapter.name} is an independent student community. Not sponsored by Google LLC directly.
          </p>
          <p>© 2026 {chapter.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

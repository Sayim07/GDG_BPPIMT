"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import { ChapterConfig } from "@/types/schema";

export function Navbar() {
  const chapter = chapterConfig as ChapterConfig;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface-page border-b border-border-subtle transition-colors">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center">
            {/* Authentic GDG 4-Color Brackets */}
            <svg className="w-8 h-8" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48 64L20 96L48 128" stroke="#4285F4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M144 64L172 96L144 128" stroke="#EA4335" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M112 52L80 140" stroke="#FBBC04" strokeWidth="16" strokeLinecap="round"/>
              <circle cx="96" cy="96" r="8" fill="#34A853"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-text-primary leading-tight">
              Google Developer Group
            </span>
            <span className="text-[10px] sm:text-xs text-text-secondary font-medium tracking-normal leading-tight">
              {chapter.chapterName || "B.P. Poddar Institute of Management and Technology"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#about" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/#tracks" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            Tracks
          </Link>
          <Link href="/events" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="/team" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            Team
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle & Join Button */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Join Chapter Button */}
          {chapter.communityUrl && (
            <Link
              href={chapter.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
            >
              Join Chapter
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-subtle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-surface-page px-4 py-4 space-y-3">
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-text-secondary hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/#tracks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-text-secondary hover:text-primary"
          >
            Tracks
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-text-secondary hover:text-primary"
          >
            Events
          </Link>
          <Link
            href="/team"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-text-secondary hover:text-primary"
          >
            Team
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-text-secondary hover:text-primary"
          >
            FAQ
          </Link>
        </div>
      )}
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import { ChapterConfig } from "@/types/schema";
import { BubbleMenu } from "@/components/ui/bubble-menu";

export function Navbar() {
  const chapter = chapterConfig as ChapterConfig;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative z-50 w-full bg-surface-page border-b border-border-subtle transition-colors">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center">
            {/* Official GDG Logo */}
            <Image
              src="/images/gdg-logo.png"
              alt="GDG on Campus BPPIMT Logo"
              width={42}
              height={25}
              priority
              className="object-contain w-auto h-7 sm:h-8"
            />
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

        {/* Right Actions: Theme Toggle, Join Button & Bubble Menu */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
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
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary-hover shadow-sm transition-all"
            >
              Join Chapter
            </Link>
          )}

          {/* Bubble Menu Hamburger in Right Top Corner */}
          <BubbleMenu />
        </div>
      </div>
    </header>
  );
}

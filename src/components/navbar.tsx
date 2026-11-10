"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import { ChapterConfig } from "@/types/schema";

// Defer BubbleMenu & GSAP out of critical page load bundle
const BubbleMenu = dynamic(
  () => import("@/components/ui/bubble-menu").then((mod) => mod.BubbleMenu),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border-subtle bg-surface-subtle"
        aria-hidden="true"
      />
    ),
  }
);

export function Navbar() {
  const chapter = chapterConfig as ChapterConfig;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative z-50 w-full bg-surface-page border-b border-border-subtle transition-colors">
      <div className="h-14 sm:h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          {/* Official GDG Logo (Crisp 5.6KB SVG instead of 165KB PNG) */}
          <Image
            src="/images/gdg-logo.svg"
            alt="GDG on Campus BPPIMT Logo"
            width={42}
            height={25}
            priority
            className="object-contain w-auto h-5 sm:h-8 flex-shrink-0"
          />

          <div className="flex flex-col min-w-0">
            <span className="font-bold tracking-tight text-text-primary leading-tight text-sm sm:text-base">
              <span className="text-[12px] sm:text-[16px]">Google Developer Group</span>
            </span>
            <span className="text-[6px] sm:text-xs text-text-secondary font-medium tracking-normal leading-tight">
              {chapter.chapterName || "B.P. Poddar Institute of Management and Technology"}
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle — icon only, same size on all breakpoints */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}

          {/* Join Chapter — hidden on mobile, visible on sm+ */}
          {chapter.communityUrl && (
            <Link
              href={chapter.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="items-center justify-center px-2 sm:px-5 py-2 rounded-full bg-primary text-white text-[10px] sm:text-sm font-bold hover:bg-primary-hover shadow-sm transition-all"
            >
              Join Chapter
            </Link>
          )}

          {/* Bubble Menu Hamburger */}
          <BubbleMenu />
        </div>
      </div>
    </header>
  );
}
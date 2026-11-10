"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, ChevronDown, Users } from "lucide-react";
import chapterConfig from "@/data/chapter.json";
import statsData from "@/data/stats.json";
import { ChapterConfig, StatItem } from "@/types/schema";
import { ShapeGrid } from "@/components/ui/shape-grid";
import { StrokeText } from "@/components/ui/stroke-text";
import { TextType } from "@/components/ui/text-type";

// Floating Google product icons with enlarged medium-big sizes and well-spaced coordinates
const GOOGLE_APPS = [
  {
    name: "Gemini",
    src: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
    className: "top-10 left-[6%] w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    animation: "animate-float-slow",
  },
  {
    name: "Google Cloud",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    className: "top-14 right-[8%] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    animation: "animate-float-delayed",
  },
  {
    name: "Google Drive",
    src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
    className: "top-[40%] left-[3%] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20",
    animation: "animate-float-reverse",
  },
  {
    name: "Google Maps",
    src: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg",
    className: "top-[42%] right-[4%] w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18",
    animation: "animate-float-slow",
  },
  {
    name: "YouTube",
    src: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    className: "top-[22%] left-[20%] w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18",
    animation: "animate-float-delayed",
  },
  {
    name: "Gmail",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    className: "top-[20%] right-[22%] w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18",
    animation: "animate-float-slow",
  },
  {
    name: "Firebase",
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
    className: "bottom-[30%] left-[12%] w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    animation: "animate-float-delayed",
  },
  {
    name: "TensorFlow",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
    className: "bottom-[28%] right-[14%] w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    animation: "animate-float-slow",
  },
  {
    name: "Chrome",
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
    className: "bottom-[42%] left-[25%] w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    animation: "animate-float-reverse",
  },
  {
    name: "Android",
    src: "https://upload.wikimedia.org/wikipedia/commons/6/64/Android_logo_2019_%28stacked%29.svg",
    className: "bottom-[44%] right-[26%] w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    animation: "animate-float-reverse",
  },
];

export function Hero() {
  const chapter = chapterConfig as ChapterConfig;
  const stats = (statsData as StatItem[]) || [];
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tramProgress, setTramProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight || 800;

      // Map progress across hero scroll height (0 to 1)
      const progress = Math.min(Math.max(scrollY / (windowHeight * 0.9), 0), 1);
      setTramProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Tram moves smoothly across the screen from off-left (-25vw) to beyond the right boundary (105vw)
  const tramTranslateX = -25 + tramProgress * 130;

  return (
    <div className="relative w-full min-h-[calc(100dvh-4rem)] flex flex-col justify-between bg-surface-page border-b border-border-subtle overflow-hidden">
      {/* Keyframe Styles for Floating Icons & Subtle Tram Motion */}
      <style jsx global>{`
        @keyframes tramBob {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(3deg);
          }
        }
        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(12px) rotate(-3deg);
          }
        }
        .animate-tram-bob {
          animation: tramBob 1.6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatSlow 7s ease-in-out 2s infinite;
        }
        .animate-float-reverse {
          animation: floatReverse 6.5s ease-in-out 1s infinite;
        }
      `}</style>

      {/* Interactive ShapeGrid Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ShapeGrid
          shape="square"
          cellSize={44}
          lineWidth={1}
          direction="diagonal"
          speed={0.2}
          lineColor={isDark ? "rgba(255, 255, 255, 0.08)" : "#e8eaed"}
          hoverColor={isDark ? "#8ab4f8" : "#4285F4"}
          hoverFillColor={isDark ? "rgba(138, 180, 248, 0.12)" : "rgba(66, 133, 244, 0.08)"}
          fillOpacity={0.16}
          rainbow={true}
          radius={1.8}
          trail={0.5}
          glow={isDark ? 0.45 : 0.25}
          twinkle={0.06}
          fade={0.85}
          clickCascade={true}
          intro={true}
        />
      </div>

      {/* Floating Google Apps Layer (Enlarged Medium-Big Badges) */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden select-none">
        {GOOGLE_APPS.map((app) => (
          <div
            key={app.name}
            className={`absolute flex items-center justify-center p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-xl border border-white/40 dark:border-white/10 ${app.className} ${app.animation}`}
          >
            <img
              src={app.src}
              alt={app.name}
              className="w-full h-full object-contain filter drop-shadow-md"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Google 4-Color Accent Bar */}
      <div
        className="relative z-10 w-full h-1"
        style={{
          background:
            "linear-gradient(90deg, #4285F4 0%, #4285F4 15%, #EA4335 36%, #EA4335 50%, #FBBC04 66%, #FBBC04 78%, #34A853 92%, #34A853 100%)",
        }}
      />

      {/* Main Centered Hero Content */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Headline */}
          {chapter.headline && (
            <h1 className="w-full max-w-6xl mx-auto flex items-center justify-center font-heading text-center">
              <span className="sr-only">{chapter.headline}</span>
              <StrokeText
                text={chapter.headline}
                fontSize={108}
                fontWeight={800}
                gdgColors={true}
                gdgColorMode="gradient"
                isDark={isDark}
                strokeWidth={2.5}
                drawDuration={1.4}
                fillDelay={0.2}
                fillMode="wipe"
                wipeFrom="left"
                hoverRedraw={true}
                shiny={true}
                shineColor="#ffffff"
                shineSpeed={2.5}
                shineWidth={22}
                shineGlow={0.3}
                followPointer={true}
                fontFamily="var(--font-product-sans), Product Sans, system-ui, sans-serif"
                letterSpacing={-2}
                className="w-full"
              />
            </h1>
          )}

          {/* Subtitle */}
          {chapter.subtitle && (
            <div className="max-w-3xl mx-auto mt-6 sm:mt-8 text-center">
              <TextType
                text={chapter.subtitle}
                as="p"
                className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed inline-block"
                typingSpeed={26}
                deletingSpeed={16}
                pauseDuration={3500}
                initialDelay={350}
                showCursor={true}
                cursorStyle="bar"
                cursorColor={isDark ? "#8ab4f8" : "#4285F4"}
                typeEffect="fade"
                loop={false}
              />
            </div>
          )}

          {/* Action CTAs */}
          {chapter.primaryCtaText && chapter.primaryCtaUrl && (
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mt-8 sm:mt-10">
              <Link
                href={chapter.primaryCtaUrl}
                className="btn-sweep-blue inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-bold shadow-sm cursor-pointer"
              >
                <span>{chapter.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/team"
                className="btn-sweep-green inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-bold shadow-sm cursor-pointer group"
              >
                <Users className="w-4 h-4" />
                <span>Meet the Team</span>
              </Link>
            </div>
          )}

          {/* Stats Metrics */}
          {stats.length > 0 && (
            <div className="mt-14 pt-8 border-t border-border-subtle w-full max-w-2xl grid grid-cols-3 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={stat.label || idx}>
                  <div className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-text-tertiary mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tram on Street Animation Layer */}
      <div className="relative z-10 w-full overflow-hidden select-none pointer-events-none mt-4">
        {/* Overhead Catenary Cable Wire */}
        <div className="w-full h-px bg-zinc-300 dark:bg-zinc-700/60 mb-1" />

        {/* Riding Tram Track Section (Controlled by Scroll) */}
        <div className="relative w-full h-24 sm:h-32 flex items-end">
          <div
            className="will-change-transform flex items-end transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${tramTranslateX}vw)`,
            }}
          >
            <div className="animate-tram-bob relative w-[280px] sm:w-[420px] md:w-[500px]">
              <Image
                src="/images/tram-removebg-preview.png"
                alt="Kolkata Heritage Tram"
                width={500}
                height={160}
                className="w-full h-auto drop-shadow-md object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Street Bed & Dual Rail Tracks */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-900/80 border-t border-border-subtle py-1.5 px-0">
          <div className="w-full space-y-1">
            <div className="h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 shadow-sm" />
            <div className="h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="relative z-10 w-full pb-4 pt-1 flex flex-col items-center justify-center text-text-tertiary pointer-events-none select-none">
        <span className="text-[11px] font-medium tracking-widest uppercase opacity-60">
          Scroll to explore
        </span>
        <ChevronDown className="w-4 h-4 mt-0.5 opacity-50 animate-bounce" />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, ChevronDown, Users } from "lucide-react";
import gsap from "gsap";
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
  const tramRef = useRef<HTMLDivElement>(null);

  // Mascot Dragging & Interaction State
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const mascotMaleRef = useRef<HTMLDivElement>(null);
  const mascotFemaleRef = useRef<HTMLDivElement>(null);

  const [showMaleBubble, setShowMaleBubble] = useState(false);
  const [showFemaleBubble, setShowFemaleBubble] = useState(false);
  const [maleBubbleText, setMaleBubbleText] = useState("Hey Builder! Welcome to GDG 🪂");
  const [femaleBubbleText, setFemaleBubbleText] = useState("Let's innovate together! ✨");

  const [isMaleWaving, setIsMaleWaving] = useState(false);
  const [isFemaleWaving, setIsFemaleWaving] = useState(false);
  const [isDraggingMale, setIsDraggingMale] = useState(false);
  const [isDraggingFemale, setIsDraggingFemale] = useState(false);

  interface DragSession {
    startX: number;
    startY: number;
    initialElementX: number;
    initialElementY: number;
    initialScreenLeft: number;
    initialScreenTop: number;
    mascotWidth: number;
    mascotHeight: number;
    hasDragged: boolean;
  }

  const dragSessionMale = useRef<DragSession | null>(null);
  const dragSessionFemale = useRef<DragSession | null>(null);

  // Interactive Cursor & Touch Drag Handlers
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    target: "male" | "female"
  ) => {
    if (e.button !== 0) return; // Only drag on primary click / finger touch
    const el = target === "male" ? mascotMaleRef.current : mascotFemaleRef.current;
    if (!el) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    gsap.killTweensOf(el);

    const rect = el.getBoundingClientRect();
    const currentX = Number(gsap.getProperty(el, "x")) || 0;
    const currentY = Number(gsap.getProperty(el, "y")) || 0;

    const session: DragSession = {
      startX: e.clientX,
      startY: e.clientY,
      initialElementX: currentX,
      initialElementY: currentY,
      initialScreenLeft: rect.left,
      initialScreenTop: rect.top,
      mascotWidth: rect.width,
      mascotHeight: rect.height,
      hasDragged: false,
    };

    if (target === "male") {
      dragSessionMale.current = session;
      setIsDraggingMale(true);
      setShowMaleBubble(true);
      setMaleBubbleText("Flying with you! 🪂");
    } else {
      dragSessionFemale.current = session;
      setIsDraggingFemale(true);
      setShowFemaleBubble(true);
      setFemaleBubbleText("Wheee! Floating high! ✨");
    }

    gsap.to(el, { scale: 1.08, duration: 0.18, ease: "power2.out" });
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    target: "male" | "female"
  ) => {
    const session = target === "male" ? dragSessionMale.current : dragSessionFemale.current;
    if (!session) return;
    const el = target === "male" ? mascotMaleRef.current : mascotFemaleRef.current;
    if (!el) return;

    const dx = e.clientX - session.startX;
    const dy = e.clientY - session.startY;

    if (!session.hasDragged && Math.hypot(dx, dy) > 4) {
      session.hasDragged = true;
    }

    const heroEl = heroContainerRef.current;
    let finalX = session.initialElementX + dx;
    let finalY = session.initialElementY + dy;

    if (heroEl) {
      const heroRect = heroEl.getBoundingClientRect();
      const proposedScreenLeft = session.initialScreenLeft + dx;
      const proposedScreenTop = session.initialScreenTop + dy;

      const minLeft = heroRect.left + 8;
      const maxLeft = heroRect.right - session.mascotWidth - 8;
      const minTop = heroRect.top + 8;
      const maxTop = heroRect.bottom - session.mascotHeight - 80; // Stay safely above tram track bed

      const clampedLeft = Math.max(minLeft, Math.min(maxLeft, proposedScreenLeft));
      const clampedTop = Math.max(minTop, Math.min(maxTop, proposedScreenTop));

      finalX = session.initialElementX + (clampedLeft - session.initialScreenLeft);
      finalY = session.initialElementY + (clampedTop - session.initialScreenTop);
    }

    // Aerodynamic parachute tilt in direction of horizontal motion
    const tilt = Math.max(Math.min(dx * 0.15, 18), -18);

    gsap.set(el, {
      x: finalX,
      y: finalY,
      rotation: tilt,
    });
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    target: "male" | "female"
  ) => {
    const session = target === "male" ? dragSessionMale.current : dragSessionFemale.current;
    if (!session) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const el = target === "male" ? mascotMaleRef.current : mascotFemaleRef.current;

    if (session.hasDragged) {
      // Landed after dragging!
      if (target === "male") {
        setMaleBubbleText("Great landing spot! 🪂🔥");
        setTimeout(() => setShowMaleBubble(false), 3800);
      } else {
        setFemaleBubbleText("Landed safely! ✨");
        setTimeout(() => setShowFemaleBubble(false), 3800);
      }

      if (el) {
        const currentY = Number(gsap.getProperty(el, "y")) || 0;
        gsap.to(el, {
          scale: 1,
          rotation: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(el, {
              y: currentY + (target === "male" ? 10 : 8),
              rotation: target === "male" ? -2 : 2,
              duration: 2.6,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          },
        });
      }
    } else {
      // Just a click or tap (no drag)
      if (target === "male") {
        setShowMaleBubble(true);
        setIsMaleWaving(true);
        setMaleBubbleText("Hey Builder! Welcome to GDG 🪂");
        setTimeout(() => setIsMaleWaving(false), 1000);
      } else {
        setShowFemaleBubble(true);
        setIsFemaleWaving(true);
        setFemaleBubbleText("Let's innovate together! ✨");
        setTimeout(() => setIsFemaleWaving(false), 1000);
      }
      if (el) {
        gsap.to(el, { scale: 1, duration: 0.2 });
      }
    }

    if (target === "male") {
      dragSessionMale.current = null;
      setIsDraggingMale(false);
    } else {
      dragSessionFemale.current = null;
      setIsDraggingFemale(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    let scrollRaf = 0;
    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const scrollY = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight || 800;

        // Map progress across hero scroll height (0 to 1) directly via DOM transform (0 React re-renders)
        const progress = Math.min(Math.max(scrollY / (windowHeight * 0.9), 0), 1);
        if (tramRef.current) {
          const tramTranslateX = -24 + progress * 130;
          tramRef.current.style.transform = `translateX(${tramTranslateX}vw)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Check if preloader has already been seen in this session
    let preloaderSeen = false;
    try {
      preloaderSeen = Boolean(sessionStorage.getItem("gdg_preloader_seen"));
    } catch {}

    const enterDelay = preloaderSeen ? 0.4 : 2.0;
    let hideBubbleTimer: NodeJS.Timeout;

    const ctx = gsap.context(() => {
      // 1. Male Parachute Mascot (Right side, slightly lower)
      if (mascotMaleRef.current) {
        gsap.set(mascotMaleRef.current, {
          x: 180,
          y: -300,
          rotation: 12,
          opacity: 0,
          scale: 0.86,
        });

        const tlMale = gsap.timeline({ delay: enterDelay });

        tlMale
          .to(mascotMaleRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 3.0,
            ease: "power2.out",
            onComplete: () => {
              setShowMaleBubble(true);
            },
          })
          .to(mascotMaleRef.current, {
            y: 12,
            rotation: -2.5,
            duration: 2.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
      }

      // 2. Female Parachute Mascot (Left side, slightly higher)
      if (mascotFemaleRef.current) {
        gsap.set(mascotFemaleRef.current, {
          x: -180,
          y: -300,
          rotation: -12,
          opacity: 0,
          scale: 0.86,
        });

        const tlFemale = gsap.timeline({ delay: enterDelay + 0.1 });

        tlFemale
          .to(mascotFemaleRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 2.9,
            ease: "power2.out",
            onComplete: () => {
              setShowFemaleBubble(true);
            },
          })
          .to(mascotFemaleRef.current, {
            y: 10,
            rotation: 2.5,
            duration: 2.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
      }
    });

    hideBubbleTimer = setTimeout(() => {
      setShowMaleBubble(false);
      setShowFemaleBubble(false);
    }, (enterDelay + 3.0 + 6.5) * 1000);

    return () => {
      ctx.revert();
      cancelAnimationFrame(scrollRaf);
      clearTimeout(hideBubbleTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      ref={heroContainerRef}
      className="relative w-full min-h-[calc(100dvh-4rem)] flex flex-col justify-between bg-surface-page border-b border-border-subtle overflow-hidden"
    >
      {/* Keyframe Styles for Floating Icons & Mascot */}
      <style jsx global>{`
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
            className={`absolute flex items-center justify-center p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#202124]/95 shadow-md border border-black/5 dark:border-white/10 ${app.className} ${app.animation}`}
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

      {/* GDG Female Parachute Mascot (Left side, slightly higher - Drag to move) */}
      <div
        className="absolute z-[15] left-3 sm:left-6 md:left-10 lg:left-14 xl:left-18 top-[20%] sm:top-[22%] md:top-[24%] lg:top-[26%] pointer-events-none"
      >
        <div
          ref={mascotFemaleRef}
          onPointerDown={(e) => handlePointerDown(e, "female")}
          onPointerMove={(e) => handlePointerMove(e, "female")}
          onPointerUp={(e) => handlePointerUp(e, "female")}
          onPointerCancel={(e) => handlePointerUp(e, "female")}
          style={{ touchAction: "none" }}
          className={`relative pointer-events-auto select-none will-change-transform touch-none transition-shadow ${
            isDraggingFemale ? "cursor-grabbing z-30 scale-105" : "cursor-grab"
          }`}
        >
          {/* Welcoming Speech / Chat Bubble */}
          <div
            className={`absolute -top-12 left-4 sm:left-8 sm:-top-14 whitespace-nowrap bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xl border border-red-500/30 text-[11px] sm:text-xs font-semibold text-text-primary transition-all duration-300 ease-out z-20 pointer-events-none ${
              showFemaleBubble || isDraggingFemale
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-2"
            } group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0`}
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" />
              <span>{femaleBubbleText}</span>
            </div>
            {/* Speech bubble tail pointer */}
            <div className="absolute left-6 -bottom-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-r border-b border-red-500/30 rotate-45" />
          </div>

          {/* Parachute Mascot Image */}
          <div className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-48 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_0_28px_rgba(234,67,53,0.38)] transition-transform duration-300 ease-out hover:scale-105 active:scale-95">
            <Image
              src="/images/gdg-parachute-female.png"
              alt="Google Developer Groups On Campus BPPIMT Female Parachute Mascot"
              width={340}
              height={506}
              loading="eager"
              priority={true}
              style={{ width: "100%", height: "auto" }}
              className={`w-full h-auto object-contain pointer-events-none transition-transform duration-300 ${
                isFemaleWaving ? "-rotate-6 scale-110" : ""
              }`}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* GDG Male Parachute Mascot (Right side, slightly lower - Drag to move) */}
      <div
        className="absolute z-[15] right-3 sm:right-6 md:right-10 lg:right-14 xl:right-18 top-[28%] sm:top-[30%] md:top-[33%] lg:top-[36%] pointer-events-none"
      >
        <div
          ref={mascotMaleRef}
          onPointerDown={(e) => handlePointerDown(e, "male")}
          onPointerMove={(e) => handlePointerMove(e, "male")}
          onPointerUp={(e) => handlePointerUp(e, "male")}
          onPointerCancel={(e) => handlePointerUp(e, "male")}
          style={{ touchAction: "none" }}
          className={`relative pointer-events-auto select-none will-change-transform touch-none transition-shadow ${
            isDraggingMale ? "cursor-grabbing z-30 scale-105" : "cursor-grab"
          }`}
        >
          {/* Welcoming Speech / Chat Bubble */}
          <div
            className={`absolute -top-12 -left-20 sm:-left-28 sm:-top-14 whitespace-nowrap bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xl border border-blue-500/30 text-[11px] sm:text-xs font-semibold text-text-primary transition-all duration-300 ease-out z-20 pointer-events-none ${
              showMaleBubble || isDraggingMale
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-2"
            } group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0`}
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
              <span>{maleBubbleText}</span>
            </div>
            {/* Speech bubble tail pointer */}
            <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-r border-b border-blue-500/30 rotate-45" />
          </div>

          {/* Parachute Mascot Image */}
          <div className="w-20 sm:w-28 md:w-36 lg:w-44 xl:w-48 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_0_28px_rgba(66,133,244,0.38)] transition-transform duration-300 ease-out hover:scale-105 active:scale-95">
            <Image
              src="/images/gdg-parachute-male.png"
              alt="Google Developer Groups On Campus BPPIMT Male Parachute Mascot"
              width={340}
              height={506}
              loading="eager"
              priority={true}
              style={{ width: "100%", height: "auto" }}
              className={`w-full h-auto object-contain pointer-events-none transition-transform duration-300 ${
                isMaleWaving ? "rotate-6 scale-110" : ""
              }`}
              draggable={false}
            />
          </div>
        </div>
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

      {/* Tram on Street / Heritage Track Layer */}
      <div className="relative z-10 w-full select-none pointer-events-none mt-4 sm:mt-6">
        {/* Riding Tram Track Section (Controlled by Scroll, smooth gliding without bobbing) */}
        <div className="relative w-full overflow-hidden flex items-end">
          <div
            ref={tramRef}
            className="will-change-transform flex items-end transition-transform duration-75 ease-out"
            style={{
              transform: 'translateX(-24vw)',
            }}
          >
            <div className="relative w-[240px] sm:w-[340px] md:w-[420px]">
              <Image
                src="/images/tram-removebg-preview.png"
                alt="Kolkata Heritage Tram"
                width={500}
                height={160}
                style={{ width: "100%", height: "auto" }}
                className="drop-shadow-md object-contain block"
                priority
              />
            </div>
          </div>
        </div>

        {/* Clean Single Dividing Edge Line (The Track on top of which the tram sits, right before Scroll to explore) */}
        <div className="w-full h-px bg-border-subtle dark:bg-zinc-700/60" />
      </div>

      {/* Scroll Hint */}
      <div className="relative z-10 w-full pb-3 pt-2 flex flex-col items-center justify-center text-text-tertiary pointer-events-none select-none">
        <span className="text-[11px] font-medium tracking-widest uppercase opacity-60">
          Scroll to explore
        </span>
        <ChevronDown className="w-4 h-4 mt-0.5 opacity-50 animate-bounce" />
      </div>
    </div>
  );
}

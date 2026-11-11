'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent
} from 'react';
import gsap from 'gsap';
import { Sparkles, User, ChevronLeft, ChevronRight } from 'lucide-react';

export type DepthCarouselItem =
  | string
  | {
      image?: string;
      alt?: string;
      name?: string;
      role?: string;
      domain?: string;
      category?: 'organizer' | 'lead' | 'core';
      badgeColor?: 'blue' | 'red' | 'yellow' | 'green';
      bio?: string;
    };

type TiltDirection = 'left' | 'right';

export interface DepthCarouselProps {
  items?: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: TiltDirection;
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  onChange?: (index: number, item: DepthCarouselItem) => void;
  className?: string;
}

interface CarouselConfig {
  count: number;
  depth: number;
  spread: number;
  tilt: number;
  tiltDirection: TiltDirection;
  visibleCards: number;
  falloff: number;
  blur: number;
  duration: number;
  ease: string;
  loop: boolean;
  cardWidth: number;
  autoplayDelay: number;
}

interface DragState {
  x: number;
  startPos: number;
  lastX: number;
  lastT: number;
  v: number;
  moved: boolean;
  id: number;
}

// Authentic Google Developer Groups theme placeholder items when no images/roster data is provided yet
const GDG_PLACEHOLDER_ITEMS: DepthCarouselItem[] = [
  {
    name: 'Chapter Lead',
    role: 'Community Organizer',
    domain: 'Core Leadership',
    badgeColor: 'blue'
  },
  {
    name: 'AI & ML Mentor',
    role: 'Domain Lead',
    domain: 'Machine Learning',
    badgeColor: 'red'
  },
  {
    name: 'Web & Cloud Lead',
    role: 'Tech Architect',
    domain: 'Cloud / Fullstack',
    badgeColor: 'yellow'
  },
  {
    name: 'Android & Mobile',
    role: 'Mobile Specialist',
    domain: 'Android / Flutter',
    badgeColor: 'green'
  },
  {
    name: 'UI/UX & Design',
    role: 'Creative Designer',
    domain: 'Product & Design',
    badgeColor: 'blue'
  },
  {
    name: 'Operations & Events',
    role: 'Logistics Coordinator',
    domain: 'Outreach & Growth',
    badgeColor: 'red'
  }
];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const normalizeItem = (it: DepthCarouselItem) =>
  typeof it === 'string' ? { image: it, alt: '', name: 'Team Member', role: 'GDG Member' } : it;

const badgeStyles = {
  blue: 'bg-blue-500/15 text-[#1a73e8] dark:text-[#8ab4f8] border-blue-500/30',
  red: 'bg-red-500/15 text-[#d93025] dark:text-[#f28b82] border-red-500/30',
  yellow: 'bg-amber-500/15 text-[#e37400] dark:text-[#fdd663] border-amber-500/30',
  green: 'bg-emerald-500/15 text-[#188038] dark:text-[#81c995] border-emerald-500/30'
};

const avatarAccents = {
  blue: 'bg-[#4285F4]/15 text-[#1a73e8] dark:text-[#8ab4f8] border-[#4285F4]/40 shadow-[0_0_20px_rgba(66,133,244,0.18)]',
  red: 'bg-[#EA4335]/15 text-[#d93025] dark:text-[#f28b82] border-[#EA4335]/40 shadow-[0_0_20px_rgba(234,67,53,0.18)]',
  yellow: 'bg-[#FBBC04]/15 text-[#e37400] dark:text-[#fdd663] border-[#FBBC04]/40 shadow-[0_0_20px_rgba(251,188,4,0.18)]',
  green: 'bg-[#34A853]/15 text-[#188038] dark:text-[#81c995] border-[#34A853]/40 shadow-[0_0_20px_rgba(52,168,83,0.18)]'
};

export const DepthCarousel = ({
  items = GDG_PLACEHOLDER_ITEMS,
  cardWidth = 280,
  cardHeight = 360,
  radius = 20,
  tint,
  depth = 200,
  spread = 80,
  tilt = 20,
  tiltDirection = 'right',
  perspective = 1300,
  visibleCards = 3,
  falloff = 0.22,
  blur = 5,
  duration = 650,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 3200,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  className = ''
}: DepthCarouselProps) => {
  const data = useMemo(() => (Array.isArray(items) && items.length > 0 ? items : GDG_PLACEHOLDER_ITEMS).map(normalizeItem), [items]);
  const count = data.length;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef<CarouselConfig>({} as CarouselConfig);
  const onChangeRef = useRef(onChange);

  const dragRef = useRef<DragState | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(0);

  onChangeRef.current = onChange;
  cfgRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay
  };

  const layout = useCallback((pos: number) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === 'left' ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.18, 1 - back * cfg.falloff);
      const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;
      const zi = Math.round(2000 - d * 20);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      if (blurPx > 0.5) {
        el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(1)}px)`;
      } else if (brightness < 0.98) {
        el.style.filter = `brightness(${brightness.toFixed(3)})`;
      } else {
        el.style.filter = 'none';
      }
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.82).toFixed(3);
    }
  }, []);

  const notify = useCallback(
    (idx: number) => {
      setActive(idx);
      onChangeRef.current?.(idx, data[idx]);
    },
    [data]
  );

  const tweenTo = useCallback(
    (target: number, animate: boolean) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: cfg.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: () => {
          const n = cfg.count;
          if (n > 0) posRef.current = ((posRef.current % n) + n) % n;
          layout(posRef.current);
        }
      });
    },
    [layout]
  );

  const setFocus = useCallback(
    (rawIndex: number, animate = true) => {
      const cfg = cfgRef.current;
      const n = cfg.count;
      if (!n) return;
      const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
      let delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        notify(idx);
      }
    },
    [tweenTo, notify]
  );

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + 100;
      scaleRef.current = clamp(w / needed, 0.5, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const cfg = cfgRef.current;
      if (cfg.count < 2) return;
      // Only intercept horizontal swipe gestures; NEVER block vertical page scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) + 4) {
        e.preventDefault();
        tweenRef.current?.kill();
        const delta = e.deltaMode === 1 ? e.deltaX * 24 : e.deltaX;
        const step = clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
        posRef.current += step;
        layout(posRef.current);
        if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const cfg = cfgRef.current;
    if (cfg.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId
    };
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const cfg = cfgRef.current;
      const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.v = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout]
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateBy(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateBy(1);
      }
    },
    [navigateBy]
  );

  const onCardClick = useCallback(
    (index: number) => {
      if (dragRef.current?.moved) return;
      setFocus(index, true);
    },
    [setFocus]
  );

  useEffect(() => {
    reducedRef.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!autoplay || reducedRef.current || count < 2) return;
    const root = rootRef.current;
    let hovered = false;
    let focused = false;
    const stop = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };
    const start = () => {
      stop();
      autoTimerRef.current = setInterval(
        () => {
          if (!hovered && !focused) navigateBy(1);
        },
        Math.max(cfgRef.current.autoplayDelay, 600)
      );
    };
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = () => {
      focused = false;
    };
    root?.addEventListener('mouseenter', onEnter);
    root?.addEventListener('mouseleave', onLeave);
    root?.addEventListener('focusin', onFocusIn);
    root?.addEventListener('focusout', onFocusOut);
    start();
    return () => {
      stop();
      root?.removeEventListener('mouseenter', onEnter);
      root?.removeEventListener('mouseleave', onLeave);
      root?.removeEventListener('focusin', onFocusIn);
      root?.removeEventListener('focusout', onFocusOut);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    },
    []
  );

  return (
    <div
      ref={rootRef}
      className={`relative flex h-full min-h-[360px] w-full cursor-grab touch-pan-y select-none items-center justify-center outline-none [perspective-origin:50%_50%] active:cursor-grabbing focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-primary/50 focus-visible:[outline-offset:4px] ${className}`.trim()}
      style={{ perspective: `${perspective}px` }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Depth carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]" ref={stageRef}>
        {data.map((item, i) => {
          const colorKey = item.badgeColor || (['blue', 'red', 'yellow', 'green'][i % 4] as 'blue' | 'red' | 'yellow' | 'green');
          const badgeClass = badgeStyles[colorKey];
          const avatarAccent = avatarAccents[colorKey];

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35),0_8px_20px_-8px_rgba(0,0,0,0.25)] transition-colors hover:border-border-strong [transform:translate(-50%,-50%)] [transform-origin:center] [will-change:transform,opacity,filter]"
              ref={el => {
                cardRefs.current[i] = el;
              }}
              style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={active !== i}
              onClick={() => onCardClick(i)}
            >
              {/* Top Accent Strip with Google Colors */}
              <div className="h-1.5 w-full grid grid-cols-4">
                <div className="bg-[#4285F4] h-full" />
                <div className="bg-[#EA4335] h-full" />
                <div className="bg-[#FBBC04] h-full" />
                <div className="bg-[#34A853] h-full" />
              </div>

              {item.image ? (
                <img
                  className="block h-full w-full select-none object-cover [pointer-events:none] [-webkit-user-drag:none]"
                  src={item.image}
                  alt={item.alt || ''}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              ) : (
                /* GDG-Themed Elevated Member Card with Deep Contrast */
                <div className="relative flex h-[calc(100%-6px)] w-full flex-col items-center justify-between p-6 sm:p-7 text-center select-none bg-white dark:bg-[#202124] shadow-[0_12px_36px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-slate-200/90 dark:border-white/10">

                  {/* Domain Badge */}
                  <div className="z-10 w-full flex justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 opacity-90" />
                      <span>{item.domain || 'Core Team'}</span>
                    </span>
                  </div>

                  {/* Avatar Container with GDG Branded Styling & Initials */}
                  <div className="z-10 relative my-auto flex flex-col items-center">
                    <div
                      className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 ${avatarAccent}`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || 'Member'}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-heading text-xl sm:text-2xl font-black tracking-tight select-none">
                          {item.name ? item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'GDG'}
                        </span>
                      )}
                    </div>
                    <div className="mt-3.5 px-2">
                      <h4 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {item.name || 'Team Lead'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 mt-1 font-bold">
                        {item.role || 'GDG on Campus'}
                      </p>
                      {item.bio && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Role / Lead Status */}
                  <div className="z-10 w-full pt-3 border-t border-border-subtle flex items-center justify-center">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-700 dark:text-zinc-300 bg-surface-subtle px-3 py-1 rounded-full border border-border-subtle">
                      {item.category === 'organizer'
                        ? 'On-Campus Organizer'
                        : item.category === 'lead'
                        ? 'Domain Team Lead'
                        : 'Core Team'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tint overlay during 3D depth transition */}
              <span
                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity ${
                  !tint ? 'bg-white/25 dark:bg-[#05070c]/45' : ''
                }`}
                ref={el => {
                  overlayRefs.current[i] = el;
                }}
                style={tint ? { background: tint } : undefined}
              />
            </div>
          );
        })}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 sm:left-4 top-1/2 z-[3000] grid h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 place-items-center rounded-full border border-border-subtle bg-surface-card/80 text-text-primary shadow-md backdrop-blur-md transition-all duration-200 hover:border-border-strong hover:bg-surface-card hover:scale-105 active:scale-95"
            aria-label="Previous slide"
            onClick={() => navigateBy(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="absolute right-2 sm:right-4 top-1/2 z-[3000] grid h-10 w-10 sm:h-11 sm:w-11 -translate-y-1/2 place-items-center rounded-full border border-border-subtle bg-surface-card/80 text-text-primary shadow-md backdrop-blur-md transition-all duration-200 hover:border-border-strong hover:bg-surface-card hover:scale-105 active:scale-95"
            aria-label="Next slide"
            onClick={() => navigateBy(1)}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div
          className="absolute -bottom-2 sm:bottom-1 left-1/2 z-[3000] flex -translate-x-1/2 gap-2 rounded-full border border-border-subtle bg-surface-card/80 px-3 py-1.5 backdrop-blur-md shadow-sm"
          role="tablist"
          aria-label="Slides"
        >
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                active === i ? 'w-6 bg-primary' : 'w-2 bg-text-tertiary/30 hover:bg-text-tertiary/50'
              }`}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepthCarousel;


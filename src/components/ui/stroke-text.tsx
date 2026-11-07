'use client';

import { CSSProperties, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type StrokeTextTrigger = 'mount' | 'hover' | 'scroll' | 'loop';
export type StrokeTextFillMode = 'wipe' | 'fade' | 'none';
export type StrokeTextWipeFrom = 'left' | 'right' | 'top' | 'bottom';
export type StrokeTextStyle = 'solid' | 'dashed' | 'dotted';

export interface StrokeTextProps {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: StrokeTextTrigger;
  fillMode?: StrokeTextFillMode;
  wipeFrom?: StrokeTextWipeFrom;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  letterSpacing?: number;
  reverse?: boolean;
  strokeStyle?: StrokeTextStyle;
  dashLength?: number;
  marching?: boolean;
  hoverRedraw?: boolean;
  shadow?: boolean;
  shadowColor?: string;
  gdgColors?: boolean;
  gdgColorMode?: 'gradient' | 'words';
  isDark?: boolean;
  shiny?: boolean;
  shineColor?: string;
  shineSpeed?: number;
  shineWidth?: number;
  shineGlow?: number;
  followPointer?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface StrokeTextBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DashPattern {
  array: string;
  period: number;
}

const DEFAULT_TEXT = 'Draw Attention';
const SHADOW_OPACITY = 0.5;

const getWipeFrames = (box: StrokeTextBox, wipeFrom: StrokeTextWipeFrom) => {
  const end = { x: box.x, y: box.y, width: box.width, height: box.height };
  if (wipeFrom === 'right') return { start: { ...end, x: box.x + box.width, width: 0 }, end };
  if (wipeFrom === 'top') return { start: { ...end, height: 0 }, end };
  if (wipeFrom === 'bottom') return { start: { ...end, y: box.y + box.height, height: 0 }, end };
  return { start: { ...end, width: 0 }, end };
};

const getDashPattern = (strokeStyle: StrokeTextStyle, dashLength: number, strokeWidth: number): DashPattern | null => {
  const width = Math.max(Number(strokeWidth) || 0, 0.1);
  const length = Math.max(Number(dashLength) || 0, 1);
  if (strokeStyle === 'dotted') {
    const gap = Math.max(length, width * 1.8);
    return { array: `0 ${gap}`, period: gap };
  }
  if (strokeStyle === 'dashed') {
    const on = Math.max(length - width, 0.5);
    const off = length * 0.6 + width;
    return { array: `${on} ${off}`, period: on + off };
  }
  return null;
};

export const StrokeText = ({
  text = DEFAULT_TEXT,
  strokeColor,
  fillColor,
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = 'power2.out',
  trigger = 'mount',
  fillMode = 'wipe',
  wipeFrom = 'left',
  fontSize = 128,
  fontWeight = 800,
  fontFamily = 'inherit',
  letterSpacing = -4,
  reverse = false,
  strokeStyle = 'solid',
  dashLength = 10,
  marching = false,
  hoverRedraw = false,
  shadow = false,
  shadowColor,
  gdgColors = false,
  gdgColorMode = 'gradient',
  isDark = false,
  shiny = false,
  shineColor = '#ffffff',
  shineSpeed = 2.4,
  shineWidth = 22,
  shineGlow = 0.25,
  followPointer = true,
  className = '',
  style = {}
}: StrokeTextProps) => {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const strokeTextRef = useRef<SVGTextElement | null>(null);
  const wipeRectRef = useRef<SVGRectElement | null>(null);
  const shadowRef = useRef<SVGFEDropShadowElement | null>(null);
  const stop0Ref = useRef<SVGStopElement | null>(null);
  const stop1Ref = useRef<SVGStopElement | null>(null);
  const stop2Ref = useRef<SVGStopElement | null>(null);

  const [box, setBox] = useState<StrokeTextBox | null>(null);

  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const wipeId = `stroke-text-wipe-${baseId}`;
  const revealId = `stroke-text-reveal-${baseId}`;
  const erodeId = `stroke-text-erode-${baseId}`;
  const shadowId = `stroke-text-shadow-${baseId}`;
  const gdgGradId = `stroke-text-gdg-grad-${baseId}`;
  const shineGradId = `stroke-text-shine-${baseId}`;
  const shineGlowId = `stroke-text-shine-glow-${baseId}`;

  // Authentic Google 4-Color Brand Palette
  // Light: 🔵 #4285F4 | 🔴 #EA4335 | 🟡 #FBBC04 | 🟢 #34A853
  // Dark:  🔵 #8AB4F8 | 🔴 #F28B82 | 🟡 #FDD663 | 🟢 #81C995
  const gdgPalette = useMemo(
    () => (isDark ? ['#8ab4f8', '#f28b82', '#fdd663', '#81c995'] : ['#4285F4', '#EA4335', '#FBBC04', '#34A853']),
    [isDark]
  );

  const effectiveStrokeColor = useMemo(() => {
    if (strokeColor && strokeColor !== 'gdg') return strokeColor;
    if (gdgColors) {
      return gdgColorMode === 'gradient' ? `url(#${gdgGradId})` : gdgPalette[0];
    }
    return isDark ? '#8ab4f8' : '#4285F4';
  }, [strokeColor, gdgColors, gdgColorMode, gdgGradId, gdgPalette, isDark]);

  const effectiveFillColor = useMemo(() => {
    if (fillColor && fillColor !== 'gdg') return fillColor;
    if (gdgColors) {
      return gdgColorMode === 'gradient' ? `url(#${gdgGradId})` : gdgPalette[0];
    }
    return isDark ? '#ffffff' : '#202124';
  }, [fillColor, gdgColors, gdgColorMode, gdgGradId, gdgPalette, isDark]);

  const characters = useMemo(() => Array.from(String(text ?? '')), [text]);

  const wordColors = useMemo(() => {
    if (!gdgColors || gdgColorMode !== 'words') return null;
    let wordIdx = 0;
    const colors: string[] = [];
    for (let i = 0; i < characters.length; i++) {
      const ch = characters[i];
      if (ch === ' ' && i > 0 && characters[i - 1] !== ' ') {
        colors.push('transparent');
        wordIdx++;
      } else {
        colors.push(gdgPalette[wordIdx % gdgPalette.length]);
      }
    }
    return colors;
  }, [characters, gdgColors, gdgColorMode, gdgPalette]);

  const dash = Math.max(fontSize * 7, 200);
  const pattern = getDashPattern(strokeStyle, dashLength, strokeWidth);
  const dashArray = pattern ? pattern.array : null;
  const dashPeriod = pattern ? pattern.period : 0;
  const lift = fontSize * 0.06;
  const softness = fontSize * 0.016;
  const castShadow = shadow && fillMode !== 'none';

  const fontStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: `${letterSpacing}px`
    }),
    [fontFamily, fontSize, fontWeight, letterSpacing]
  );

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !strokeTextRef.current) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;
      let bbox: DOMRect | undefined;
      try {
        bbox = strokeTextRef.current.getBBox();
      } catch {
        return;
      }
      if (!bbox || !bbox.width) return;

      const pad = Math.max(Number(strokeWidth) || 1, fontSize * 0.1);
      const next = {
        x: bbox.x - pad,
        y: bbox.y - pad,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2
      };

      setBox(prev =>
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.width - next.width) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5 &&
        Math.abs(prev.height - next.height) < 0.5
          ? prev
          : next
      );
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(root);
    window.addEventListener('resize', measure);

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [characters, fontFamily, fontSize, fontWeight, letterSpacing, strokeWidth]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (typeof window === 'undefined' || !root || !box) return undefined;

    const strokes = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'));
    const fills = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'));
    const wipe = wipeRectRef.current;
    const outline = strokeTextRef.current;
    const drop = shadowRef.current;
    if (!strokes.length) return undefined;

    const fillEnabled = fillMode !== 'none';
    const useWipe = fillEnabled && fillMode === 'wipe';
    const fillDuration = Math.max(0.4, drawDuration * 0.5);
    const staggerConfig: number | gsap.StaggerVars = reverse ? { each: stagger, from: 'end' as const } : stagger;
    const frames = getWipeFrames(box, wipeFrom);
    const lifted = { dx: lift, dy: lift, 'flood-opacity': SHADOW_OPACITY };
    const grounded = { dx: 0, dy: 0, 'flood-opacity': 0 };
    const targets = [...strokes, ...fills, wipe, drop].filter(Boolean);

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash, strokeOpacity: 1 });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: frames.start });
      if (drop) gsap.set(drop, { attr: grounded });
    };

    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0, strokeOpacity: 1 });
      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: fillEnabled ? frames.end : frames.start });
      if (drop) gsap.set(drop, { attr: fillEnabled ? lifted : grounded });
    };

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setEnd();
      return () => gsap.killTweensOf(targets);
    }

    const build = () => {
      setStart();
      const looping = trigger === 'loop';
      const tl = gsap.timeline({
        paused: true,
        repeat: looping ? -1 : 0,
        repeatDelay: looping ? 0.9 : 0,
        yoyo: looping,
        defaults: { overwrite: 'auto' }
      });

      tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);

      if (useWipe && wipe) {
        tl.to(wipe, { attr: frames.end, duration: fillDuration, ease: 'power2.inOut' }, drawDuration + fillDelay);
      } else if (fillEnabled) {
        tl.to(
          fills,
          { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig },
          drawDuration + fillDelay
        );
      }

      if (drop && fillEnabled) {
        tl.to(
          drop,
          { attr: lifted, duration: fillDuration * 1.4, ease: 'power3.out' },
          drawDuration + fillDelay + fillDuration * 0.3
        );
      }

      return tl;
    };

    let timeline: gsap.core.Timeline | null = null;
    let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
    let redraw: gsap.core.Timeline | null = null;
    const listeners: (() => void)[] = [];

    const listen = (handler: () => void) => {
      root.addEventListener('pointerenter', handler);
      listeners.push(handler);
    };

    if (trigger === 'hover') {
      setEnd();
      listen(() => {
        timeline?.kill();
        timeline = build();
        timeline.play(0);
      });
    } else {
      timeline = build();
      if (trigger === 'scroll') {
        scrollTrigger = ScrollTrigger.create({
          trigger: root,
          start: 'top 82%',
          once: true,
          onEnter: () => timeline?.play(0)
        });
      } else {
        timeline.play(0);
      }

      if (hoverRedraw && trigger !== 'loop') {
        listen(() => {
          if (!timeline || timeline.progress() < 1 || redraw?.isActive()) return;
          redraw?.kill();
          redraw = gsap
            .timeline()
            .to(strokes, { strokeOpacity: 0, duration: 0.2, ease: 'power1.out' })
            .set(strokes, { strokeDashoffset: dash, strokeOpacity: 1 })
            .to(strokes, { strokeDashoffset: 0, duration: drawDuration * 0.8, ease, stagger: staggerConfig });
        });
      }
    }

    const march =
      dashArray && marching && outline
        ? gsap.fromTo(
            outline,
            { strokeDashoffset: 0 },
            { strokeDashoffset: -dashPeriod, duration: dashPeriod / (fontSize * 0.22), ease: 'none', repeat: -1 }
          )
        : null;

    return () => {
      listeners.forEach(handler => root.removeEventListener('pointerenter', handler));
      scrollTrigger?.kill();
      timeline?.kill();
      redraw?.kill();
      march?.kill();
      gsap.killTweensOf(targets);
    };
  }, [
    box,
    dash,
    drawDuration,
    fillDelay,
    stagger,
    ease,
    trigger,
    fillMode,
    wipeFrom,
    reverse,
    dashArray,
    dashPeriod,
    marching,
    hoverRedraw,
    castShadow,
    lift,
    fontSize
  ]);

  useEffect(() => {
    if (!shiny) return;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let alive = true;
    let last = performance.now();
    let pos = -shineWidth * 1.5;
    let targetPos = pos;
    let inside = false;
    let sweepStart = last;
    const duration = Math.max(0.4, shineSpeed) * 1000;

    const onPointerEnter = (e: PointerEvent) => {
      inside = true;
      if (followPointer) {
        const rect = root.getBoundingClientRect();
        targetPos = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!followPointer) return;
      const rect = root.getBoundingClientRect();
      targetPos = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    };

    const onPointerLeave = () => {
      inside = false;
      sweepStart = performance.now();
    };

    root.addEventListener('pointerenter', onPointerEnter);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);

    const tick = (now: number) => {
      if (!alive) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      if (followPointer && inside) {
        pos += (targetPos - pos) * (1 - Math.exp(-dt * 14));
      } else {
        const elapsed = (now - sweepStart) % (duration + 1400);
        if (elapsed < duration) {
          const t = elapsed / duration;
          const ease = 0.5 - Math.cos(Math.PI * t) / 2;
          pos = -shineWidth * 1.5 + (100 + shineWidth * 3) * ease;
        } else {
          pos = 100 + shineWidth * 2;
        }
      }

      if (stop0Ref.current && stop1Ref.current && stop2Ref.current) {
        const half = shineWidth / 2;
        stop0Ref.current.setAttribute('offset', `${Math.max(0, pos - half).toFixed(2)}%`);
        stop1Ref.current.setAttribute('offset', `${Math.min(100, Math.max(0, pos)).toFixed(2)}%`);
        stop2Ref.current.setAttribute('offset', `${Math.min(100, pos + half).toFixed(2)}%`);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      root.removeEventListener('pointerenter', onPointerEnter);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [shiny, shineSpeed, shineWidth, followPointer]);

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;
  const wipeStart = box ? getWipeFrames(box, wipeFrom).start : null;
  const region: Partial<StrokeTextBox> = box
    ? { x: box.x - fontSize, y: box.y - fontSize, width: box.width + fontSize * 2, height: box.height + fontSize * 2 }
    : {};

  const outlineLayer = (
    <text
      key={dashArray ? 'pattern' : 'solid'}
      ref={strokeTextRef}
      className="select-none"
      x="0"
      y="0"
      fill="none"
      stroke={effectiveStrokeColor}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={dashArray || undefined}
      mask={dashArray ? `url(#${revealId})` : undefined}
      style={fontStyle}
    >
      {characters.map((char, index) => (
        <tspan
          data-stroke-char={dashArray ? undefined : true}
          key={`s-${index}`}
          stroke={wordColors ? wordColors[index] : undefined}
        >
          {char}
        </tspan>
      ))}
    </text>
  );

  return (
    <span
      ref={rootRef}
      className={`block w-full leading-[0] ${trigger === 'hover' ? 'cursor-pointer' : ''} ${className}`.trim()}
      style={style}
      role="img"
      aria-label={String(text ?? '')}
    >
      <svg
        className="mx-auto block h-auto w-full overflow-visible"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ maxWidth: `${box ? box.width : 600}px`, visibility: box ? undefined : 'hidden' }}
      >
        <defs>
          {gdgColors && (
            <linearGradient id={gdgGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gdgPalette[0]} />
              <stop offset="32%" stopColor={gdgPalette[1]} />
              <stop offset="68%" stopColor={gdgPalette[2]} />
              <stop offset="100%" stopColor={gdgPalette[3]} />
            </linearGradient>
          )}

          {shiny && (
            <>
              <linearGradient id={shineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop ref={stop0Ref} offset="0%" stopColor={shineColor} stopOpacity="0" />
                <stop ref={stop1Ref} offset="0%" stopColor={shineColor} stopOpacity="0.92" />
                <stop ref={stop2Ref} offset="0%" stopColor={shineColor} stopOpacity="0" />
              </linearGradient>

              {shineGlow > 0 && (
                <filter id={shineGlowId} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation={fontSize * 0.035} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              )}
            </>
          )}

          {fillMode === 'wipe' && wipeStart && (
            <clipPath id={wipeId} clipPathUnits="userSpaceOnUse">
              <rect
                ref={wipeRectRef}
                x={wipeStart.x}
                y={wipeStart.y}
                width={wipeStart.width}
                height={wipeStart.height}
              />
            </clipPath>
          )}

          {dashArray && (
            <filter id={erodeId} filterUnits="userSpaceOnUse" {...region}>
              <feMorphology operator="erode" radius={(Number(strokeWidth) || 1) / 2 + 0.75} />
            </filter>
          )}

          {dashArray && (
            <mask id={revealId} maskUnits="userSpaceOnUse" {...region}>
              <text
                x="0"
                y="0"
                fill="none"
                stroke="#fff"
                strokeWidth={(Number(strokeWidth) || 1) + 2}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={fontStyle}
              >
                {characters.map((char, index) => (
                  <tspan data-stroke-char key={`m-${index}`}>
                    {char}
                  </tspan>
                ))}
              </text>
              <text x="0" y="0" fill="#000" stroke="none" filter={`url(#${erodeId})`} style={fontStyle}>
                {characters.map((char, index) => (
                  <tspan key={`e-${index}`}>{char}</tspan>
                ))}
              </text>
            </mask>
          )}

          {castShadow && (
            <filter id={shadowId} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" {...region}>
              <feDropShadow
                ref={shadowRef}
                dx={lift}
                dy={lift}
                stdDeviation={softness}
                floodColor={shadowColor || effectiveStrokeColor}
                floodOpacity={SHADOW_OPACITY}
              />
            </filter>
          )}
        </defs>

        {!dashArray && outlineLayer}

        <g filter={castShadow ? `url(#${shadowId})` : undefined}>
          <text
            className="select-none"
            x="0"
            y="0"
            fill={effectiveFillColor}
            stroke="none"
            style={fontStyle}
            clipPath={fillMode === 'wipe' && wipeStart ? `url(#${wipeId})` : undefined}
          >
            {characters.map((char, index) => (
              <tspan
                data-fill-char
                key={`f-${index}`}
                fill={wordColors ? wordColors[index] : undefined}
              >
                {char}
              </tspan>
            ))}
          </text>
        </g>

        {shiny && (
          <g
            style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
            filter={shineGlow > 0 ? `url(#${shineGlowId})` : undefined}
          >
            <text
              className="select-none"
              x="0"
              y="0"
              fill={`url(#${shineGradId})`}
              stroke="none"
              style={fontStyle}
              clipPath={fillMode === 'wipe' && wipeStart ? `url(#${wipeId})` : undefined}
            >
              {characters.map((char, index) => (
                <tspan key={`sh-${index}`}>{char}</tspan>
              ))}
            </text>
          </g>
        )}

        {dashArray && outlineLayer}
      </svg>
    </span>
  );
};

export default StrokeText;


'use client';

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { KineticGrid } from './kinetic-grid';

export interface ScrollStackItemProps {
  children?: ReactNode;
  itemClassName?: string;
  style?: CSSProperties;
  id?: string;
  disableGrid?: boolean;
  gridVariant?: 'gdg' | 'blue' | 'monochrome';
}

export interface ScrollStackProps {
  children?: ReactNode;
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: number | string;
  itemScale?: number;
  baseScale?: number;
  dimAmount?: number;
  blurAmount?: number;
  tiltAmount?: number;
  rotationAmount?: number;
  holdDistance?: number;
  smoothScroll?: boolean;
  snap?: boolean;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface StackSettings {
  itemDistance: number;
  itemStackDistance: number;
  stackPosition: number | string;
  itemScale: number;
  baseScale: number;
  dimAmount: number;
  blurAmount: number;
  tiltAmount: number;
  rotationAmount: number;
  holdDistance: number;
  smoothScroll: boolean;
  snap: boolean;
  onStackComplete?: () => void;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const resolveOffset = (value: number | string, size: number) => {
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text.endsWith('%')) return (parseFloat(text) / 100) * size;
  return parseFloat(text) || 0;
};

const toLength = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const scrollsInside = (node: Element | null, stop: Element, delta: number) => {
  for (let element: Element | null = node; element && element !== stop; element = element.parentElement) {
    if (element.scrollHeight <= element.clientHeight + 1) continue;
    const overflow = getComputedStyle(element).overflowY;
    if (overflow !== 'auto' && overflow !== 'scroll') continue;
    if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) {
      return true;
    }
  }
  return false;
};

const CARD_SHADOW = [
  '0 0 0 1px rgba(0, 0, 0, 0.08)',
  '0 -10px 36px -12px rgba(0, 0, 0, 0.16)',
  '0 24px 48px -20px rgba(0, 0, 0, 0.28)'
].join(', ');

export const ScrollStackItem = ({
  children,
  itemClassName = '',
  style,
  id,
  disableGrid = false,
  gridVariant = 'gdg'
}: ScrollStackItemProps) => (
  <div
    id={id}
    className={`relative box-border w-full origin-top rounded-[24px] sm:rounded-[28px] border border-border-subtle bg-surface-card text-text-primary dark:bg-[#1c1d1f] overflow-hidden will-change-transform transition-colors duration-200 ${itemClassName}`.trim()}
    style={{
      boxShadow: CARD_SHADOW,
      scrollMarginTop: '100px',
      ...style
    }}
  >
    {!disableGrid && (
      <KineticGrid
        variant={gridVariant}
        className="absolute inset-0 pointer-events-none z-0"
      />
    )}
    <div className="relative z-10 w-full">{children}</div>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-black opacity-[var(--scroll-stack-dim,0)] transition-opacity duration-150"
    />
  </div>
);

export const ScrollStack = ({
  children,
  className = '',
  itemDistance = 140,
  itemStackDistance = 20,
  stackPosition = '80px',
  itemScale = 0.035,
  baseScale = 0.88,
  dimAmount = 0.22,
  blurAmount = 0,
  tiltAmount = 0,
  rotationAmount = 0,
  holdDistance = 220,
  smoothScroll = false,
  snap = false,
  useWindowScroll = true,
  onStackComplete
}: ScrollStackProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<StackSettings | null>(null);
  const scheduleRef = useRef<(() => void) | null>(null);
  const items = Children.toArray(children);

  useIsomorphicLayoutEffect(() => {
    settingsRef.current = {
      itemDistance,
      itemStackDistance,
      stackPosition,
      itemScale,
      baseScale,
      dimAmount,
      blurAmount,
      tiltAmount,
      rotationAmount,
      holdDistance,
      smoothScroll,
      snap,
      onStackComplete
    };
    scheduleRef.current?.();
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const end = endRef.current;
    if (!root || !inner || !end) return undefined;

    const windowed = useWindowScroll;
    const target = windowed ? window : root;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new Map<string, string | number>();
    let frame = 0;
    let glide = 0;
    let rest = 0;
    let complete = false;
    let gliding = false;
    let pressed = false;
    let current = 0;
    let goal = 0;
    let written = 0;
    let last = 0;
    let points: number[] = [];
    let reach = 0;

    // Cached layout metrics to prevent forced synchronous reflow during scroll
    let cachedHeights: number[] = [];
    let cachedStickyTops: number[] = [];
    let isMobile = false;

    const readScroll = () => (windowed ? window.scrollY : root.scrollTop);
    const maxScroll = () =>
      windowed ? document.documentElement.scrollHeight - window.innerHeight : root.scrollHeight - root.clientHeight;
    const writeScroll = (value: number) => {
      written = value;
      target.scrollTo({ top: value, behavior: 'instant' });
    };

    const write = <T extends string | number>(key: string, value: T, apply: (value: T) => void) => {
      if (cache.get(key) === value) return false;
      cache.set(key, value);
      apply(value);
      return true;
    };

    // Computes and writes slot sticky top offsets ONLY on resize / mount (0 layout thrashing on scroll)
    const updateLayoutMetrics = () => {
      const settings = settingsRef.current;
      const slots = (Array.from(inner.children) as HTMLElement[]).filter(child =>
        child.hasAttribute('data-stack-slot')
      );
      if (!settings || !slots.length) return;

      const viewHeight = windowed ? window.innerHeight : root.clientHeight;
      const stackTop = resolveOffset(settings.stackPosition, viewHeight);
      const offset = settings.itemStackDistance;
      isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);

      // Consistent uniform sticky top pinning across all cards
      const effectiveStackTop = isMobile ? Math.min(stackTop, 68) : stackTop;
      const effectiveOffset = isMobile ? 12 : offset;

      cachedHeights = slots.map(slot => slot.offsetHeight);
      cachedStickyTops = cachedHeights.map((_, i) => effectiveStackTop + i * effectiveOffset);

      slots.forEach((slot, i) => {
        write(`slotTop${i}`, `${cachedStickyTops[i]}px`, value => {
          slot.style.top = value;
        });
      });

      const padTop = windowed ? 0 : effectiveStackTop;
      const endHeight = windowed
        ? Math.max(settings.holdDistance, viewHeight * 0.4)
        : settings.holdDistance + Math.max(0, viewHeight - cachedStickyTops[cachedStickyTops.length - 1] - (cachedHeights[cachedHeights.length - 1] || 0));

      write('padTop', padTop, value => {
        inner.style.paddingTop = `${value}px`;
      });
      write('endHeight', endHeight, value => {
        end.style.height = `${value}px`;
      });
    };

    const update = () => {
      frame = 0;
      const settings = settingsRef.current;
      const slots = (Array.from(inner.children) as HTMLElement[]).filter(child =>
        child.hasAttribute('data-stack-slot')
      );
      if (!settings || !slots.length) return;

      if (!cachedHeights.length || cachedHeights.length !== slots.length) {
        updateLayoutMetrics();
      }

      const viewHeight = windowed ? window.innerHeight : root.clientHeight;
      const viewTop = windowed ? 0 : root.getBoundingClientRect().top + root.clientTop;
      const stackTop = isMobile ? Math.min(resolveOffset(settings.stackPosition, viewHeight), 68) : resolveOffset(settings.stackPosition, viewHeight);
      const offset = isMobile ? 12 : settings.itemStackDistance;

      // READ PHASE ONLY: Read tops directly without preceding style mutations (zero forced reflow)
      const tops = slots.map(slot => slot.getBoundingClientRect().top);

      let flow = inner.getBoundingClientRect().top - viewTop + readScroll();
      points = cachedHeights.map((height, i) => {
        const point = flow - stackTop - i * offset;
        flow += height + settings.itemDistance;
        return point;
      });
      reach = Math.max(40, ((cachedHeights[0] || 400) + settings.itemDistance - offset) / 2);

      // Uniform progressive card stacking: each card enters and stacks identically
      const depths = slots.map(() => 0);
      let lastCover = 0;
      for (let j = 1; j < slots.length; j++) {
        const pinBefore = viewTop + cachedStickyTops[j - 1];
        const start = pinBefore + (cachedHeights[j - 1] || 400);
        const endPin = viewTop + cachedStickyTops[j];
        const span = Math.max(1, start - endPin);
        const cover = Math.min(1, Math.max(0, (start - tops[j]) / span));
        for (let i = 0; i < j; i++) depths[i] += cover;
        lastCover = cover;
      }

      const dimStep = Math.min(Math.max(settings.dimAmount, 0), 1);

      // WRITE PHASE: Apply GPU hardware-accelerated transforms
      slots.forEach((slot, i) => {
        const card = slot.firstElementChild as HTMLElement | null;
        if (!card) return;
        const depth = depths[i];
        const lean = Math.min(depth, 1);
        const scale = Math.max(Math.min(settings.baseScale, 1), 1 - depth * settings.itemScale);
        const dim = 1 - Math.pow(1 - dimStep, depth);

        // Hardware-accelerated 2D transform on mobile or when tilt/rotation is zero
        let transform = '';
        if (depth >= 0.0005) {
          if (isMobile || (settings.tiltAmount === 0 && settings.rotationAmount === 0)) {
            transform = `translate3d(0, 0, 0) scale(${scale.toFixed(4)})`;
          } else {
            const tilt = -lean * settings.tiltAmount;
            const turn = lean * settings.rotationAmount * (i % 2 ? -1 : 1);
            transform = `perspective(1200px) rotateX(${tilt.toFixed(2)}deg) rotate(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          }
        }

        write(`transform${i}`, transform, value => {
          card.style.transform = value;
        });

        if (settings.blurAmount > 0) {
          const blur = depth * settings.blurAmount;
          write(`filter${i}`, blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '', value => {
            card.style.filter = value;
          });
        }

        write(`dim${i}`, dim.toFixed(3), value => {
          card.style.setProperty('--scroll-stack-dim', value);
        });

        // Layer culling: hide cards buried under 2 or more cards to save mobile GPU rasterization
        const isHidden = depth >= 2.0;
        write(`vis${i}`, isHidden ? 'hidden' : 'visible', value => {
          card.style.visibility = value;
        });
      });

      const done = slots.length > 1 && lastCover >= 0.999;
      if (done !== complete) {
        complete = done;
        if (done) settings.onStackComplete?.();
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      updateLayoutMetrics();
      schedule();
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (Math.abs(readScroll() - written) > 2) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      current += (goal - current) * (1 - Math.pow(0.9, dt * 60));
      if (Math.abs(goal - current) < 0.5) current = goal;
      writeScroll(current);
      if (current === goal) {
        gliding = false;
        glide = 0;
        settleSoon();
        return;
      }
      glide = requestAnimationFrame(step);
    };

    const glideTo = (value: number) => {
      goal = Math.min(Math.max(value, 0), maxScroll());
      if (motion.matches) {
        writeScroll(goal);
        return;
      }
      if (gliding) return;
      gliding = true;
      current = readScroll();
      written = current;
      last = performance.now();
      glide = requestAnimationFrame(step);
    };

    const settle = () => {
      rest = 0;
      if (!settingsRef.current?.snap || gliding || pressed || !points.length) return;
      const now = readScroll();
      const nearest = points.reduce((best, point) => (Math.abs(point - now) < Math.abs(best - now) ? point : best));
      const gap = Math.abs(nearest - now);
      if (gap > 1 && gap < reach) glideTo(nearest);
    };

    const settleSoon = () => {
      window.clearTimeout(rest);
      rest = window.setTimeout(settle, 140);
    };

    const onScroll = () => {
      schedule();
      if (!gliding) settleSoon();
    };

    const onWheel = (input: Event) => {
      const event = input as WheelEvent;
      if (!settingsRef.current?.smoothScroll || motion.matches || event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const page = windowed ? window.innerHeight : root.clientHeight;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page : 1);
      if (!delta || scrollsInside(event.target as Element | null, windowed ? document.body : root, delta)) return;
      const base = gliding ? goal : readScroll();
      if ((delta < 0 && base <= 0) || (delta > 0 && base >= maxScroll() - 0.5)) return;
      event.preventDefault();
      window.clearTimeout(rest);
      glideTo(base + delta);
    };

    const onPress = () => {
      pressed = true;
      window.clearTimeout(rest);
    };

    const onRelease = () => {
      if (!pressed) return;
      pressed = false;
      settleSoon();
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(root);
    observer.observe(inner);
    target.addEventListener('scroll', onScroll, { passive: true });
    target.addEventListener('wheel', onWheel, { passive: true });
    target.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });
    window.addEventListener('pointercancel', onRelease, { passive: true });
    window.addEventListener('resize', onResize);
    scheduleRef.current = onResize;
    onResize();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(glide);
      window.clearTimeout(rest);
      observer.disconnect();
      target.removeEventListener('scroll', onScroll);
      target.removeEventListener('wheel', onWheel);
      target.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
      window.removeEventListener('resize', onResize);
      scheduleRef.current = null;
    };
  }, [useWindowScroll]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${useWindowScroll ? '' : 'h-full overflow-x-hidden overflow-y-auto'} ${className}`.trim()}
    >
      <div ref={innerRef} className="relative max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {items.map((child, index) => {
          const gap = itemDistance - (items.length - index) * itemStackDistance;
          return (
            <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
              {index > 0 && (
                <div aria-hidden="true" style={{ height: Math.max(0, gap), marginTop: Math.min(0, gap) }} />
              )}
              <div
                data-stack-slot=""
                className="sticky"
                style={{
                  top: `calc(${toLength(stackPosition)} + ${index * itemStackDistance}px)`,
                  marginBottom: (items.length - 1 - index) * itemStackDistance,
                  zIndex: index + 1
                }}
              >
                {child}
              </div>
            </Fragment>
          );
        })}
        <div ref={endRef} aria-hidden="true" />
      </div>
    </div>
  );
};

export default ScrollStack;
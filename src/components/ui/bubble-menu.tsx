'use client';

import React, { type CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

export type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

export const DEFAULT_GDG_ITEMS: MenuItem[] = [
  {
    label: 'About',
    href: '/#about',
    ariaLabel: 'About GDG on Campus BPPIMT',
    rotation: -6,
    hoverStyles: { bgColor: '#4285F4', textColor: '#ffffff' } // Google Blue
  },
  {
    label: 'Tracks',
    href: '/#tracks',
    ariaLabel: 'Specialized Technical Tracks',
    rotation: 6,
    hoverStyles: { bgColor: '#EA4335', textColor: '#ffffff' } // Google Red
  },
  {
    label: 'Events',
    href: '/events',
    ariaLabel: 'Community Events Hub',
    rotation: -4,
    hoverStyles: { bgColor: '#FBBC04', textColor: '#202124' } // Google Yellow
  },
  {
    label: 'Team',
    href: '/team',
    ariaLabel: 'Organizers and Leads',
    rotation: 6,
    hoverStyles: { bgColor: '#34A853', textColor: '#ffffff' } // Google Green
  },
  {
    label: 'FAQ',
    href: '/#faq',
    ariaLabel: 'Frequently Asked Questions',
    rotation: -6,
    hoverStyles: { bgColor: '#4285F4', textColor: '#ffffff' } // Google Blue
  }
];

export function BubbleMenu({
  onMenuClick,
  className = '',
  style,
  menuAriaLabel = 'Toggle navigation menu',
  items = DEFAULT_GDG_ITEMS,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.1
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const menuItems = items?.length ? items : DEFAULT_GDG_ITEMS;

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
    onMenuClick?.(false);
  };

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // GSAP animation for bubbles
  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.04, 0.04);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            '-=' + animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 20,
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  // Set rotation on resize
  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  const pillBg = isDark ? '#202124' : '#FFFFFF';
  const pillColor = isDark ? '#E8EAED' : '#202124';
  const pillBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <>
      <style>{`
        .bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
          margin-left: calc(100% / 6);
        }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
          margin-left: calc(100% / 3);
        }
        @media (min-width: 900px) {
          .bubble-menu-items .pill-link {
            transform: rotate(var(--item-rot));
          }
          .bubble-menu-items .pill-link:hover {
            transform: rotate(var(--item-rot)) scale(1.06);
            background: var(--hover-bg) !important;
            color: var(--hover-color) !important;
            border-color: transparent !important;
          }
          .bubble-menu-items .pill-link:active {
            transform: rotate(var(--item-rot)) scale(.94);
          }
        }
        @media (max-width: 899px) {
          .bubble-menu-items {
            padding: 80px 20px 40px;
            align-items: center;
          }
          .bubble-menu-items .pill-list {
            row-gap: 12px;
          }
          .bubble-menu-items .pill-list .pill-col {
            flex: 0 0 100% !important;
            margin-left: 0 !important;
            overflow: visible;
          }
          .bubble-menu-items .pill-link {
            font-size: clamp(1.4rem, 4vw, 2.2rem) !important;
            padding: 16px 0 !important;
            min-height: 64px !important;
          }
          .bubble-menu-items .pill-link:hover {
            transform: scale(1.04);
            background: var(--hover-bg) !important;
            color: var(--hover-color) !important;
            border-color: transparent !important;
          }
          .bubble-menu-items .pill-link:active {
            transform: scale(.96);
          }
        }
      `}</style>

      {/* Hamburger Toggle Button */}
      <button
        type="button"
        className={`relative z-[1002] w-10 h-10 rounded-full flex flex-col items-center justify-center border border-border-subtle bg-surface-card hover:bg-surface-subtle text-text-primary transition-all cursor-pointer shadow-sm ${className}`.trim()}
        style={style}
        onClick={handleToggle}
        aria-label={menuAriaLabel}
        aria-expanded={isMenuOpen}
      >
        <span
          className="block rounded-[2px] transition-transform duration-300"
          style={{
            width: 20,
            height: 2,
            backgroundColor: 'currentColor',
            transform: isMenuOpen ? 'translateY(3px) rotate(45deg)' : 'none'
          }}
        />
        <span
          className="block rounded-[2px] transition-transform duration-300"
          style={{
            marginTop: '4px',
            width: 20,
            height: 2,
            backgroundColor: 'currentColor',
            transform: isMenuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none'
          }}
        />
      </button>

      {/* Full-Screen Bubble Menu Overlay */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className="bubble-menu-items fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-md dark:bg-black/65 transition-opacity"
          aria-hidden={!isMenuOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <ul
            className="pill-list list-none m-0 px-6 w-full max-w-[1200px] mx-auto flex flex-wrap gap-x-0 gap-y-3 pointer-events-auto"
            role="menu"
            aria-label="Navigation links"
          >
            {menuItems.map((item, idx) => (
              <li
                key={item.label}
                role="none"
                className="pill-col flex justify-center items-stretch [flex:0_0_calc(100%/3)] box-border px-2"
              >
                <Link
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  onClick={handleClose}
                  className="pill-link w-full rounded-[999px] no-underline shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center relative transition-[background,color,border-color,transform] duration-300 ease-out box-border whitespace-nowrap overflow-hidden font-heading font-bold"
                  style={
                    {
                      ['--item-rot']: `${item.rotation ?? 0}deg`,
                      ['--hover-bg']: item.hoverStyles?.bgColor || '#4285F4',
                      ['--hover-color']: item.hoverStyles?.textColor || '#ffffff',
                      background: pillBg,
                      color: pillColor,
                      border: `1px solid ${pillBorder}`,
                      minHeight: '110px',
                      padding: 'clamp(1.5rem, 2.5vw, 3.5rem) 0',
                      fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)',
                      willChange: 'transform'
                    } as CSSProperties
                  }
                  ref={(el) => {
                    bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label inline-block"
                    style={{
                      willChange: 'transform, opacity',
                      height: '1.2em',
                      lineHeight: 1.2
                    }}
                    ref={(el) => {
                      labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default BubbleMenu;


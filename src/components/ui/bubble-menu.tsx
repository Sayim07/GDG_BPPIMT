'use client';

import React, { type CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import {
  Globe,
  Linkedin,
  Github,
  MessageCircle,
  Instagram,
  Twitter,
  ArrowUpRight,
  ArrowLeft
} from 'lucide-react';
import chapterConfig from '@/data/chapter.json';
import { ChapterConfig } from '@/types/schema';

export type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  isSocial?: boolean;
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
  },
  {
    label: 'Social',
    href: '#social',
    ariaLabel: 'Official Social Media & Community Channels',
    rotation: 4,
    isSocial: true,
    hoverStyles: { bgColor: '#EA4335', textColor: '#ffffff' } // Google Red
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
  staggerDelay = 0.08
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSocialView, setIsSocialView] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chapter = chapterConfig as ChapterConfig;
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const socialCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const menuItems = items?.length ? items : DEFAULT_GDG_ITEMS;

  const socialChannels = [
    {
      name: 'Official Chapter',
      handle: 'GDG on Campus BPPIMT',
      description: 'RSVP to upcoming events, join workshops & become a member',
      href:
        chapter.communityUrl ||
        chapter.socials?.community ||
        'https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/',
      icon: Globe,
      accentColor: '#4285F4',
      badge: 'Google Community'
    },
    {
      name: 'LinkedIn',
      handle: 'GDG on Campus BPPIMT',
      description: 'Professional updates, leadership spotlights & network milestones',
      href: chapter.socials?.linkedin || 'https://www.linkedin.com/company/gdg-bppimt/',
      icon: Linkedin,
      accentColor: '#0A66C2',
      badge: 'Professional'
    },
    {
      name: 'GitHub',
      handle: 'Sayim07 / GDG_BPPIMT',
      description: 'Official chapter repository, open-source projects & codebases',
      href: chapter.socials?.github || 'https://github.com/Sayim07/GDG_BPPIMT',
      icon: Github,
      accentColor: isDark ? '#F0F6FC' : '#24292F',
      badge: 'Open Source'
    },
    {
      name: 'WhatsApp Community',
      handle: 'Official Discussion Group',
      description: 'Instant student discussions, hackathon alerts & study jams',
      href: chapter.socials?.whatsapp || 'https://chat.whatsapp.com/invite/gdg-bppimt',
      icon: MessageCircle,
      accentColor: '#25D366',
      badge: 'Instant Chat'
    },
    {
      name: 'Instagram',
      handle: '@gdg_bppimt',
      description: 'Behind-the-scenes event photography, reels & announcements',
      href: chapter.socials?.instagram || 'https://www.instagram.com/gdg_bppimt',
      icon: Instagram,
      accentColor: '#E4405F',
      badge: 'Visuals'
    },
    {
      name: 'X (Twitter)',
      handle: '@gdg_bppimt',
      description: 'Live event coverage, Google developer news & tech tips',
      href: chapter.socials?.twitter || 'https://x.com/gdg_bppimt',
      icon: Twitter,
      accentColor: '#1DA1F2',
      badge: 'Updates'
    }
  ];

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) {
      setShowOverlay(true);
      setIsSocialView(false);
    }
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
    setIsSocialView(false);
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
        if (isSocialView) {
          setIsSocialView(false);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isSocialView]);

  // GSAP animation for bubbles
  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!overlay) return;

    if (isMenuOpen && !isSocialView) {
      gsap.set(overlay, { display: 'flex' });
      if (bubbles.length) {
        gsap.killTweensOf([...bubbles, ...labels]);
        gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
        gsap.set(labels, { y: 24, autoAlpha: 0 });

        bubbles.forEach((bubble, i) => {
          const delay = i * staggerDelay + gsap.utils.random(-0.03, 0.03);
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
      }
    } else if (!isMenuOpen && showOverlay) {
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
          setIsSocialView(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, isSocialView, animationEase, animationDuration, staggerDelay]);

  // GSAP animation for social cards when entering social view
  useEffect(() => {
    if (isMenuOpen && isSocialView) {
      const cards = socialCardsRef.current.filter(Boolean) as HTMLAnchorElement[];
      if (cards.length) {
        gsap.killTweensOf(cards);
        gsap.set(cards, { y: 30, opacity: 0, scale: 0.96 });
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.38,
          stagger: 0.06,
          ease: 'power3.out'
        });
      }
    }
  }, [isMenuOpen, isSocialView]);

  // Set rotation on resize
  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen && !isSocialView) {
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
  }, [isMenuOpen, isSocialView, menuItems]);

  const pillBg = isDark ? '#202124' : '#FFFFFF';
  const pillColor = isDark ? '#E8EAED' : '#202124';
  const pillBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <>
      <style>{`
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
        className={`relative z-[1002] w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center border border-border-subtle bg-surface-card hover:bg-surface-subtle text-text-primary transition-all cursor-pointer shadow-sm ${className}`.trim()}
        style={style}
        onClick={handleToggle}
        aria-label={menuAriaLabel}
        aria-expanded={isMenuOpen}
      >
        <span
          className="block rounded-[2px] transition-transform duration-300"
          style={{
            width: 16,
            height: 1.5,
            backgroundColor: 'currentColor',
            transform: isMenuOpen ? 'translateY(2.75px) rotate(45deg)' : 'none'
          }}
        />
        <span
          className="block rounded-[2px] transition-transform duration-300"
          style={{
            marginTop: '3.5px',
            width: 16,
            height: 1.5,
            backgroundColor: 'currentColor',
            transform: isMenuOpen ? 'translateY(-2.75px) rotate(-45deg)' : 'none'
          }}
        />
      </button>

      {/* Full-Screen Bubble Menu Overlay */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className="bubble-menu-items fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-md dark:bg-black/75 transition-opacity overflow-y-auto"
          aria-hidden={!isMenuOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          {isSocialView ? (
            /* Sub-View: Social Media & Community Channels */
            <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-12 flex flex-col items-center pointer-events-auto">
              {/* Header with Back button and Google 4-color accent */}
              <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsSocialView(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle bg-surface-card hover:bg-surface-subtle text-text-primary text-sm font-semibold transition-all cursor-pointer shadow-sm group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Menu</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gdg-blue" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gdg-red" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gdg-yellow" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gdg-green" />
                  <span className="ml-2 text-xs uppercase tracking-wider font-bold text-text-secondary">
                    Official Community & Socials
                  </span>
                </div>
              </div>

              {/* Grid of 6 Social Channels */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {socialChannels.map((channel, i) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.name}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      ref={(el) => {
                        socialCardsRef.current[i] = el;
                      }}
                      className="group relative flex flex-col justify-between p-6 rounded-2xl border border-border-subtle bg-surface-card hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Top accent glow on hover */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: channel.accentColor }}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${channel.accentColor}18`,
                              color: channel.accentColor
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
                            style={{
                              backgroundColor: `${channel.accentColor}15`,
                              color: channel.accentColor
                            }}
                          >
                            {channel.badge}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                          {channel.name}
                        </h3>
                        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                          {channel.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                        <span className="truncate max-w-[200px]">{channel.handle}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Main Menu View: 6 Balanced Bubble Pills in a 3x2 Grid */
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
                  {item.isSocial ? (
                    <button
                      type="button"
                      role="menuitem"
                      aria-label={item.ariaLabel || item.label}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSocialView(true);
                      }}
                      className="pill-link w-full rounded-[999px] no-underline shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center relative transition-[background,color,border-color,transform] duration-300 ease-out box-border whitespace-nowrap overflow-hidden font-heading font-bold cursor-pointer"
                      style={
                        {
                          ['--item-rot']: `${item.rotation ?? 0}deg`,
                          ['--hover-bg']: item.hoverStyles?.bgColor || '#EA4335',
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
                        bubblesRef.current[idx] = el as unknown as HTMLAnchorElement;
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
                    </button>
                  ) : (
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
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default BubbleMenu;

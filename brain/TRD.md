# Technical Requirements Document (TRD) — GDG on Campus BPPIMT

> **Reference:** Governed by [PRD.md §1](file:///s:/sayim/GDG-web/brain/PRD.md#L10) and [Rules.md §1](file:///s:/sayim/GDG-web/brain/Rules.md#L8).

---

## 1. System Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    Client Browser                          │
│     (Desktop, Tablet, Mobile — Viewport 320px to 2560px)   │
└───────────────────────────▲────────────────────────────────┘
                            │ HTTPS / Edge CDN Delivery
┌───────────────────────────┴────────────────────────────────┐
│               Next.js 15 (App Router)                      │
│  - React 19 / TypeScript / Tailwind CSS v3.4+              │
│  - next/font/local (Product Sans / Google Sans WOFF2)      │
│  - Lucide React (Icons)                                    │
│  - next-themes (Authentic Google Material Dark/Light)      │
│  - Agentation MCP (Localhost Developer Tooling only)       │
└───────────────────────────▲────────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────────┐
│              Data Layer (Zero-Server Contract)             │
│  - Strict Local JSON Datasets (/src/data/*.json)           │
│  - TypeScript Interface Verification (/src/types/schema.ts)│
│  - Static Asset Delivery via Next.js Public Assets         │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Selection

All tools selected below are **100% free / open source** with no required credit card or paid tiers.

| Layer | Technology | Version | Justification | Locked Default |
| :--- | :--- | :--- | :--- | :---: |
| **Framework** | **Next.js (App Router)** | `15.x` | Industry standard for React, zero-config SSR/SSG, automatic image optimization, built-in SEO metadata management. | **YES** |
| **Language** | **TypeScript** | `5.x` | Enforces data contracts from [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md), preventing runtime field errors. | **YES** |
| **Typography** | **Product Sans / Google Sans** | Local WOFF2 | Preloaded locally via `next/font/local` (`/public/fonts/`). Zero CLS, zero external CDN latency, authentic Google identity. | **YES** |
| **Styling** | **Tailwind CSS** | `3.4+` | Rapid utility-first styling, customized GDG brand token palette, zero runtime CSS overhead. | **YES** |
| **Icons** | **Lucide React** | Latest | Tree-shakeable, clean developer iconography matching Google Developer guidelines. | **YES** |
| **Theme** | **next-themes** | `0.4+` | Flicker-free dark/light mode switching using Tailwind CSS `class` strategy with authentic Google charcoal palette. | **YES** |
| **Dev Tooling** | **Agentation** | `3.1+` | Visual feedback MCP tooling active strictly on `localhost:3000` for real-time agent pair programming. | **YES** |
| **Hosting & CI/CD** | **Vercel** | Free Tier | Global edge CDN, automated previews, zero hosting cost. | **YES** |

---

## 3. Data Sources & External Services

| Service / Source | Access Method | Cost | Authentication Required | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Chapter Local JSON Data** | Local file imports (`@/data/*.json`) | $0 | None | Single source of truth for events, team, tracks, pillars, stats, and FAQs. See [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md). |
| **Official Chapter Page** | External Hyperlinks | $0 | None | Official Google Community platform (`gdg.community.dev`) where student RSVPs and member counts are managed. |
| **GitHub Public Repos** | Hyperlinks | $0 | None | Direct links to GDG BPPIMT chapter repositories and student projects. |
| **WhatsApp Community** | External Invite Hyperlinks | $0 | None | Student community gateway for campus announcements. |

---

## 4. Fixed Scope Parameters & Constants

```typescript
export const APP_CONFIG = {
  APP_NAME: "GDG on Campus BPPIMT",
  BRAND_TITLE: "Google Developer Group",
  BRAND_SUBTITLE: "B.P. Poddar Institute of Management and Technology",
  COLLEGE_FULL_NAME: "B.P. Poddar Institute of Management and Technology",
  COLLEGE_SHORT_NAME: "BPPIMT",
  LOCATION: "Kolkata, West Bengal, India",
  OFFICIAL_CHAPTER_URL: "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/",
  WHATSAPP_COMMUNITY_URL: "https://chat.whatsapp.com",
  GITHUB_ORG_URL: "https://github.com/Sayim07/GDG_BPPIMT",
  LINKEDIN_URL: "https://linkedin.com",
} as const;
```

---

## 5. Performance & Resource Constraints

1. **JavaScript Bundle Budget:** Total First Load JS < 150 KB (gzip). No heavy 3D canvas libraries (Three.js, Spline).
2. **Typography Optimization:** High-efficiency `.woff2` files preloaded locally via `next/font/local` to guarantee zero Cumulative Layout Shift (CLS = 0).
3. **No AI Slop:** Flat Google Material 3 surfaces; zero neon glow blobs (`shadow-[0_8px_30px_rgb(...)]`), zero glassmorphism blurs, and zero repetitive scroll-triggered fade animations.
4. **Independent Route Split:** `/events` and `/team` split into standalone Next.js App Router subroutes to reduce homepage bundle weight and offer clean direct URLs.

---

## 6. API & Contract Pointers
All JSON schemas, TypeScript interfaces, and mock dataset definitions are strictly governed by [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md). Any change to data properties must be updated in `Schema.md` before implementation in React components.

# TRD — GDG on Campus BPPIMT

> **Enforcement Notice:** The coding tool must not substitute a library, dataset, or service not listed here without flagging it as an assumption first.

---

## 1. Architecture Overview & Core Stack

The application is built as an ultra-fast, statically optimized Single Page / Hybrid Web Application using **Next.js 15 (App Router)**. Because this is an institutional community portal with frequent traffic spikes during event registrations, static site generation (SSG) with client-side interactivity is chosen to guarantee zero downtime, instant navigation, and zero server maintenance costs.

```
┌────────────────────────────────────────────────────────┐
│                   User Browser                         │
│   (Desktop, Tablet, Mobile / PWA Viewport)             │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
       Static HTML/CSS/JS       Client-side Filtering
        (CDN Edge Cache)         & Micro-animations
                │                        │
┌───────────────┴────────────────────────┴───────────────┐
│               Next.js 15 (App Router)                  │
│  - React 19 / TypeScript / Tailwind CSS v3.4+          │
│  - Lucide React (Icons)                                │
│  - shadcn/ui (Accessible Primitive Components)        │
│  - Framer Motion / 21st.dev UI Elements                │
│  - next-themes (Dark / Light Theme System)             │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│              Data Layer (Zero-Server Contract)         │
│  - Strict Local JSON Datasets (/src/data/*.json)       │
│  - Zod Schemas for Runtime Validation                  │
│  - Static Asset Delivery via Next.js Public Assets     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Selection

All tools selected below are **100% free / open source** with no required credit card or paid tiers.

| Layer | Technology | Version | Justification | Locked Default |
| :--- | :--- | :--- | :--- | :---: |
| **Framework** | **Next.js (App Router)** | `15.x` | Industry standard for React, zero-config SSR/SSG, automatic image optimization, built-in SEO metadata management. | **YES** |
| **Language** | **TypeScript** | `5.x` | Enforces data contracts from [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md), preventing runtime field errors. | **YES** |
| **Styling** | **Tailwind CSS** | `3.4+` | Rapid utility-first styling, customized GDG brand token palette, zero runtime CSS overhead. | **YES** |
| **UI Components** | **shadcn/ui** | Latest | Unstyled, copy-paste Radix UI primitives with full keyboard accessibility and theme support. | **YES** |
| **Animations** | **Framer Motion** | `11.x` | Smooth layout transitions, bento card hover states, and dynamic entry animations without heavy 3D overhead. | **YES** |
| **Icons** | **Lucide React** | Latest | Tree-shakeable, clean developer iconography matching Google Developer guidelines. | **YES** |
| **Theme** | **next-themes** | `0.4+` | Flicker-free dark/light mode switching using Tailwind CSS `class` strategy. | **YES** |
| **Hosting & CI/CD** | **Vercel / GitHub Pages** | Free Tier | Global edge CDN, automated previews on Git pull requests, zero hosting cost. | **YES** |

> **Architectural Decision Locked on Day 1:** Next.js 15 App Router is the locked default. Alternative options like raw Vite/SPA were rejected because Next.js provides out-of-the-box Open Graph image generation, search engine indexing (SEO), and native image optimization critical for a campus chapter site.

---

## 3. Data Sources & External Services

| Service / Source | Access Method | Cost | Authentication Required | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Chapter Local JSON Data** | Local file imports (`@/data/*.json`) | $0 | None | Single source of truth for events, team, domains, projects, and FAQs. See [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md). |
| **Google Community Page (Bevy)** | External Hyperlinks | $0 | None | Official Google platform where student RSVPs and member counts are managed. |
| **GitHub Public Repos** | Hyperlinks / Optional public API | $0 | None | Direct links to student projects and GDG BPPIMT chapter repositories. |
| **Discord / WhatsApp** | External Invite Hyperlinks | $0 | None | Community gateways for day-to-day discussion and announcements. |

---

## 4. Fixed Scope Parameters & Constants

These constants are immutable throughout the project lifecycle. They must be imported directly from `@/config/constants.ts`:

```typescript
export const APP_CONFIG = {
  APP_NAME: "GDG on Campus BPPIMT",
  COLLEGE_FULL_NAME: "B.P. Poddar Institute of Management and Technology",
  COLLEGE_SHORT_NAME: "BPPIMT",
  LOCATION: "Kolkata, West Bengal, India",
  OFFICIAL_CHAPTER_URL: "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/",
  DISCORD_INVITE_URL: "https://discord.gg/gdgbppimt",
  WHATSAPP_COMMUNITY_URL: "https://chat.whatsapp.com/gdgbppimt",
  GITHUB_ORG_URL: "https://github.com/gdg-bppimt",
  LINKEDIN_URL: "https://linkedin.com/company/gdg-bppimt",
  PRIMARY_EMAIL: "gdg.bppimt@gmail.com",
  MAX_EVENTS_DISPLAYED_HOME: 6,
  MAX_PROJECTS_DISPLAYED_HOME: 6,
} as const;
```

---

## 5. Performance & Resource Constraints

1. **JavaScript Bundle Budget:** Total First Load JS < 120 KB (gzip). No massive 3D engines (e.g., Three.js, Babylon.js) or bloated animation suites.
2. **Image Optimization:** All member avatars and event posters must use `@next/image` with explicit `width`, `height`, and `placeholder="blur"` using local low-poly SVGs.
3. **Font Loading:** Use `next/font/google` for zero-layout-shift font streaming (Plus Jakarta Sans or Inter as primary body, Google Sans lookalike for headings).
4. **Offline Resilience:** Ensure core pages render completely even on throttled 3G networks typical of campus Wi-Fi environments.

---

## 6. API & Contract Pointers
All JSON schemas, TypeScript interfaces, and mock dataset definitions are strictly governed by [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md). Any change to data properties must be committed to `Schema.md` before implementation in React components.

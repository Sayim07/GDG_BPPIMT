# AppFlow — GDG on Campus BPPIMT

> **Reference:** Governed by [PRD.md §4](file:///s:/sayim/GDG-web/brain/PRD.md#L45) and [TRD.md §1](file:///s:/sayim/GDG-web/brain/TRD.md#L10).

---

## 1. End-to-End Data & Processing Flow

```
[1. Content Creation / Updates]
       │  Developer updates local JSON datasets
       ▼
   /src/data/
     ├── events.json
     ├── team.json
     ├── domains.json
     ├── projects.json
     └── faq.json
       │
[2. Build Time Processing (Next.js 15 SSG)]
       │  Next.js statically generates routes at build time
       ▼
   /src/app/page.tsx (Landing Page)
   /src/app/events/page.tsx (Events Hub)
   /src/app/team/page.tsx (Team Directory)
   /src/app/projects/page.tsx (Projects Showcase)
       │
[3. Validation & Typing]
       │  Zod schemas parse & enforce data contracts (/src/types/schema.ts)
       ▼
   Verified React Components Rendered into Static HTML + CSS
       │
[4. Deployment & Edge Delivery]
       │  Static build uploaded to Vercel / GitHub Pages Edge CDN
       ▼
[5. Client Browser Navigation]
          User opens URL → Immediate 200 OK from Edge CDN (FCP < 1.0s)
          Client-side React rehydrates for interactive filtering & animations
```

---

## 2. Runtime & User Serving Flow

```
User visits https://gdgbppimt.vercel.app/
  │
  ├── 1. Edge CDN serves pre-rendered HTML/CSS + inlined fonts
  │      └── Browser paints Hero section instantaneously (Zero Layout Shift)
  │
  ├── 2. React Rehydration completes in background (<150ms)
  │      ├── Theme initialized via next-themes (respects OS dark/light preference)
  │      └── Framer Motion mounts micro-interactions
  │
  ├── 3. User Interaction Pathways:
         ├── A. Clicks "Join Community" → Smooth scroll to Community section or opens Join Modal
         ├── B. Explores "Domains" → Hover on Bento grid displays domain tech stack & workshops
         ├── C. Browses "Events" → Tabs filter between "Upcoming" and "Past"; click opens official RSVP (Bevy)
         ├── D. Inspects "Projects" → Filter by domain tag; click opens GitHub / Demo link
         └── E. Views "Team" → Filter by tier (Leads, Core, Mentors); hover reveals social links
```

---

## 3. Screen-Level Flow & Layout Hierarchy

### Primary Layout (`/src/app/layout.tsx`)
- **Top Navigation Bar:**
  - Left: GDG Brackets Logo + Brand Text `GDG on Campus BPPIMT` (Mandatory).
  - Center: Desktop Nav Links (`About`, `Domains`, `Events`, `Projects`, `Team`, `FAQ`).
  - Right: Theme Toggle (Sun/Moon) + Primary CTA Button `Join Us`.
  - Mobile: Hamburger Drawer with identical options.
- **Global Footer (`/src/components/footer.tsx`):**
  - Brand tagline: *"Connect, Learn, Grow with Google Developer Groups on Campus BPPIMT."*
  - Quick links to chapters, Google Developer Program, college website, and social links.
  - Copyright: `© 2026 GDG on Campus BPPIMT. An independent community program.`

---

### Home Page Sections Flow (`/src/app/page.tsx`)
1. **Hero Section (`/src/components/sections/hero.tsx`):**
   - Active status pill: `Google Developer Groups • BPPIMT Chapter`
   - Dynamic Heading: *"Empowering Campus Developers to Build the Future"*
   - Subtitle: Official student community at B.P. Poddar Institute of Management and Technology.
   - Dual CTAs: `Explore Events` (Primary Google Blue) and `Join Community` (Outline).
   - Dynamic visual: Interactive animated tech badges (AI/ML, Cloud, Web, Android).
2. **About & Chapter Impact (`/src/components/sections/about.tsx`):**
   - Mission Statement & Values: Connect, Learn, Grow.
   - Metric Badges: `500+ Members`, `25+ Workshops Hosted`, `10+ Hackathon Wins`, `5 Core Tracks`.
3. **Technology Domains Bento Grid (`/src/components/sections/domains.tsx`):**
   - 5 Domain cards styled with distinct Google color accents:
     - Blue: *Web & Cloud Development*
     - Red: *Artificial Intelligence & Machine Learning*
     - Yellow: *Android & Mobile Ecosystem*
     - Green: *Cybersecurity & Open Source*
4. **Featured Events (`/src/components/sections/events-preview.tsx`):**
   - Displays next 3 upcoming sessions or highlighted past workshops.
   - Filter chips: `All`, `Upcoming`, `Past`.
   - Link to full Events directory.
5. **Featured Projects (`/src/components/sections/projects-preview.tsx`):**
   - Showcase cards for top 3 student projects with GitHub stars, tech tags, and demo links.
6. **Core Team Preview (`/src/components/sections/team-preview.tsx`):**
   - Organizer, Tech Lead, and Domain Leads cards with LinkedIn, GitHub, and Twitter icons.
7. **Interactive FAQ (`/src/components/sections/faq.tsx`):**
   - Expandable Accordion answering common freshman questions.
8. **Community Gateway / CTA Banner (`/src/components/sections/cta-banner.tsx`):**
   - Discord and WhatsApp invite cards with live member badges.

---

## 4. Error & Edge-Case Handling Flows

| Edge Case | Trigger Condition | Handled State & UI Fallback | Reference |
| :--- | :--- | :--- | :--- |
| **No Upcoming Events** | `events.json` has 0 items with `status: "upcoming"` | Render a clean "Empty State" card: *"No upcoming events scheduled right now. Join our Discord to get notified first!"* with a direct Discord button. | [Schema.md §2.1](file:///s:/sayim/GDG-web/brain/Schema.md#L30) |
| **Missing Member Avatar** | Team member `avatarUrl` is empty or 404s | Fallback to initials avatar with Google brand background color matching their domain. | [TRD.md §5](file:///s:/sayim/GDG-web/brain/TRD.md#L80) |
| **Missing Project Demo Link** | Project only has a GitHub repository | "Live Demo" button is hidden gracefully; "View Code" button expands to full width. | [Schema.md §2.3](file:///s:/sayim/GDG-web/brain/Schema.md#L115) |
| **Invalid Route (404)** | User enters non-existent URL | Custom `not-found.tsx` page with GDG error badge and a "Return to GDG on Campus BPPIMT Home" button. | [Design.md §5](file:///s:/sayim/GDG-web/brain/Design.md#L110) |
| **Slow Network Connection** | Low-bandwidth campus connection | Skeleton loaders for event cards and team grid; CSS transitions defer until assets load. | [TRD.md §5](file:///s:/sayim/GDG-web/brain/TRD.md#L85) |

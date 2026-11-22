# AppFlow — GDG on Campus BPPIMT

> **Reference:** Governed by [PRD.md §4](file:///s:/sayim/GDG-web/brain/PRD.md#L45) and [TRD.md §1](file:///s:/sayim/GDG-web/brain/TRD.md#L10).

---

## 1. End-to-End Data & Processing Flow

```
[1. Content Creation / Updates]
       │  Developer updates local JSON datasets
       ▼
   /src/data/
     ├── chapter.json
     ├── tracks.json
     ├── pillars.json
     ├── events.json
     ├── team.json
     ├── stats.json
     └── faq.json
       │
[2. Build Time Processing (Next.js 15 SSG)]
       │  Next.js statically generates routes at build time
       ▼
   /src/app/page.tsx (Landing Page)
   /src/app/events/page.tsx (Dedicated Events Hub)
   /src/app/team/page.tsx (Dedicated Team Directory)
       │
[3. Validation & Typing]
       │  TypeScript contracts enforce data integrity (/src/types/schema.ts)
       ▼
   Verified React Components Rendered into Static HTML + CSS
       │
[4. Deployment & Edge Delivery]
       │  Static build uploaded to Vercel Edge CDN
       ▼
[5. Client Browser Navigation]
          User opens URL → Immediate 200 OK from Edge CDN (FCP < 1.0s)
          Zero Layout Shift using preloaded Product Sans WOFF2
```

---

## 2. Runtime & Routing Architecture

```
User visits https://gdgbppimt.vercel.app/
  │
  ├── 1. Edge CDN serves pre-rendered HTML/CSS with local Product Sans WOFF2
  │      └── Browser paints canvas instantaneously without FOUT
  │
  ├── 2. React Rehydration completes in background
  │      ├── Theme initialized via next-themes (light-first default, clean Google dark mode)
  │      └── Localhost developer tools (Agentation) mounted strictly if NODE_ENV === 'development'
  │
  ├── 3. Dedicated Route Navigation:
         ├── A. Navbar "Events" → Navigates to dedicated page /events (not an on-page jump)
         ├── B. Navbar "Team" → Navigates to dedicated page /team (not an on-page jump)
         ├── C. Navbar "About" / "Tracks" / "FAQ" → Navigates to /#about, /#tracks, /#faq
         ├── D. On Dedicated Pages (/events, /team) → "← Back to Home" returns user to /
         └── E. Home Page (/) → Preserves #events and #team sections for continuous scroll experience
```

---

## 3. Screen-Level Flow & Layout Hierarchy

### Top Navigation Bar (`/src/components/navbar.tsx`)
- **Brand Identity:** Authentic GDG 4-color brackets SVG logo + two-tier brand title:
  - Top Line: **`Google Developer Group`**
  - Sub-line: **`B.P. Poddar Institute of Management and Technology`**
- **Navigation Links:**
  - `About` (`/#about`)
  - `Tracks` (`/#tracks`)
  - `Events` (`/events`)
  - `Team` (`/team`)
  - `FAQ` (`/#faq`)
- **Right Actions:**
  - Clean Theme Switcher (Light / Google Material Dark)
  - `Join Chapter` external link to official chapter page.
- **Mobile:** Clean sliding drawer with identical navigation links.

### Home Page Sections (`/src/app/page.tsx`)
1. **Four-Color Accent Line:** 4px Google Quad-Color bar.
2. **Hero Section (`/src/components/sections/hero.tsx`):**
   - Clean semantic uppercase tag: `GOOGLE DEVELOPER GROUPS • BPPIMT CHAPTER`
   - Main Headline: *"Building the developer community at BPPIMT"*
   - Subtitle: Student-led community to connect, learn, and build with Google technologies.
   - Primary Action: `View Events →` (Google Blue button navigating to `/events`).
   - Secondary Action: `Meet the Team →` (Clean text link navigating to `/team`).
   - Flat stats metrics: Members, Workshops, Hackathons.
3. **Pillars Section (`/src/components/sections/pillars.tsx`):** Connect, Learn, Grow.
4. **Tracks Section (`/src/components/sections/tracks.tsx`):** Web & Cloud, AI & ML, Android & Mobile, Open Source & Security.
5. **Events Preview Section (`/src/components/sections/events.tsx`):** Upcoming events calendar with Gen-Z empty state announcement.
6. **Team Preview Section (`/src/components/sections/team.tsx`):** Chapter leadership showcase with Gen-Z empty state announcement.
7. **FAQ Section (`/src/components/sections/faq.tsx`):** Clean expandable accordion.
8. **Global Footer (`/src/components/footer.tsx`):** Independent student community disclaimer, copyright, and verified social links.

### Dedicated Events Hub (`/src/app/events/page.tsx`)
- Breadcrumb navigation: `← Back to Home`
- Complete Events calendar, filter, and official RSVP links.

### Dedicated Team Directory (`/src/app/team/page.tsx`)
- Breadcrumb navigation: `← Back to Home`
- Chapter Leads, Core Team, and Domain Mentors with LinkedIn, GitHub, and Twitter links.

---

## 4. Error & Edge-Case Handling Flows

| Edge Case | Trigger Condition | Handled State & UI Fallback | Reference |
| :--- | :--- | :--- | :--- |
| **No Upcoming Events** | `events.json` is empty array `[]` | Clean Google-style announcement: *"Something exciting is brewing in the lab. We’re curating hands-on workshops, cloud study jams, and hackathon prep for this semester."* with "Get Official Updates" button. | [Schema.md §2.1](file:///s:/sayim/GDG-web/brain/Schema.md#L30) |
| **Pending Team Roster** | `team.json` is empty array `[]` | Clean Google-style announcement: *"The crew will arrive soon to your feed. From tech leads building the architecture to domain mentors guiding AI, Cloud & Web..."* with "Connect on LinkedIn" button. | [Schema.md §2.2](file:///s:/sayim/GDG-web/brain/Schema.md#L70) |
| **Missing Member Avatar** | Team member `avatarUrl` is empty | High-contrast letter monogram fallback with `Product Sans` font. | [Design.md §3](file:///s:/sayim/GDG-web/brain/Design.md#L80) |
| **Invalid Route (404)** | User enters non-existent URL | Custom `not-found.tsx` with clean GDG error state and direct return to Home. | [Design.md §0](file:///s:/sayim/GDG-web/brain/Design.md#L10) |

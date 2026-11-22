# ImplementationPlan — GDG on Campus BPPIMT

> **Reference:** Governed by [PRD.md §7](file:///s:/sayim/GDG-web/brain/PRD.md#L90), [TRD.md §2](file:///s:/sayim/GDG-web/brain/TRD.md#L30), and [Rules.md §8](file:///s:/sayim/GDG-web/brain/Rules.md#L90).

---

## 1. Phased Build Sequence

### Phase 0: Architecture & Tooling Setup
- **Owner:** Tech Team Lead
- **Tasks:**
  - [ ] Initialize Next.js 15 project with TypeScript, ESLint, and Tailwind CSS.
  - [ ] Install shadcn/ui dependencies (`clsx`, `tailwind-merge`, `lucide-react`, `next-themes`).
  - [ ] Configure `tailwind.config.ts` with GDG color tokens (see [Design.md §2](file:///s:/sayim/GDG-web/brain/Design.md#L45)).
  - [ ] Create immutable constants in `/src/config/constants.ts` (see [TRD.md §4](file:///s:/sayim/GDG-web/brain/TRD.md#L65)).
  - [ ] Set up Zod schemas and TypeScript contracts in `/src/types/schema.ts` (see [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md#L30)).
- **Exit Criteria:** `npm run build` succeeds cleanly with zero lint or type errors; root page renders empty template with correct `<title>` metadata.

---

### Phase 1: Stitch UI Prototyping & Visual Alignment
- **Owner:** UI/UX Lead & Tech Team Lead
- **Tasks:**
  - [ ] Create project in Google Stitch via `StitchMCP` / Stitch Web Interface.
  - [ ] Generate landing page UI screens matching the GDG on Campus BPPIMT brand guidelines.
  - [ ] Export screen structures and review component hierarchy (Hero, Bento Grid, Events, Team, Footer).
  - [ ] Extract layout classes and design system parameters into the project.
- **Exit Criteria:** Stitch project screens generated and reviewed; design specs matched to Tailwind tokens.

---

### Phase 2: Core Components & Data Integration
- **Owner:** Frontend Developer
- **Tasks:**
  - [ ] Create static JSON files in `/src/data/` (`events.json`, `team.json`, `domains.json`, `projects.json`, `faq.json`).
  - [ ] Build global `Navbar` with responsive mobile drawer and `ThemeToggle` (using `next-themes`).
  - [ ] Build global `Footer` with official Google Developer Groups disclaimer and links.
  - [ ] Build `Hero` section with animated brand typography and dual CTAs.
  - [ ] Build `Domains` bento grid with domain-specific Google color accents.
- **Exit Criteria:** Navbar, Hero, Domains, and Footer render locally; dark/light mode toggle operates without hydration flicker.

---

### Phase 3: Events Hub & Team Showcase
- **Owner:** Frontend Developer
- **Tasks:**
  - [ ] Build `EventCard` component with date formatting, speaker info, and RSVP redirect.
  - [ ] Implement filter pill bar (`All`, `Upcoming`, `Past`) with empty-state fallback handling.
  - [ ] Build `TeamMemberCard` with social icons (GitHub, LinkedIn) and tier grouping.
  - [ ] Build `ProjectCard` showcasing student open source with GitHub and demo links.
  - [ ] Build `FAQ` accordion component using accessible primitives.
- **Exit Criteria:** Filter tabs update event list without page reload; clicking RSVP links opens official chapter page in a new tab with `rel="noopener noreferrer"`.

---

### Phase 4: Micro-Interactions & 21st.dev Component Polish
- **Owner:** Tech Team Lead
- **Tasks:**
  - [ ] Integrate Framer Motion card hover physics and smooth section reveals.
  - [ ] Add 21st.dev inspired animated tech badge / bento micro-animations.
  - [ ] Implement responsive image optimization via `@next/image` with SVG blur placeholders.
- **Exit Criteria:** 60fps smooth animations; zero layout shift (CLS = 0); Lighthouse Performance score ≥ 90.

---

### Phase 5: Verification & Production Deployment
- **Owner:** Tech Team Lead
- **Tasks:**
  - [ ] Run full typecheck (`tsc --noEmit`) and build test (`npm run build`).
  - [ ] Run automated link verification to guarantee zero 404s.
  - [ ] Deploy to Vercel production edge with custom domain/alias.
  - [ ] Audit Lighthouse metrics (Desktop & Mobile).
- **Exit Criteria:** Production URL active, SSL verified, all links functioning, 0 console errors.

---

## 2. Verified Reference Code Snippets

### Next-Themes Provider Configuration (`/src/components/theme-provider.tsx`)
```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Framer Motion Bento Card Hover Animation
```typescript
"use client";

import { motion } from "framer-motion";

export const cardHoverVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { y: -4, transition: { duration: 0.2, ease: "easeInOut" } },
};
```

---

## 3. Fallback Plan for Riskiest Tasks

| Risky Task | Risk | Fallback Strategy |
| :--- | :--- | :--- |
| **Complex Stitch Component Import** | Generated Stitch HTML/CSS might require significant refactoring for React 19 / Next.js 15. | Use Stitch output strictly as the visual layout blueprint; rebuild layout using standard `shadcn/ui` primitives and Tailwind CSS. |
| **Animation Performance Drops on Mobile** | Heavy Framer Motion animations cause stuttering on budget Android devices. | Wrap animations in CSS media queries or use `reducedMotion` preference checks; fallback to pure CSS transitions. |

---

## 4. De-Scope Hierarchy & "Never Cut" List

### De-Scope Order (If Time Runs Out)
1. **First to cut:** Student Projects Showcase (Phase 3) → Replace with a simple "Featured Projects Coming Soon" section.
2. **Second to cut:** Complex 21st.dev animated background canvas → Fallback to pure CSS radial gradient.
3. **Third to cut:** FAQ Accordion → Replace with static contact info in footer.

### "Never Cut" List (Non-Negotiable Core)
- 🔒 **App Name & Brand Compliance:** `GDG on Campus BPPIMT` in title, header, and footer.
- 🔒 **Hero Section with Join CTA:** Must allow students to immediately join the WhatsApp community.
- 🔒 **Events Section with RSVP:** The primary operational purpose of the campus website.
- 🔒 **Mobile Responsiveness:** Must look flawless on mobile viewports.

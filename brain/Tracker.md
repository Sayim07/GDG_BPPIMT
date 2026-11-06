# Tracker — GDG on Campus BPPIMT

> **Reference:** Mirrors [ImplementationPlan.md §1](file:///s:/sayim/GDG-web/brain/ImplementationPlan.md#L10) and logs architectural milestones.

---

## 1. Phase Status Boards

### Phase 0: Architecture & Tooling Setup
| Task ID | Task Description | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **T0.1** | Generate full documentation set in `/brain` | Tech Lead | **Done** | All 8 specification files created and verified. |
| **T0.2** | Initialize Next.js 15 + TypeScript + Tailwind | Tech Lead | **Done** | Clean Next.js 15 App Router setup with Tailwind CSS. |
| **T0.3** | Install dependencies & icons | Tech Lead | **Done** | `lucide-react`, `next-themes`, `framer-motion`, `clsx`. |
| **T0.4** | Configure GDG brand tokens in Tailwind | Tech Lead | **Done** | Blue `#4285F4`, Red `#EA4335`, Yellow `#FBBC04`, Green `#34A853`. |
| **T0.5** | **[BLOCKING EXIT]** Build & Typecheck Pass (`npm run build`) | Tech Lead | **Done** | Production build passed cleanly (zero errors). |

---

### Phase 1: Stitch UI Prototyping & Visual Alignment
| Task ID | Task Description | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **T1.1** | Create project on Google Stitch | UI/Tech Lead | **Done** | Stitch Project `10367347670668724233` created. |
| **T1.2** | Generate screen mockups for GDG on Campus BPPIMT | UI/Tech Lead | **Done** | Clean, light-mode screen `7d49c9f19b0c4f5ea1974c70e5420379`. |
| **T1.3** | **[BLOCKING EXIT]** Review & Fetch Screen Structure | Tech Lead | **Done** | Downloaded and transformed to clean React components. |

---

### Phase 2: Core Components & Data Integration
| Task ID | Task Description | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **T2.1** | Populate JSON datasets in `/src/data/` | Frontend Dev | **Done** | Adhering strictly to Schema.md (`chapter`, `tracks`, `pillars`, `events`, `team`, `faq`). |
| **T2.2** | Implement responsive `Navbar` + `ThemeToggle` | Frontend Dev | **Done** | Desktop menu + Mobile drawer + GDG 4-color SVG logo. |
| **T2.3** | Implement official `Footer` with branding rules | Frontend Dev | **Done** | Exact name compliance & student community disclaimer. |
| **T2.4** | Implement `Hero` section with dual CTAs | Frontend Dev | **Done** | Google 4-color gradient bar + clean typography + CTAs. |
| **T2.5** | **[BLOCKING EXIT]** Domains Bento Grid Rendering | Frontend Dev | **Done** | 4 Google color accents with Framer Motion hover glow. |

---

### Phase 3: Events Hub & Team Showcase
| Task ID | Task Description | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **T3.1** | Build `EventCard` component with official chapter links | Frontend Dev | **Done** | Clean RSVP and official page links without third-party vendor naming. |
| **T3.2** | Implement Upcoming/Past filter & empty state | Frontend Dev | **Done** | Gen-Z + Professional tone empty state banner active. |
| **T3.3** | Build `TeamMemberCard` with social links | Frontend Dev | **Done** | Gen-Z + Professional tone empty state active when roster pending. |
| **T3.4** | Build `ProjectCard` with GitHub/Demo links | Frontend Dev | In Progress | Student projects showcase component. |
| **T3.5** | **[BLOCKING EXIT]** FAQ Accordion & Zero Broken Links | Frontend Dev | **Done** | Expandable interactive accordion verified. |

---

### Phase 4: Micro-Interactions & Component Polish
| Task ID | Task Description | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **T4.1** | Integrate Framer Motion card hover physics | Tech Lead | **Done** | Smooth spring animations & subtle glow on track cards. |
| **T4.2** | Integrate animated badges / transitions | Tech Lead | In Progress | Modern developer micro-interactions without AI slop. |
| **T4.3** | **[BLOCKING EXIT]** Lighthouse Performance ≥ 90 | Tech Lead | Not Started | Desktop & Mobile performance check. |

---

### Phase 5: Production Deployment
| Task ID | Task Description | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **T5.1** | Production build test (`npm run build`) | Tech Lead | **Done** | 0 type errors, 0 lint warnings. Verified statically. |
| **T5.2** | Deploy to Vercel Production Edge | Tech Lead | Ready | GitHub repo connected and up to date. |
| **T5.3** | **[BLOCKING EXIT]** Final Sign-Off | Tech Lead | Not Started | Tech lead final review. |

---

## 2. Blockers Log
| Date | Task ID | Blocker Description | Resolution / Status |
| :--- | :---: | :--- | :--- |
| 2026-11-06 | - | Webpack chunk 223.js missing due to concurrent build/dev collision | Purged `.next` directory and restarted dev server cleanly. Resolved. |

---

## 3. Decisions Log
| Date | Decision | Reason | Doc Updated? |
| :--- | :--- | :--- | :---: |
| 2026-11-06 | Choose Next.js 15 App Router as default framework | Native SSG, edge speed, built-in SEO metadata, and best compatibility with shadcn/ui and 21st.dev. | Yes ([TRD.md §2](file:///s:/sayim/GDG-web/brain/TRD.md#L30)) |
| 2026-11-06 | Zero-backend static JSON architecture | Eliminates server costs, database maintenance, and auth security vulnerabilities for college chapter. | Yes ([PRD.md §2](file:///s:/sayim/GDG-web/brain/PRD.md#L20)) |
| 2026-11-06 | Enforce exact App Name: `GDG on Campus BPPIMT` | Mandatory Google Developer Community branding compliance. | Yes ([Design.md §0](file:///s:/sayim/GDG-web/brain/Design.md#L10)) |
| 2026-11-06 | Eliminate Discord & Bevy terminology | User directive: Discord is not used on campus; Bevy is internal vendor terminology replaced with "Official Chapter Page". | Yes |

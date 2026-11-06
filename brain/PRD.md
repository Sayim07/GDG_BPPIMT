# PRD — GDG on Campus BPPIMT

> **Mandatory Branding Rule:** The application name is **`GDG on Campus BPPIMT`**. This exact string must be used everywhere without exception: UI header, browser tab/window title, meta tags, footer, documentation, and README. No abbreviations (such as "GDSC", "GDG-B", or "BPPIMT-GDG") are permitted. See [Rules.md §2](file:///s:/sayim/GDG-web/brain/Rules.md#L18).

---

## 1. Problem Statement
The student developer community at B.P. Poddar Institute of Management and Technology (BPPIMT), Kolkata lacks a centralized, modern, and credible digital hub. Students currently encounter scattered WhatsApp links, stale social posts, and uncoordinated event notifications. Furthermore, existing student club websites often suffer from generic "AI-generated template slop," poor mobile optimization, broken links, and zero distinct Google Developer branding.

`GDG on Campus BPPIMT` solves this by delivering an authoritative, responsive, high-performance community portal that showcases active technology domains, upcoming and past workshops, student open-source projects, core team members, and a streamlined gateway to join the community.

---

## 2. Goals & Non-Goals

### Goals
- **G1 (Identity & Branding):** Establish a world-class, official presence adhering strictly to Google Developer Groups brand standards (palette, clean typography, developer-first aesthetic) with zero generic placeholder feel.
- **G2 (Event Discovery):** Allow students to browse upcoming and past events, filter by technology track (AI/ML, Cloud, Web, Android, CyberSec), and RSVP directly via official Google Developer Community (Bevy) links.
- **G3 (Showcase & Recognition):** Feature real student projects created by campus developers and highlight the core team leads with verified social links.
- **G4 (Zero Cost & High Performance):** Run 100% on free-tier infrastructure (Next.js static generation on Vercel/Cloudflare Pages) achieving Lighthouse score ≥ 90 across all categories.

### Non-Goals (Explicit "Do NOT Build" List)
- **NG1 (No Custom Auth/User Management):** Do not build a user login/signup, JWT backend, or password auth system. Event RSVPs redirect to the official Google Developer Community platform (Bevy).
- **NG2 (No Custom Payment Gateway):** Do not build ticket sales or payment processing. All campus chapter events are free or handled via external Google platform.
- **NG3 (No Dynamic Database or CMS Backend):** Do not set up MongoDB, PostgreSQL, Supabase, or headless CMS backends for MVP. All content is governed by structured, strictly typed local JSON schemas (see [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md)).
- **NG4 (No Discussion Forum / Chat System):** Do not build real-time chat, comments, or forums. Users are directed to official Discord and WhatsApp community channels.
- **NG5 (No Complex Admin Dashboard):** Content updates are made via Git commits directly to schema files, eliminating auth risk and server costs.

---

## 3. Target Users & Stakeholders

| Stakeholder | Description | Primary Needs |
| :--- | :--- | :--- |
| **BPPIMT Students (Beginners & Seniors)** | Engineering & CS students seeking peer learning, tech workshops, hackathons, and open source opportunities. | One-click access to workshop details, registration links, domain roadmaps, and community channels. |
| **GDG Core Team & Leads** | Organizers, Domain Leads, and Tech Leads managing chapter operations. | Credible portal to showcase team authority, past impact, and curate student project submissions. |
| **Faculty & Institute Leadership** | College administration and department heads evaluating student club activities. | Professional representation of college innovation and official Google affiliation. |
| **Industry Mentors & Speakers** | External tech leaders considering speaking at or sponsoring chapter hackathons. | Clear view of chapter size, past events, speaker rosters, and technical depth. |

---

## 4. Core Features Matrix

| Feature ID | Feature Name | Priority | Description | Cross Reference |
| :--- | :--- | :---: | :--- | :--- |
| **FEAT-01** | **Hero & Dynamic Brand Visualizer** | **P0** | High-impact hero section with interactive badge, tagline, quick CTA buttons ("Join Community", "Explore Events"), and subtle animated GDG geometry/particles. | [Design.md §2](file:///s:/sayim/GDG-web/brain/Design.md#L45) |
| **FEAT-02** | **Technology Domains Bento Grid** | **P0** | Interactive cards for chapter tracks: AI/ML, Cloud, Web & App Development, Android, and Cybersecurity & Open Source. | [AppFlow.md §3](file:///s:/sayim/GDG-web/brain/AppFlow.md#L55) |
| **FEAT-03** | **Events Hub (Upcoming & Past)** | **P0** | Filterable event cards showing date, mode (In-Person/Virtual), speaker, domain badge, description, and direct RSVP/recording links. | [Schema.md §2.1](file:///s:/sayim/GDG-web/brain/Schema.md#L30) |
| **FEAT-04** | **Core Team Directory** | **P0** | Team roster organized by tier (Organizer, Tech Lead, Domain Leads) featuring profile pictures, role tags, and verified social links. | [Schema.md §2.2](file:///s:/sayim/GDG-web/brain/Schema.md#L75) |
| **FEAT-05** | **Student Project Showcase** | **P1** | Gallery of vetted campus projects with domain tags, GitHub repository links, and live demo buttons. | [Schema.md §2.3](file:///s:/sayim/GDG-web/brain/Schema.md#L115) |
| **FEAT-06** | **Community Gateways & Socials** | **P0** | Prominent links and QR codes to official Discord, WhatsApp group, LinkedIn, and YouTube channels. | [AppFlow.md §3](file:///s:/sayim/GDG-web/brain/AppFlow.md#L80) |
| **FEAT-07** | **Interactive FAQ Section** | **P1** | Accordion FAQ addressing membership eligibility, how to join, event fees, and certification. | [Schema.md §2.4](file:///s:/sayim/GDG-web/brain/Schema.md#L155) |
| **FEAT-08** | **Dark / Light Theme Toggle** | **P1** | Theme switcher adhering to Google Material 3 dark and light tokens with zero layout shift. | [Design.md §3](file:///s:/sayim/GDG-web/brain/Design.md#L70) |

---

## 5. Success Metrics

1. **Performance:** Google Lighthouse Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO = 100 on desktop; ≥ 90 on mobile.
2. **Speed Index:** First Contentful Paint (FCP) < 1.0s; Largest Contentful Paint (LCP) < 1.8s; Cumulative Layout Shift (CLS) = 0.
3. **Engagement:** Zero broken RSVP, social, or project links across all pages.
4. **Responsiveness:** 100% responsive without horizontal overflow on viewport widths from 320px to 2560px.

---

## 6. Key Risks & Mitigation

| Risk | Severity | Mitigation Strategy | Reference |
| :--- | :---: | :--- | :--- |
| **Stale Event Information** | High | Strict fallback schema: if no upcoming event is listed, the UI gracefully renders an "Our Next Event is Brewing" card with newsletter/Discord CTA. | [AppFlow.md §4](file:///s:/sayim/GDG-web/brain/AppFlow.md#L95) |
| **Bloated Bundle Size from 3D/Canvas** | Medium | Use pure CSS / SVG / lightweight Framer Motion micro-animations instead of heavy Three.js or canvas libraries. | [TRD.md §5](file:///s:/sayim/GDG-web/brain/TRD.md#L85) |
| **Image Asset Breakage** | Medium | Next.js Image component with optimized WebP/AVIF formats and local SVG fallbacks for member avatars. | [TRD.md §3](file:///s:/sayim/GDG-web/brain/TRD.md#L50) |
| **Scope Creep (Building a Backend)** | Critical | Explicitly enforce local JSON contracts; forbid Express, MongoDB, or Supabase additions. | [Rules.md §3](file:///s:/sayim/GDG-web/brain/Rules.md#L30) |

---

## 7. Deliverables Checklist
- [ ] 8 Complete Brain documentation files locked in `/brain`.
- [ ] Initial UI screen generated via Google Stitch MCP.
- [ ] Next.js 15 + TypeScript + Tailwind CSS project initialized with `@/` alias.
- [ ] shadcn/ui components installed and styled with GDG brand tokens.
- [ ] 21st.dev micro-interaction and animated hero components integrated.
- [ ] Validated JSON mock datasets for Events, Team, Domains, Projects, and FAQs.
- [ ] Responsive navigation bar and footer with strict App Name branding.
- [ ] Automated verification script checking for broken links and type safety.

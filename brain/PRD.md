# Product Requirements Document (PRD) — GDG on Campus BPPIMT

> **Reference:** Governed by [Rules.md §1](file:///s:/sayim/GDG-web/brain/Rules.md#L8). Changes require explicit Tech Lead approval.

---

## 1. Executive Summary & Vision

**GDG on Campus BPPIMT** (Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata) is the official student developer community dedicated to bridging the gap between theoretical computer science education and practical software engineering.

The goal of this web application is to provide a clean, high-performance, official digital presence that showcases upcoming workshops, technology domain tracks (Web & Cloud, AI/ML, Android, Open Source & Security), leadership, and FAQs.

---

## 2. Core Constraints & Guiding Principles

1. **Strict Zero-Server Static Architecture:** No custom backend servers (Node/Express, Python, Flask) and no dynamic databases (MongoDB, PostgreSQL, Supabase). All content is powered by static JSON contracts.
2. **Authentic Google Branding (Zero AI Slop):** Strictly light-first, clean Material 3 surfaces, and Google Quad-Color accents (Blue `#4285F4`, Red `#EA4335`, Yellow `#FBBC04`, Green `#34A853`). Bans generic AI slop tropes (floating capsule badges, nested card inception, neon glows, glassmorphism, magnetic hover distortion).
3. **Exclusive Typography:** Strictly **Product Sans / Google Sans** only across headings and body copy, preloaded locally in WOFF2 format.
4. **Independent Route Architecture:** Dedicated standalone pages for `/events` and `/team` with breadcrumb navigation back to Home, alongside preserved homepage scroll anchors (`#events`, `#team`).
5. **No Discord / No Bevy Naming:** Community channels are WhatsApp, LinkedIn, GitHub, and the Google Community Dev chapter page. Third-party vendor naming "Bevy" is strictly forbidden.
6. **Zero Hosting Cost:** Built on Next.js 15 App Router deployed statically to Vercel Edge CDN.

---

## 3. Target Users & Stakeholders

| Stakeholder | Description | Primary Needs |
| :--- | :--- | :--- |
| **BPPIMT Students (Beginners & Seniors)** | Engineering & CS students seeking peer learning, tech workshops, hackathons, and open source opportunities. | Instant access to workshop details, domain roadmaps, official RSVP links, and community channels. |
| **GDG Core Team & Leads** | Organizers, Domain Leads, and Tech Leads managing chapter operations. | Credible portal to showcase team authority, past impact, and curate student project submissions. |
| **Faculty & Institute Leadership** | College administration and department heads evaluating student club activities. | Professional representation of college innovation and official Google affiliation. |
| **Industry Mentors & Speakers** | External tech leaders considering speaking at or sponsoring chapter hackathons. | Clear view of chapter size, past events, speaker rosters, and technical depth. |

---

## 4. Core Features Matrix

| Feature ID | Feature Name | Priority | Description | Cross Reference |
| :--- | :--- | :---: | :--- | :--- |
| **FEAT-01** | **Hero & Brand Header** | **P0** | High-impact hero section with authentic Google 4-color accent bar, two-tier brand title, clean Product Sans typography, and direct CTA actions. | [Design.md §0](file:///s:/sayim/GDG-web/brain/Design.md#L10) |
| **FEAT-02** | **Technical Domains Focus** | **P0** | Flat Material 3 cards for chapter tracks: AI/ML, Cloud, Android, and Open Source & Security with 1px border highlight states. | [AppFlow.md §3](file:///s:/sayim/GDG-web/brain/AppFlow.md#L55) |
| **FEAT-03** | **Dedicated Events Hub** | **P0** | Standalone `/events` page + homepage preview with Gen-Z announcement fallback when roster is being finalized. | [Schema.md §2.1](file:///s:/sayim/GDG-web/brain/Schema.md#L30) |
| **FEAT-04** | **Dedicated Team Directory** | **P0** | Standalone `/team` page + homepage preview with chapter leads, domain tags, social links, and Gen-Z announcement fallback. | [Schema.md §2.2](file:///s:/sayim/GDG-web/brain/Schema.md#L75) |
| **FEAT-05** | **Community Gateways & Socials** | **P0** | Prominent verified links to official WhatsApp community, LinkedIn, GitHub, and Google Community Page. | [AppFlow.md §3](file:///s:/sayim/GDG-web/brain/AppFlow.md#L80) |
| **FEAT-06** | **Interactive FAQ Section** | **P1** | Clean accessible accordion addressing membership eligibility, event registration, and student involvement. | [Schema.md §2.4](file:///s:/sayim/GDG-web/brain/Schema.md#L155) |
| **FEAT-07** | **Google Material Dark / Light Theme** | **P1** | Theme switcher adhering to authentic Google Charcoal (`#202124`) dark mode tokens with zero layout shift. | [Design.md §2](file:///s:/sayim/GDG-web/brain/Design.md#L50) |

---

## 5. Success Metrics

1. **Performance:** Google Lighthouse Performance ≥ 95, Accessibility ≥ 95, Best Practices = 100, SEO = 100 on desktop; ≥ 90 on mobile.
2. **Speed Index:** First Contentful Paint (FCP) < 1.0s; Largest Contentful Paint (LCP) < 1.8s; Cumulative Layout Shift (CLS) = 0.
3. **Typography:** 100% Product Sans / Google Sans across all viewports.
4. **Engagement:** Zero broken RSVP, social, or navigation links across all pages.
5. **Responsiveness:** 100% responsive without horizontal overflow on viewport widths from 320px to 2560px.

---

## 6. Key Risks & Mitigation

| Risk | Severity | Mitigation Strategy | Reference |
| :--- | :---: | :--- | :--- |
| **Stale Event Information** | High | Strict fallback schema: if no upcoming event is listed, the UI gracefully renders a Gen-Z announcement banner with "Get Official Updates" CTA. | [AppFlow.md §4](file:///s:/sayim/GDG-web/brain/AppFlow.md#L95) |
| **AI Slop Clichés** | High | Explicit anti-slop rules codified in `Design.md` and `Rules.md`; bans capsule badges, glassmorphism, and neon glows. | [Design.md §1](file:///s:/sayim/GDG-web/brain/Design.md#L40) |
| **Scope Creep (Building a Backend)** | Critical | Explicitly enforce local JSON contracts; forbid Express, MongoDB, or Supabase additions. | [Rules.md §6](file:///s:/sayim/GDG-web/brain/Rules.md#L30) |

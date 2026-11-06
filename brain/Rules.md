# Rules — GDG on Campus BPPIMT

> **CRITICAL DIRECTIVE FOR AI CODING TOOLS:** Read this file before generating any code. If a request conflicts with these rules, flag it instead of silently complying.

---

## 1. Source-of-Truth Hierarchy
When a specification or implementation conflict arises between documents, resolve it strictly in this order of precedence:
1. **`Rules.md`** (Highest authority — governance & boundaries)
2. **`Schema.md`** (Data, API, and file contracts)
3. **`TRD.md`** (Technical stack & constraints)
4. **`PRD.md`** (Product requirements & scope)
5. **`AppFlow.md`** (User navigation & serving flow)
6. **`Design.md`** (Design system, tokens, typography)
7. **`ImplementationPlan.md`** (Build sequence & snippets)
8. **`Tracker.md`** (Status tracking & task log)

---

## 2. App Naming & Brand Rules
1. **Exact App Name:** **`GDG on Campus BPPIMT`**.
   - It must be used identically in metadata tab titles (`<title>`), OpenGraph tags, README, and documentation.
   - **FORBIDDEN:** Do not use "GDSC BPPIMT", "GDG-B", "GDG BPPIMT Chapter", or "Google Student Club".
2. **Navbar Brand Header:**
   - Top Line: **`Google Developer Group`**
   - Bottom Sub-line: **`B.P. Poddar Institute of Management and Technology`**
3. **Typography Mandate:**
   - **USE ONLY Product Sans / Google Sans** across the entire website. Generic AI sans fonts (Inter, Geist, SF Pro) are strictly forbidden. Preloaded locally via WOFF2 in `/public/fonts/`.

---

## 3. Strict Git Policy
- **DO NOT AUTO-COMMIT OR AUTO-PUSH:** The AI agent must NEVER automatically execute `git commit` or `git push`.
- All changes must remain in the local working directory for the user/Tech Lead to inspect, review, and commit themselves.

---

## 4. Forbidden Channels & Internal Terminology
1. **NO DISCORD:** Discord is strictly forbidden. Do not mention, render icons for, or link to Discord anywhere in JSX, schemas, or markdown.
2. **NO "BEVY" TERMINOLOGY:** "Bevy" is internal white-label software naming used by Google. It must NEVER be shown to users. Use user-friendly terms: **"Official Chapter Page"** or **"Get Official Updates"**.
3. **COMMUNITY LINKS:** Active channels are WhatsApp, LinkedIn, GitHub, and the Google Community Dev chapter page.

---

## 5. Anti-AI Slop Mandate (Design Standards)
AI coding assistants commonly generate predictable "AI slop" patterns. The following are strictly forbidden in this codebase:
- ❌ **No "Pillsbury Capsule Badges":** Never put floating `rounded-full px-3 py-1 text-xs` badges with emoji or colored dots above titles. Use clean semantic uppercase tracking typography.
- ❌ **No Centered Hero Text Overload:** Never use the generic "capsule badge + giant bold text + 2-line subtitle + dual split button" layout.
- ❌ **No Nested Card Inception:** Never put cards inside cards inside cards with soft shadows (`shadow-sm`, `hover:shadow-md`). Use flat Google Material 3 surfaces with clean 1px borders (`#E8EAED` / `#3C4043`).
- ❌ **No Fake Neon Glows or Mesh Gradients:** Never use `shadow-[0_8px_30px_rgb(...)]` or purple/indigo mesh gradients.
- ❌ **No Aggressive Glassmorphism:** Never use blurry `backdrop-blur-md bg-white/10` on navbars or headers. Surfaces must be solid, crisp, and high-performance.
- ❌ **No Framer Motion Scroll Over-Easing:** Never place repetitive `initial={{ opacity: 0, y: 15 / 20 }}` scroll-trigger animations across sections. Pages must render instantly and naturally.
- ❌ **No Magnetic Button Scaling:** Never use `hover:scale-105 duration-200` hover distortion.

---

## 6. Hard Scope Boundaries (Strict "DO NOT" List)
1. **NO CUSTOM BACKEND / DATABASE:** Do not write Node.js Express servers, Python Flask backends, or connect to MongoDB, PostgreSQL, Supabase, or Firebase for MVP. All content is stored in local static JSON contracts.
2. **NO CUSTOM AUTH / SESSION MANAGEMENT:** Do not build user login, signup, passwords, or JWT auth. Event RSVPs link externally to the official Google Developer platform.
3. **NO PAID TOOLS OR APIS:** Every tool, icon, library, and hosting provider must be 100% free / open source.
4. **NO HEAVY 3D / CANVAS BLOAT:** Do not import Three.js, Spline, or heavy canvas particle libraries.

---

## 7. Developer Tooling Boundaries
- **Agentation:** Integrated strictly for local development debugging (`NODE_ENV === 'development'` and `localhost` / `127.0.0.1`). It must never render or leak on production Vercel builds.

---

## 8. Definition of Done (DoD) per Feature
A feature is complete if and only if:
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`).
- [ ] The feature renders cleanly in both Light and Google Material Dark themes.
- [ ] Tested and verified on mobile (360px viewport).
- [ ] Uses only **Product Sans / Google Sans** typography.
- [ ] Zero AI slop patterns present.
- [ ] Code is left in working directory for Tech Lead review (no unauthorized git push).
- [ ] Corresponding row in [Tracker.md](file:///s:/sayim/GDG-web/brain/Tracker.md) is updated.

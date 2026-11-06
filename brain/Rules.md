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

## 2. App Naming Rule
The application name is **`GDG on Campus BPPIMT`**.
- It must be used identically in UI headers, metadata tab titles (`<title>`), OpenGraph tags, README, and documentation.
- **FORBIDDEN:** Do not use "GDSC BPPIMT", "GDG-B", "GDG BPPIMT Chapter", or "Google Student Club".
- See [Design.md §0](file:///s:/sayim/GDG-web/brain/Design.md#L10) for framework title implementation snippet.

---

## 3. Hard Scope Boundaries (Strict "DO NOT" List)
1. **NO CUSTOM BACKEND / DATABASE:** Do not write Node.js Express servers, Python Flask/FastAPI backends, or connect to MongoDB, PostgreSQL, Supabase, or Firebase for MVP. All content is stored in local static JSON contracts (see [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md#L20)).
2. **NO CUSTOM AUTH / SESSION MANAGEMENT:** Do not build user login, signup, passwords, or JWT auth. Event RSVPs link externally to the official Google Developer platform (Bevy).
3. **NO PAID TOOLS OR APIS:** Every tool, icon, library, and hosting provider must be 100% free / open source.
4. **NO HEAVY 3D / CANVAS BLOAT:** Do not import Three.js, Spline, or heavy canvas particle libraries. Use Framer Motion, Tailwind CSS, and SVG for micro-animations.

---

## 4. Non-Negotiable Technical Rules

### Rule 1: Zero AI Slop & Clean Design Standard
- **Required:** Use structured Tailwind spacing, subtle border colors (`#E2E8F0` / `#1E293B`), Google brand accents (`#4285F4`, `#EA4335`, `#FBBC04`, `#34A853`), and tactile micro-interactions with shadcn/ui and Framer Motion.
- **Forbidden:** Generic neon purple/violet mesh backgrounds, unstyled generic cards, stock corporate handshake photos, or giant unreadable hero text.

### Rule 2: Strict Schema Adherence
- **Required:** All UI components rendering events, team, domains, projects, and FAQs must import and consume types defined in `@/types/schema.ts` matching [Schema.md §2](file:///s:/sayim/GDG-web/brain/Schema.md#L20).
- **Forbidden:** Renaming fields for convenience (e.g. changing `rsvpUrl` to `link` or `domainId` to `category` is forbidden).

### Rule 3: Mobile-First Zero Layout Shift
- **Required:** Test all layouts at 360px width. Mobile navigation must use a responsive drawer. All images must have explicit dimensions via `next/image` to prevent Cumulative Layout Shift (CLS = 0).
- **Forbidden:** Unresponsive tables, fixed desktop widths > 100vw, or hidden critical navigation on mobile.

---

## 5. Fallback & Error-Handling Protocol
Every dynamic data consumer component must handle the following states:
1. **Empty Collection:** If `events.json` has 0 upcoming events, render the empty state card specified in [AppFlow.md §4](file:///s:/sayim/GDG-web/brain/AppFlow.md#L95).
2. **Missing Media:** If an avatar or thumbnail image fails to load, render a graceful SVG monogram with the member's initials.
3. **External Link Attributes:** Every external link (Bevy, GitHub, Discord, LinkedIn) must include `target="_blank"` and `rel="noopener noreferrer"`.

---

## 6. Grounded Talking Points (For Faculty, Leads & Visitors)

| Question | Grounded Answer | Reference |
| :--- | :--- | :--- |
| *"Why doesn't the website have a sign-up or login form?"* | "We intentionally integrate with Google's official Bevy platform (`gdg.community.dev`) for official RSVP tracking and member privacy, keeping our campus site ultra-fast, static, and zero-maintenance." | [PRD.md §2](file:///s:/sayim/GDG-web/brain/PRD.md#L20) |
| *"How do you keep hosting and server costs zero?"* | "The site is built with Next.js 15 Static Site Generation (SSG) and deployed to global edge CDNs (Vercel / GitHub Pages), delivering sub-second load times without any monthly server fees." | [TRD.md §2](file:///s:/sayim/GDG-web/brain/TRD.md#L30) |
| *"How can students get their projects featured on the site?"* | "Students submit projects to the tech team; once vetted against our project contract, they are added to `projects.json` via a pull request." | [Schema.md §2.3](file:///s:/sayim/GDG-web/brain/Schema.md#L115) |

---

## 7. Code Conventions & Standards
- **Language & Style:** TypeScript in strict mode (`"strict": true`). No `any` types permitted.
- **Imports:** Use absolute path aliases (`@/components/...`, `@/data/...`, `@/types/...`).
- **CSS:** Tailwind CSS utility classes; avoid inline styles. Extract repeated token combinations to `components/ui/`.
- **Icons:** Use `lucide-react` exclusively for iconography.
- **Logging:** Use `console.error` only inside error boundary handlers; no stray `console.log` statements in production components.

---

## 8. "When the Coding Tool is Unsure" Protocol
If a prompt or task is ambiguous:
1. **Do not silently invent** libraries, fields, or endpoints.
2. State the exact point of ambiguity clearly to the user.
3. Propose the option that best fits the existing architecture in `TRD.md` and `Schema.md`.
4. Await user confirmation before proceeding.

---

## 9. Definition of Done (DoD) per Feature
A feature is complete if and only if:
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`).
- [ ] The feature renders cleanly in both Dark and Light themes.
- [ ] It looks polished and responsive on mobile (360px viewport).
- [ ] Data conforms 100% to schemas in [Schema.md](file:///s:/sayim/GDG-web/brain/Schema.md).
- [ ] Corresponding row in [Tracker.md](file:///s:/sayim/GDG-web/brain/Tracker.md) is updated to **Done**.

# Design — GDG on Campus BPPIMT

> **Reference:** Governed by [PRD.md §4](file:///s:/sayim/GDG-web/brain/PRD.md#L45) and [Rules.md §2](file:///s:/sayim/GDG-web/brain/Rules.md#L18).

---

## 0. Mandatory Branding Rules

- **Exact App Name:** **`GDG on Campus BPPIMT`**
- **Permitted Variants:** None. Do not shorten to "GDG BPPIMT", "GDSC BPPIMT", "Google Club", or "GDG Kolkata".
- **Official Chapter Tagline:** *"Connect, Learn, Grow with Google Developer Groups on Campus BPPIMT"*
- **Framework Window / Tab Title Code Snippet (`/src/app/layout.tsx`):**

```typescript
// Mandatory Next.js Metadata implementation
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "GDG on Campus BPPIMT",
    template: "%s | GDG on Campus BPPIMT",
  },
  description: "Official community portal for Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GDG on Campus BPPIMT",
    description: "Connect, Learn, Grow with Google Developer Groups on Campus BPPIMT.",
    url: "https://gdgbppimt.vercel.app",
    siteName: "GDG on Campus BPPIMT",
    locale: "en_US",
    type: "website",
  },
};
```

---

## 1. Design Philosophy & Intent

- **Anti-AI Slop Mandate:** Zero dark cyberpunk neon themes, zero fake terminal widgets, zero dense unreadable tables, and zero decorative 3D clutter.
- **Authentic Google Developer Aesthetic:** Clean, bright, light-first canvas (#FFFFFF / #F8F9FA) with generous whitespace, friendly rounded corners (rounded-xl / rounded-2xl), subtle 1px borders (#E8EAED), and classic Google Four-Color accents.
- **Simplicity First:** Minimal, clear structural layout that feels welcoming to college students, faculty, and industry guests. Dark mode is available as a clean toggle, but light mode is the primary brand showcase.

---

## 2. Color System & Design Tokens

The color palette is authentic Google Developer Groups branding on an airy, bright foundation:

```
┌─────────────────────────────────────────────────────────────┐
│                      GDG Brand Accents                      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Google Blue │  Google Red  │ Google Yellow│  Google Green  │
│   #4285F4    │   #EA4335    │   #FBBC04    │    #34A853     │
│ (Core/Cloud) │   (AI/ML)    │  (Android)   │  (Web/Learn)   │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Color Token Mapping

| Token Name | Light Mode Hex (Default) | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#FFFFFF` (Pure White) | `#121212` | Main page canvas |
| `--surface` | `#F8F9FA` (Google Off-White) | `#1E1E1E` | Card containers and pill badges |
| `--surface-elevated`| `#FFFFFF` | `#252525` | Hovered cards, modals, popovers |
| `--border` | `#E8EAED` (Soft Slate) | `#2D2D2D` | Clean 1px structural borders |
| `--foreground` | `#202124` (Google Slate) | `#F1F3F4` | Primary headings and text |
| `--muted-foreground`| `#5F6368` (Google Neutral) | `#9AA0A6` | Subtitles, dates, meta |
| `--gdg-blue` | `#4285F4` | `#8AB4F8` | Primary CTAs, active links, Cloud |
| `--gdg-red` | `#EA4335` | `#F28B82` | Connect badges, AI/ML track |
| `--gdg-yellow` | `#FBBC04` | `#FDD663` | Grow badges, Android track |
| `--gdg-green` | `#34A853` | `#81C995` | Learn badges, Web track |

---

## 3. Typography & Hierarchy

- **Primary Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (Clean, legible across all resolutions).
- **Heading Font Family:** `Plus Jakarta Sans` or `Google Sans` fallback (Distinct geometric personality).

```
Level             Size     Weight   Tracking   Line Height
Display Hero      56px     800      -0.03em    1.1
Section Title     36px     700      -0.02em    1.2
Card Title        20px     600      -0.01em    1.3
Body Regular      16px     400       0.00em    1.6
Caption / Meta    13px     500      +0.01em    1.4
```

---

## 4. Key Visual Differentiators & Interactive Components

1. **Brand Brackets Accent:** Subtle `{ }` or `< >` bracket iconography inspired by Google Developer Groups identity.
2. **Interactive Bento Grid:** Asymmetric grid layout for technology domains featuring dynamic hover states with domain-specific accent glow (e.g. Red for AI/ML, Blue for Cloud).
3. **Filterable Event Pill Bar:** Clean chip filters with animated layout indicator (`layoutId="activeFilter"` in Framer Motion).
4. **Member Cards with Social Flip/Reveal:** Tactile cards displaying name, role, domain badge, and instant access to LinkedIn and GitHub.

---

## 5. What to Avoid (Anti-Patterns)

- ❌ **DO NOT USE:** Generic purple/violet-heavy neon gradients (hallmark of generic AI templates).
- ❌ **DO NOT USE:** Huge, slow Three.js spinning 3D globes or canvas elements that choke low-end mobile devices.
- ❌ **DO NOT USE:** Stock photos of generic corporate offices or handshakes.
- ❌ **DO NOT USE:** Unresponsive tables that cause horizontal overflow on mobile screens.
- ❌ **DO NOT USE:** Missing empty states (e.g., blank white space when 0 upcoming events exist).

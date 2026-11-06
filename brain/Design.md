# Design — GDG on Campus BPPIMT

> **Reference:** Governed by [PRD.md §4](file:///s:/sayim/GDG-web/brain/PRD.md#L45) and [Rules.md §2](file:///s:/sayim/GDG-web/brain/Rules.md#L18).

---

## 0. Mandatory Branding Rules

- **Exact App Name:** **`GDG on Campus BPPIMT`**
- **Permitted Variants:** None. Do not shorten to "GDG BPPIMT", "GDSC BPPIMT", "Google Club", or "GDG Kolkata".
- **Navbar Header Structure:**
  - **Top Line:** **`Google Developer Group`** (Bold)
  - **Bottom Sub-line:** **`B.P. Poddar Institute of Management and Technology`** (Subtle, tracking-normal)
- **Official Chapter Tagline:** *"Connect, Learn, Grow with Google Developer Groups on Campus BPPIMT"*
- **Framework Window / Tab Title Code Snippet (`/src/app/layout.tsx`):**

```typescript
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

## 1. Design Philosophy & Anti-AI Slop Mandate

The site explicitly bans standard AI coding agent clichés in favor of clean, authentic, editorial Google Developer branding:

1. **No "Pillsbury Capsule Badges":** No floating `rounded-full px-3 py-1 text-xs` badges with colored dots or emoji floating over titles. Section titles use clean semantic uppercase typography (`text-xs uppercase tracking-widest text-text-tertiary`).
2. **No Centered Hero Clichés:** No artificial "Capsule + Giant Header + 2-line Subtitle + Dual CTA Split (solid black vs ghost white)". Instead, focused primary Google Blue action and clean secondary text link.
3. **No Nested Card Inception:** No cards inside cards inside cards with soft blur shadows. Surfaces are flat Google Material 3 with crisp 1px borders (`#E8EAED` in light, `#3C4043` in dark).
4. **No Artificial Glow / Mesh Gradients:** No `shadow-[0_8px_30px_rgb(...)]`, no `blur-2xl` neon gradients, and no generic purple/indigo blends.
5. **No Glassmorphism:** No translucent `backdrop-blur-md bg-white/10` navbars. The navbar is solid, crisp, and tactile.
6. **No Framer Motion Scroll Over-Easing:** Zero repetitive `initial={{ opacity: 0, y: 15 / 20 }}` scroll-trigger delays that cause lag. Content renders immediately and naturally.
7. **No Magnetic Button Scaling:** Zero `scale-105 duration-200` hover distortions.

---

## 2. Color System & Design Tokens

The color palette is authentic Google Developer Groups branding on a bright, airy light foundation and authentic Google Charcoal dark mode:

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

| Token Name | Light Mode Hex (Default) | Dark Mode Hex (Authentic Google Material) | Usage |
| :--- | :--- | :--- | :--- |
| `--surface-page` | `#FFFFFF` (Pure White) | `#202124` (Google Charcoal) | Main page canvas |
| `--surface-card` | `#F8F9FA` (Google Off-White) | `#292A2D` (Material Elevation 1) | Card containers |
| `--surface-subtle` | `#F1F3F4` (Google Subtle Gray) | `#35363A` (Material Elevation 2) | Secondary elements, chips |
| `--border-subtle` | `#E8EAED` (Google Light Border) | `#3C4043` (Google Dark Divider) | Clean 1px structural borders |
| `--border-strong` | `#DADCE0` (Google Active Border)| `#5F6368` (Active Divider) | Hovered / active borders |
| `--text-primary` | `#202124` (Google High Contrast)| `#E8EAED` (Google Dark Primary) | Headings, titles, high contrast |
| `--text-secondary`| `#5F6368` (Google Medium Gray) | `#9AA0A6` (Google Dark Secondary) | Subtitles, body copy, descriptions |
| `--text-tertiary` | `#80868B` (Google Low Contrast) | `#80868B` | Captions, meta tags, timestamps |
| `--gdg-blue` | `#4285F4` (Light) | `#8AB4F8` (Accessible Pastel Blue) | Primary CTAs, active links, Cloud |
| `--gdg-red` | `#EA4335` (Light) | `#F28B82` (Accessible Pastel Red) | Red accents, AI/ML track |
| `--gdg-yellow` | `#FBBC04` (Light) | `#FDD663` (Accessible Pastel Yellow) | Yellow accents, Android track |
| `--gdg-green` | `#34A853` (Light) | `#81C995` (Accessible Pastel Green) | Green accents, Web track |

---

## 3. Typography & Hierarchy (Product Sans / Google Sans Only)

> [!IMPORTANT]
> **Strict Mandate:** Use **ONLY Product Sans / Google Sans** across the entire website (headings, navigation, and body copy). All generic sans-serifs (Inter, Geist, SF Pro) are removed.

- **Implementation:** Preloaded high-performance local WOFF2 files (`/public/fonts/ProductSans-*.woff2`) via `next/font/local` to guarantee CLS = 0 and instant rendering.
- **Font Variants Loaded:**
  - `ProductSans-Regular.woff2` (400)
  - `ProductSans-Bold.woff2` (700)
  - `ProductSans-Italic.woff2`
  - `ProductSans-BoldItalic.woff2`

```
Level             Size     Weight   Tracking   Line Height
Display Hero      56px     800      -0.03em    1.1
Section Title     36px     700      -0.02em    1.2
Card Title        20px     700      -0.01em    1.3
Body Regular      16px     400       0.00em    1.6
Caption / Meta    13px     500      +0.01em    1.4
```

---

## 4. Key Visual Differentiators

1. **Brand Brackets Accent:** Authentic GDG 4-color brackets SVG logo in Navbar and Footer.
2. **Four-Color Accent Line:** Subtle 4-pixel Google quad-color accent bar atop the page canvas.
3. **Flat Material Cards:** Flat cards with clean Google 1px border highlight tones on hover.
4. **Independent Navigation Architecture:** Dedicated independent pages for `/events` and `/team` with instant breadcrumb return navigation to Home.

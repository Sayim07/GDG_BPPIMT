# Schema — GDG on Campus BPPIMT

> **Enforcement Notice:** This is the exact contract every module must follow. If a field is not defined here, do not invent it; add it here first.

---

## 1. Directory & File Structure Conventions

All data contracts live inside `/src/data/` as static JSON files. All TypeScript type definitions reside in `/src/types/schema.ts`.

```
/src
├── app/                  # Next.js 15 App Router pages & layouts
│   ├── layout.tsx        # Global metadata & Providers (next-themes)
│   ├── page.tsx          # Landing page (combines sections)
│   ├── events/page.tsx   # Dedicated Events Hub
│   ├── team/page.tsx     # Dedicated Team Directory
│   └── projects/page.tsx # Dedicated Projects Showcase
├── components/           # Reusable UI elements
│   ├── ui/               # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── sections/         # Page sections (hero, about, domains, etc.)
│   ├── navbar.tsx        # Top navigation
│   └── footer.tsx        # Global footer
├── config/
│   └── constants.ts      # Immutable constants (see TRD.md §4)
├── data/                 # JSON Datasets (Single source of truth)
│   ├── events.json       # Chapter workshops & hackathons
│   ├── team.json         # Organizers & domain leads
│   ├── domains.json      # Technical domain details
│   ├── projects.json     # Student-built projects
│   └── faq.json          # Frequently asked questions
└── types/
    └── schema.ts         # TypeScript interfaces & Zod schemas
```

---

## 2. Data Schemas & TypeScript Contracts

### 2.1 Events Contract (`/src/data/events.json`)

```typescript
export interface EventItem {
  id: string;                      // Unique slug: e.g. "google-cloud-study-jam-2026"
  title: string;                   // Event name: e.g. "Cloud Study Jam: GenAI on Google Cloud"
  description: string;             // Short 2-3 sentence summary of the event
  date: string;                    // ISO 8601 string: e.g. "2026-11-20T14:00:00+05:30"
  location: string;                // Venue: e.g. "Audi 2, BPPIMT Campus" or "Google Meet"
  mode: "in-person" | "virtual" | "hybrid"; // Attendance mode
  domainId: "cloud" | "ai-ml" | "web" | "android" | "security"; // Matching domain ID
  speaker: {
    name: string;                  // Speaker full name
    role: string;                  // Title/Organization: e.g. "GDE, Cloud & ML"
    avatarUrl: string;             // Relative path or verified HTTPS image
  };
  rsvpUrl: string;                 // Official Bevy or registration link
  status: "upcoming" | "past";     // Event timeline state
  tags: string[];                  // Keywords: ["Google Cloud", "GenAI", "Hands-on"]
}
```

#### JSON Sample (`events.json`)
```json
[
  {
    "id": "cloud-study-jam-genai",
    "title": "Cloud Study Jam: GenAI & Vertex AI Workshop",
    "description": "Hands-on lab exploring Vertex AI, prompt engineering, and deploying Gemini models on Google Cloud Platform.",
    "date": "2026-11-22T14:30:00+05:30",
    "location": "Central Seminar Hall, BPPIMT",
    "mode": "in-person",
    "domainId": "cloud",
    "speaker": {
      "name": "Arjun Sharma",
      "role": "Cloud Architect & GDG Mentor",
      "avatarUrl": "/images/speakers/arjun-sharma.webp"
    },
    "rsvpUrl": "https://gdg.community.dev/events/details/cloud-study-jam-bppimt/",
    "status": "upcoming",
    "tags": ["Google Cloud", "Vertex AI", "Gemini", "Workshop"]
  }
]
```

---

### 2.2 Core Team Contract (`/src/data/team.json`)

```typescript
export interface TeamMember {
  id: string;                      // Unique slug: e.g. "sayim-khan"
  name: string;                    // Full name
  role: string;                    // Exact title: e.g. "Tech Team Lead", "GDG Campus Organizer"
  tier: "organizer" | "lead" | "core"; // Visual grouping tier
  domainId?: "cloud" | "ai-ml" | "web" | "android" | "security" | "management";
  bio: string;                     // 1-2 sentence bio
  avatarUrl: string;               // Image path in /public/images/team/
  socials: {
    linkedin?: string;             // Full HTTPS URL
    github?: string;               // Full HTTPS URL
    twitter?: string;              // Full HTTPS URL
    portfolio?: string;            // Full HTTPS URL
  };
}
```

#### JSON Sample (`team.json`)
```json
[
  {
    "id": "tech-lead-bppimt",
    "name": "Sayim Khan",
    "role": "Tech Team Lead",
    "tier": "lead",
    "domainId": "web",
    "bio": "Leading frontend and architecture initiatives for GDG on Campus BPPIMT.",
    "avatarUrl": "/images/team/sayim-khan.webp",
    "socials": {
      "linkedin": "https://linkedin.com/in/sayimkhan",
      "github": "https://github.com/sayimkhan"
    }
  }
]
```

---

### 2.3 Student Projects Contract (`/src/data/projects.json`)

```typescript
export interface ProjectItem {
  id: string;                      // Unique slug: e.g. "campus-lost-and-found"
  title: string;                   // Project title
  tagline: string;                 // 1-sentence value proposition
  description: string;             // Short description of architecture and features
  domainId: "cloud" | "ai-ml" | "web" | "android" | "security";
  technologies: string[];          // e.g. ["Next.js", "Firebase", "TensorFlow"]
  thumbnailUrl: string;            // Project preview image in /public/images/projects/
  githubUrl: string;               // Full GitHub repository URL
  demoUrl?: string;                // Optional live deployment URL
  contributors: string[];          // Names of student builders
}
```

---

### 2.4 Technology Domains Contract (`/src/data/domains.json`)

```typescript
export interface DomainItem {
  id: "cloud" | "ai-ml" | "web" | "android" | "security";
  name: string;                    // e.g. "Artificial Intelligence & ML"
  shortCode: string;               // e.g. "AI/ML"
  colorTheme: "blue" | "red" | "yellow" | "green"; // GDG brand color alignment
  iconName: string;                // Lucide React icon identifier (e.g. "Cpu", "Cloud")
  description: string;             // Scope of the domain at campus
  leadName: string;                // Assigned domain lead name
  topics: string[];                // ["Gemini API", "PyTorch", "Computer Vision"]
}
```

---

### 2.5 Frequently Asked Questions Contract (`/src/data/faq.json`)

```typescript
export interface FAQItem {
  id: string;                      // e.g. "how-to-join"
  question: string;                // Question text
  answer: string;                  // Direct, helpful answer
  category: "general" | "events" | "membership" | "roles";
}
```

---

> **Final Boundary Notice:** No other endpoints/fields should be added without updating this section first.

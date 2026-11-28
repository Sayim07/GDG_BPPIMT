import type { Metadata } from "next";
import { Events } from "@/components/sections/events";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Events | GDG on Campus BPPIMT | GDG BPPIMT",
  description:
    "Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus BPPIMT.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events | GDG on Campus BPPIMT | GDG BPPIMT",
    description:
      "Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus BPPIMT.",
    url: "https://bppimtgdg.vercel.app/events",
    type: "website",
    images: ["/images/gdg-logo-square.png"],
  },
};

const eventsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://bppimtgdg.vercel.app",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Events",
          "item": "https://bppimtgdg.vercel.app/events",
        },
      ],
    },
  ],
};

export default function EventsPage() {
  return (
    <div className="relative w-full min-h-screen py-8 sm:py-12 bg-[#EEF7EE] dark:bg-[#0c140e] text-slate-900 dark:text-zinc-100 transition-colors overflow-hidden">
      <script
        id="events-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />
      {/* Retro Greenish Technical Graph-Paper Grid Background */}
      <GridBackground variant="retro-green" />

      {/* Main Content Layer */}
      <div className="relative z-10 w-full">
        <Events />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { TeamTree } from "@/components/sections/team-tree";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Our Team | GDG on Campus BPPIMT | GDG BPPIMT",
  description:
    "Explore the official leadership and core members of Google Developer Groups on Campus BPPIMT, featuring On-Campus Organizers and Domain Teams.",
  alternates: {
    canonical: "/team",
  },
  openGraph: {
    title: "Our Team | GDG on Campus BPPIMT | GDG BPPIMT",
    description:
      "Explore the official leadership and core members of Google Developer Groups on Campus BPPIMT, featuring On-Campus Organizers and Domain Teams.",
    url: "https://bppimtgdg.vercel.app/team",
    type: "website",
    images: ["/images/gdg-logo-square.png"],
  },
};

const teamSchema = {
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
          "name": "Our Team",
          "item": "https://bppimtgdg.vercel.app/team",
        },
      ],
    },
    {
      "@type": "ItemList",
      "name": "GDG on Campus BPPIMT Leadership",
      "itemListElement": [
        {
          "@type": "Person",
          "name": "Protyoy Bhandary",
          "jobTitle": "GDG On Campus Organizer",
          "worksFor": {
            "@id": "https://bppimtgdg.vercel.app/#organization",
          },
          "image": "https://bppimtgdg.vercel.app/images/team/protyoy-bhandary.jpg",
          "sameAs": [
            "https://www.linkedin.com/in/protyoy-bhandary/",
            "https://github.com/prox004",
          ],
        },
        {
          "@type": "Person",
          "name": "Sagnik Maitra",
          "jobTitle": "GDG On Campus Organizer",
          "worksFor": {
            "@id": "https://bppimtgdg.vercel.app/#organization",
          },
          "image": "https://bppimtgdg.vercel.app/images/team/sagnik-maitra.jpg",
          "sameAs": [
            "https://linkedin.com/in/sagnikmaitra",
            "https://github.com/HeX-ecutioner",
          ],
        },
        {
          "@type": "Person",
          "name": "Sneha Patra",
          "jobTitle": "GDG On Campus Organizer",
          "worksFor": {
            "@id": "https://bppimtgdg.vercel.app/#organization",
          },
          "image": "https://bppimtgdg.vercel.app/images/team/sneha-patra.jpg",
          "sameAs": [
            "https://www.linkedin.com/in/sneha-patra-9a1922346",
            "https://github.com/SneJ2703",
          ],
        },
      ],
    },
  ],
};

export default function TeamPage() {
  return (
    <div className="relative w-full min-h-screen pt-4 pb-12 sm:pt-6 sm:pb-16 bg-[#F5EEDB] dark:bg-[#181714] text-slate-900 dark:text-zinc-100 transition-colors overflow-hidden">
      <script
        id="team-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      {/* 21st.dev Warm Paper Technical Grid Background matching placement tracker style */}
      <GridBackground variant="warm-paper" />

      {/* Foreground Content Layer */}
      <div className="relative z-10 w-full">
        {/* Main Organizational Tree */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamTree />
        </div>
      </div>
    </div>
  );
}

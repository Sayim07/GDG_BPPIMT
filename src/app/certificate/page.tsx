import { Suspense } from "react";
import type { Metadata } from "next";
import { CertificateClient } from "./certificate-client";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Event Certificate Hub | GDG on Campus BPPIMT | GDG BPPIMT",
  description:
    "Verify your event attendance and download your official Certificate of Participation from Google Developer Groups on Campus BPPIMT.",
  alternates: {
    canonical: "/certificate",
  },
  openGraph: {
    title: "Event Certificate Hub | GDG on Campus BPPIMT | GDG BPPIMT",
    description:
      "Verify your event attendance and download your official Certificate of Participation from Google Developer Groups on Campus BPPIMT.",
    url: "https://bppimtgdg.vercel.app/certificate",
    type: "website",
    images: ["/images/gdg-logo-square.png"],
  },
};

const certificateSchema = {
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
          "name": "Event Certificate Hub",
          "item": "https://bppimtgdg.vercel.app/certificate",
        },
      ],
    },
  ],
};

export default function CertificatePage() {
  return (
    <main className="relative w-full min-h-screen py-8 sm:py-14 bg-[#F0F7FF] dark:bg-[#0c1322] text-slate-900 dark:text-zinc-100 transition-colors overflow-hidden">
      <script
        id="certificate-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(certificateSchema) }}
      />
      {/* Modern Blue Technical Graph-Paper Grid Background */}
      <GridBackground variant="default" />

      <div className="relative z-10 w-full">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                Loading Certificate Portal...
              </p>
            </div>
          }
        >
          <CertificateClient />
        </Suspense>
      </div>
    </main>
  );
}

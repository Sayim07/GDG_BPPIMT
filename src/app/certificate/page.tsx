import { Suspense } from "react";
import type { Metadata } from "next";
import { CertificateClient } from "./certificate-client";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Event Certificate Hub | GDG on Campus BPPIMT",
  description:
    "Verify your event attendance and download your official Certificate of Participation from Google Developer Groups on Campus BPPIMT.",
};

export default function CertificatePage() {
  return (
    <main className="relative w-full min-h-screen py-8 sm:py-14 bg-[#F0F7FF] dark:bg-[#0c1322] text-slate-900 dark:text-zinc-100 transition-colors overflow-hidden">
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

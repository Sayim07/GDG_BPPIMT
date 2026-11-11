import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SocialSection } from "@/components/sections/social";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Social & Community",
  description:
    "Official Google Developer Groups on Campus BPPIMT social media channels, open-source repositories, and discussion communities.",
};

export default function SocialPage() {
  return (
    <div className="relative w-full min-h-screen py-8 sm:py-14 bg-surface-page transition-colors overflow-hidden">
      {/* Dynamic Grid Background */}
      <GridBackground />

      {/* Foreground Content Layer */}
      <div className="relative z-10 w-full">
        {/* Navigation Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-zinc-300 hover:text-primary transition-colors py-2 px-3 rounded-full hover:bg-surface-subtle group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main Social Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialSection />
        </div>
      </div>
    </div>
  );
}


import type { Metadata } from "next";
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
        {/* Main Social Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialSection />
        </div>
      </div>
    </div>
  );
}


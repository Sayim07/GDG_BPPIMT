import type { Metadata } from "next";
import { TeamTree } from "@/components/sections/team-tree";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Our Team | GDG on Campus BPPIMT",
  description:
    "Explore the official leadership and core members of Google Developer Groups on Campus BPPIMT, featuring On-Campus Organizers and Domain Teams.",
};

export default function TeamPage() {
  return (
    <div className="relative w-full min-h-screen pt-4 pb-12 sm:pt-6 sm:pb-16 bg-[#F5EEDB] dark:bg-[#181714] text-slate-900 dark:text-zinc-100 transition-colors overflow-hidden">
      {/* 21st.dev Warm Paper Technical Grid Background matching placement tracker style */}
      <GridBackground variant="warm-paper" />

      {/* Foreground Content Layer */}
      <div className="relative z-10 w-full">
        {/* Main Organizational Tree */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamTree />
        </div>
      </div>
    </div>
  );
}

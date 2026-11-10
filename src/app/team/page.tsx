import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamTree } from "@/components/sections/team-tree";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Team & Org Tree",
  description:
    "Explore the official organizational hierarchy tree of Google Developer Groups on Campus BPPIMT, featuring Organizers, Domain Leads, and Core Contributors.",
};

export default function TeamPage() {
  return (
    <div className="relative w-full min-h-screen py-8 sm:py-14 bg-surface-page transition-colors overflow-hidden">
      {/* 21st.dev Animated Grid Background Effect */}
      <GridBackground />

      {/* Foreground Content Layer */}
      <div className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          {/* Breadcrumb Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-zinc-300 hover:text-primary transition-colors py-2 px-3 rounded-full hover:bg-surface-subtle group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main Organizational Tree */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamTree />
        </div>
      </div>
    </div>
  );
}

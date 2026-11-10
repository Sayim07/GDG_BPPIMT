import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamTree } from "@/components/sections/team-tree";

export const metadata: Metadata = {
  title: "Team & Org Tree",
  description:
    "Explore the official organizational hierarchy tree of Google Developer Groups on Campus BPPIMT, featuring Organizers, Domain Leads, and Core Contributors.",
};

export default function TeamPage() {
  return (
    <div className="relative w-full min-h-screen py-8 sm:py-14 bg-surface-page transition-colors overflow-hidden">
      {/* Subtle Ambient Background Mesh Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#4285F4]/10 via-[#EA4335]/5 to-transparent blur-3xl opacity-70 -z-10" />

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
  );
}

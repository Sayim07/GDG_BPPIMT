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
    <div className="w-full min-h-screen py-8 sm:py-12 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        {/* Breadcrumb Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-primary transition-colors py-2 group"
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

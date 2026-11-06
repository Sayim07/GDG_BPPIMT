import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Events } from "@/components/sections/events";
import { CommunityBanner } from "@/components/sections/community-banner";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus BPPIMT.",
};

export default function EventsPage() {
  return (
    <div className="w-full min-h-screen py-10 bg-surface-page transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        {/* Breadcrumb Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors py-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Events Section */}
      <Events />

      {/* Community Banner */}
      <CommunityBanner />
    </div>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Team } from "@/components/sections/team";
import { CommunityBanner } from "@/components/sections/community-banner";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the student organizers, technical domain leads, and mentors behind Google Developer Groups on Campus BPPIMT.",
};

export default function TeamPage() {
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

      {/* Main Team Section */}
      <Team />

      {/* Community Banner */}
      <CommunityBanner />
    </div>
  );
}


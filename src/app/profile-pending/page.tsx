import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Sparkles, Users } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
  title: "Profile Coming Soon | GDG on Campus BPPIMT",
  description: "Team member social profile links are currently being updated by GDG on Campus BPPIMT.",
};

export default function ProfilePendingPage() {
  return (
    <div className="relative w-full min-h-screen py-16 flex items-center justify-center bg-[#F5EEDB] dark:bg-[#181714] transition-colors overflow-hidden px-4">
      {/* Animated Warm Paper Grid Background */}
      <GridBackground variant="warm-paper" />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#1e1e24]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] shadow-2xl text-center">
        {/* Animated Google-colored icon ring */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#4285F4]/10 via-[#EA4335]/10 to-[#FBBC04]/10 border border-[#4285F4]/30 flex items-center justify-center mb-6 shadow-inner relative group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853] opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
          <Clock className="w-10 h-10 text-primary relative z-10 animate-pulse" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profile Update in Progress</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Profile Will Be Added Soon
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-8">
          This team member&apos;s GitHub, LinkedIn, and social links are currently being verified and updated by the GDG on Campus leadership. Please check back soon!
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <Link
            href="/team"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Explore Full Team</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

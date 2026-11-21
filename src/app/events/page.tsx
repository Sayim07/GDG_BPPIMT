import type { Metadata } from "next";
import { Events } from "@/components/sections/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Official events, technical workshops, study jams, and hackathons hosted by Google Developer Groups on Campus BPPIMT.",
};

export default function EventsPage() {
  return (
    <div className="w-full min-h-screen py-10 bg-surface-page transition-colors">
      {/* Main Events Section */}
      <Events />
    </div>
  );
}


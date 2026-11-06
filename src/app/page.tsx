import { Hero } from "@/components/sections/hero";
import { Pillars } from "@/components/sections/pillars";
import { Tracks } from "@/components/sections/tracks";
import { Events } from "@/components/sections/events";
import { Team } from "@/components/sections/team";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <Hero />
      <Pillars />
      <Tracks />
      <Events />
      <Team />
      <FAQ />
    </main>
  );
}

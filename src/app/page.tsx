import { Hero } from "@/components/sections/hero";
import { Pillars } from "@/components/sections/pillars";
import { Tracks } from "@/components/sections/tracks";
import { Events } from "@/components/sections/events";
import { Team } from "@/components/sections/team";
import { FAQ } from "@/components/sections/faq";
import { ScrollStack, ScrollStackItem } from "@/components/ui/scroll-stack";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <Hero />

      <ScrollStack
        useWindowScroll={true}
        stackPosition="76px"
        itemDistance={140}
        itemStackDistance={20}
        itemScale={0.035}
        baseScale={0.88}
        dimAmount={0.2}
        blurAmount={0}
        tiltAmount={0}
        rotationAmount={0}
        holdDistance={220}
        smoothScroll={false}
        className="w-full"
      >
        <ScrollStackItem key="about" id="about">
          <Pillars isCard />
        </ScrollStackItem>

        <ScrollStackItem key="tracks" id="tracks">
          <Tracks isCard />
        </ScrollStackItem>

        <ScrollStackItem key="events" id="events">
          <Events isCard />
        </ScrollStackItem>

        <ScrollStackItem key="team" id="team">
          <Team isCard />
        </ScrollStackItem>

        <ScrollStackItem key="faq" id="faq">
          <FAQ isCard />
        </ScrollStackItem>
      </ScrollStack>
    </main>
  );
}

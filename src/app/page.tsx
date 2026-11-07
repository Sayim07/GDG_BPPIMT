import { Hero } from "@/components/sections/hero";
import { Pillars } from "@/components/sections/pillars";
import { Tracks } from "@/components/sections/tracks";
import { Events } from "@/components/sections/events";
import { Team } from "@/components/sections/team";
import { FAQ } from "@/components/sections/faq";
import { ScrollStack, ScrollStackItem } from "@/components/ui/scroll-stack";
import { CardsGlassBackground } from "@/components/ui/cards-glass-background";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <Hero />

      {/* Cards Section with Refractive GDG GlassTiles Background */}
      <section className="relative w-full">
        {/* Sticky Background for the Cards Area */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
          <CardsGlassBackground />
        </div>

        {/* Content Layer (Cards) */}
        <div className="relative z-10 w-full -mt-[100vh]">
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
            className="w-full pt-16 sm:pt-20"
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
        </div>
      </section>
    </main>
  );
}

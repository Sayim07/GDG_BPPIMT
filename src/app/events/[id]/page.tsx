import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_EVENTS, getEventById } from "@/data/all-events";
import { EventDetailView } from "@/components/sections/event-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ALL_EVENTS.map((event) => ({
    id: event.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return {
      title: "Event Not Found | GDG on Campus BPPIMT",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${event.title} | GDG on Campus BPPIMT`,
    description: event.shortDescription,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetailView event={event} />;
}

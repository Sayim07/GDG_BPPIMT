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

  const title = `${event.title} | GDG on Campus BPPIMT`;
  const description = event.shortDescription;
  const pageUrl = `https://bppimtgdg.vercel.app/events/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/events/${id}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
      images: ["/images/gdg-logo-square.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/gdg-logo-square.png"],
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
    return null;
  }

  const eventSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://bppimtgdg.vercel.app",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Events",
            "item": "https://bppimtgdg.vercel.app/events",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": event.title,
            "item": `https://bppimtgdg.vercel.app/events/${event.id}`,
          },
        ],
      },
      {
        "@type": "Event",
        "@id": `https://bppimtgdg.vercel.app/events/${event.id}/#event`,
        "name": event.title,
        "description": event.shortDescription,
        "startDate": `${event.date}T10:00:00+05:30`,
        "endDate": `${event.endDate || event.date}T18:00:00+05:30`,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": event.venue || event.location || "B.P. Poddar Institute of Management and Technology",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "137, V.I.P. Road, Poddar Vihar",
            "addressLocality": "Kolkata",
            "addressRegion": "West Bengal",
            "postalCode": "700052",
            "addressCountry": "IN",
          },
        },
        "image": [
          "https://bppimtgdg.vercel.app/images/gdg-logo-square.png"
        ],
        "organizer": {
          "@id": "https://bppimtgdg.vercel.app/#organization",
        },
        "offers": {
          "@type": "Offer",
          "url": event.rsvpUrl || `https://bppimtgdg.vercel.app/events/${event.id}`,
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-01-01T00:00:00+05:30",
        },
      },
    ],
  };

  return (
    <>
      <script
        id={`event-schema-${event.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <EventDetailView event={event} />
    </>
  );
}

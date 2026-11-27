import { NextResponse } from "next/server";
import attendeesData from "@/data/attendees.json";

export interface AttendeeRecord {
  id: string;
  name: string;
  email: string;
  attended: boolean;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  issuedAt?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
    const eventId = typeof body?.eventId === "string" ? body.eventId.trim() : "";

    if (!rawEmail) {
      return NextResponse.json(
        {
          success: false,
          code: "EMAIL_REQUIRED",
          message: "Please enter your registered email address.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = rawEmail.toLowerCase();
    const records = attendeesData as AttendeeRecord[];

    // If no records have been uploaded yet
    if (!records || records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "DATA_PROCESSING",
          message:
            "Event attendee data is currently being prepared and verified from the official Bevy check-in list. Please check back soon or contact the GDG BPPIMT team.",
        },
        { status: 404 }
      );
    }

    // Lookup attendee by email (and optionally eventId)
    const match = records.find((item) => {
      const emailMatches = item.email.trim().toLowerCase() === normalizedEmail;
      if (!emailMatches) return false;
      if (eventId && item.eventId) {
        return item.eventId.toLowerCase() === eventId.toLowerCase();
      }
      return true;
    });

    if (!match) {
      return NextResponse.json(
        {
          success: false,
          code: "NOT_FOUND",
          message:
            "No verified attendee record found for this email address. Please make sure you are entering the exact email ID used during registration/check-in on Bevy.",
        },
        { status: 404 }
      );
    }

    if (match.attended === false) {
      return NextResponse.json(
        {
          success: false,
          code: "NOT_ATTENDED",
          message:
            "Your RSVP registration was found, but physical attendance check-in was not recorded for this event. Certificates are issued exclusively to verified attendees.",
        },
        { status: 403 }
      );
    }

    // Successful match
    return NextResponse.json({
      success: true,
      certificate: {
        certId: match.id || `GDG-BPPIMT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: match.name,
        email: match.email,
        eventName:
          match.eventName || "GDG On Campus BPPIMT — Featured Event & Workshop",
        eventDate: match.eventDate || "November 25, 2026",
        issuedDate: match.issuedAt || "November 27, 2026",
        organizerName: "Protyoy Bhandary",
        organizerRole: "GDG On Campus Organizer",
        chapterName: "Google Developer Groups on Campus • BPPIMT",
      },
    });
  } catch (error) {
    console.error("Certificate API error:", error);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "An unexpected error occurred while verifying certificate. Please try again.",
      },
      { status: 500 }
    );
  }
}

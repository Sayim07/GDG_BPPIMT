import { NextResponse } from "next/server";
import attendeesData from "@/data/attendees.json";

export interface AttendeeRecord {
  id: string;
  name: string;
  rawName?: string;
  email: string;
  phone?: string;
  dept?: string;
  year?: string;
  rollNo?: string;
  attended: boolean;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  issuedAt?: string;
}

function normalizeText(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawQuery =
      typeof body?.query === "string"
        ? body.query.trim()
        : typeof body?.email === "string"
        ? body.email.trim()
        : typeof body?.name === "string"
        ? body.name.trim()
        : "";

    const eventId = typeof body?.eventId === "string" ? body.eventId.trim() : "";

    if (!rawQuery) {
      return NextResponse.json(
        {
          success: false,
          code: "QUERY_REQUIRED",
          message: "Please enter your registered email address or full name.",
        },
        { status: 400 }
      );
    }

    const normalizedQuery = normalizeText(rawQuery);
    const records = attendeesData as AttendeeRecord[];

    // If no records in database
    if (!records || records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "DATA_PROCESSING",
          message:
            "Event attendee data is currently being processed. Please check back shortly or contact the GDG BPPIMT team.",
        },
        { status: 404 }
      );
    }

    // Lookup attendee by Email OR Full Name (case-insensitive & multiple spaces tolerant)
    const match = records.find((item) => {
      if (eventId && item.eventId && item.eventId.toLowerCase() !== eventId.toLowerCase()) {
        return false;
      }

      // 1. Check if email matches (if attendee has an email)
      if (item.email && item.email.trim().toLowerCase() === normalizedQuery) {
        return true;
      }

      // 2. Check if clean name matches (e.g. "Sayim Mullick", "sayim mullick", "SAYIM MULLICK")
      if (item.name && normalizeText(item.name) === normalizedQuery) {
        return true;
      }

      // 3. Check if rawName from CSV matches
      if (item.rawName && normalizeText(item.rawName) === normalizedQuery) {
        return true;
      }

      return false;
    });

    if (!match) {
      return NextResponse.json(
        {
          success: false,
          code: "NOT_FOUND",
          message: `No verified attendee record found for "${rawQuery}". Please make sure you are entering your exact name as given during attendance, or your registered email address.`,
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
            "Your registration was found, but physical attendance check-in was not recorded for this event. Certificates are issued exclusively to verified attendees.",
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
        email: match.email || "",
        dept: match.dept || "",
        year: match.year || "",
        eventName:
          match.eventName || "GDG On Campus BPPIMT — Featured Event & Workshop",
        eventDate: match.eventDate || "November 25, 2026",
        issuedDate: match.issuedAt || "November 28, 2026",
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

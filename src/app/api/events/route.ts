import { NextResponse } from "next/server";
import { getAllEvents } from "@/data/all-events";

export async function GET() {
  return NextResponse.json(getAllEvents());
}


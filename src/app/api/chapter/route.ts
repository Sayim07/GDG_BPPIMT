import { NextResponse } from "next/server";
import chapterConfig from "@/data/chapter.json";

export async function GET() {
  return NextResponse.json(chapterConfig);
}


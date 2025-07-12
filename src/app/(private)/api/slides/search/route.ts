// src/app/api/slides/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pm = url.searchParams.get("pm");

    if (!pm) {
      return NextResponse.json({ slides: [] }, { status: 400 });
    }

    await connectToDB();

    const slides = await Slide.find({
      pmSerialNumber: pm
    });

    return NextResponse.json({ slides }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Search error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to search slides", details: err?.message },
      { status: 500 }
    );
  }
}

// src/app/api/slides/filter/route.ts
import { NextRequest, NextResponse } from "next/server";
import Slide from "@/models/slide";
import { connectToDB } from "@/lib/mongo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Start and end dates are required" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const slides = await Slide.find({
      processDate: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    }).sort({ processDate: 1 });

    return NextResponse.json({ slides });
  } catch (err: any) {
    console.error("❌ Error filtering by date:", err.message);
    return NextResponse.json(
      { error: "Failed to filter slides by date" },
      { status: 500 }
    );
  }
}

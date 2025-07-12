import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";

// Example URL: /api/slides/filter-by-date?start=2022-01-01&end=2022-01-31
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json({ error: "Missing start or end date" }, { status: 400 });
    }

    const slides = await Slide.find({
      processDate: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    })
      .sort({ processDate: 1 }) // optional: sort ascending by date
      .limit(100); // optional: limit results

    return NextResponse.json({ slides });
  } catch (err) {
    console.error("❌ Error filtering slides by date:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// src/app/api/slides/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";

// export async function GET() {
//   try {
//     await connectToDB();
//     const slides = await Slide.find({}).sort({ createdAt: -1 }).limit(100);
//     return NextResponse.json({ slides });
//   } catch (err: any) {
//     console.error("❌ Failed to fetch slides:", err.message);
//     return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
//   }
// }
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const totalSlides = await Slide.countDocuments();
    const slides = await Slide.find().skip(skip).limit(limit);

    return NextResponse.json({
      slides,
      total: totalSlides,
      page,
      totalPages: Math.ceil(totalSlides / limit),
    });
  } catch (err: any) {
    console.error("❌ Pagination error:", err.message || err);
    return NextResponse.json(
      { error: "Failed to fetch paginated slides" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import Slide from "@/models/slide";
import { connectToDB } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    const { _id, ...updatedFields } = data;

    if (!_id) {
      return NextResponse.json({ error: "Missing slide ID" }, { status: 400 });
    }

    const updatedSlide = await Slide.findByIdAndUpdate(_id, updatedFields, { new: true });

    if (!updatedSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slide updated", slide: updatedSlide });
  } catch (err: any) {
    console.error("❌ Slide update error:", err.message);
    return NextResponse.json({ error: "Slide update failed" }, { status: 500 });
  }
}

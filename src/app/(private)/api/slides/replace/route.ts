// src/app/api/slides/replace/route.ts

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";

export async function POST(req: Request) {
 
 console.log("🛠️ Incoming slide replacement request");

  try {
    await connectToDB();
    const body = await req.json();

    console.log("📦 Received request body:", body);

    const { slideId, updates } = body;
    console.log("🔍 Payload received:", body);
    console.log("➡️ Deactivating slideId:", slideId);
    console.log("🧪 Creating new slide with:", updates);

    if (!slideId || !updates) {
      console.warn("❌ Missing slideId or updates in request");
      return NextResponse.json({ error: "Missing slideId or updates object" }, { status: 400 });
    }

    // Step 1: Find the current active slide
    const oldSlide = await Slide.findOne({ _id: slideId, active: true });
    if (!oldSlide) {
      console.warn("❌ No active slide found for ID:", slideId);
      return NextResponse.json({ error: "Active slide not found" }, { status: 404 });
    }

    console.log("🔍 Found active slide:", oldSlide);

    // Step 2: Deactivate the old slide
    oldSlide.active = false;
    await oldSlide.save();
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.__v;
    console.log("✅ Old slide deactivated:", oldSlide._id);

    // Step 3: Create new slide
    const newSlide = await Slide.create({
      ...updates,
      replacesId: oldSlide._id,
      active: true,
    });

    console.log("🆕 New slide created:", newSlide);

    return NextResponse.json({
      message: "Slide replaced successfully",
      oldSlideId: oldSlide._id,
      newSlideId: newSlide._id,
    });
  } catch (err) {
    console.error("🔥 Replace route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

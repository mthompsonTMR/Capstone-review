// src/app/api/tissue/replace/route.ts

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Tissue from "@/models/tissue";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { tissueId, updates } = body;

    if (!tissueId || !updates) {
      return NextResponse.json({ error: "Missing tissueId or updates object" }, { status: 400 });
    }

    // Step 1: Find and deactivate the existing record
    const oldTissue = await Tissue.findOne({ tissueId, active: true });
    if (!oldTissue) {
      return NextResponse.json({ error: "Active tissue not found" }, { status: 404 });
    }

    oldTissue.active = false;
    await oldTissue.save();

    // Step 2: Create a new updated record
    const newTissue = await Tissue.create({
      ...updates,
      tissueId: updates.tissueId || tissueId, // maintain ID if not changing
      replacesId: oldTissue._id, // link to original
      active: true,
    });

    return NextResponse.json({
      message: "Tissue replaced successfully",
      oldTissueId: oldTissue._id,
      newTissueId: newTissue._id,
    });
  } catch (err) {
    console.error("Replace route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

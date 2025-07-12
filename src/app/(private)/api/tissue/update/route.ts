import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Tissue from "@/models/tissue";

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const body = await req.json(); // ✅ Properly parse JSON body

    const { tissueId, imageUrl, diagnosis, notes, stainedSlideId } = body;

    // 🔄 Deactivate previous records with same tissueId
    await Tissue.updateMany(
      { tissueId },
      { $set: { active: false } }
    );

    // ✅ Insert new tissue record with active = true
    const newTissue = new Tissue({
      tissueId,
      imageUrl,
      diagnosis,
      notes,
      stainedSlideId,
      active: true
    });

    await newTissue.save();

    return NextResponse.json({ success: true, tissue: newTissue });
  } catch (err: any) {
    console.error("Update tissue failed:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


// src/app/api/tissue/route.ts

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Tissue from "@/models/tissue";

export async function GET() {
  try {
    await connectToDB();

    // ✅ Only fetch tissue records marked as active
    const tissues = await Tissue.find({ active: true }).sort({ createdAt: -1 });

    return NextResponse.json(tissues);
  } catch (err) {
    console.error("❌ Failed to fetch tissue records", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

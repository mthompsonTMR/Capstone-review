// File: src/app/api/fhir/patient/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import PatientModel from "@/models/patient";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const total = await PatientModel.countDocuments();
    const patients = await PatientModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients." },
      { status: 500 }
    );
  }
}
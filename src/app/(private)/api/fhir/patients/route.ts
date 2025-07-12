import { connectToDB } from "@/lib/mongo";
import FhirPatient from "@/models/patient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const patients = await FhirPatient.find({})
      .sort({ createdAt: -1 }) // Newest first
      .select("_id firstName lastName birthDate gender createdAt"); // Only needed fields

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

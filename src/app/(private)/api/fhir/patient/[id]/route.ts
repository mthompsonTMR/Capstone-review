import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import FhirPatient from "@/models/patient";
import { getFhirPatientFromAPI } from "@/lib/fhir/fetchFromHapi";
import { transformFhirToSimplified } from "@/lib/fhir/transform";

// ✅ GET /api/fhir/patient/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const fhirId = params.id;

    const exists = await FhirPatient.findOne({ fhirId });
    if (exists) {
      return NextResponse.json(
        { message: "Patient already exists", id: exists._id },
        { status: 200 }
      );
    }

    const rawFhirData = await getFhirPatientFromAPI(fhirId);
    if (!rawFhirData) {
      return NextResponse.json(
        { error: "Patient not found in HAPI" },
        { status: 404 }
      );
    }

    const patientData = transformFhirToSimplified(rawFhirData);
    const saved = await FhirPatient.create(patientData);

    return NextResponse.json(
      { message: "Patient saved to MongoDB", id: saved._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[GET] Internal server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

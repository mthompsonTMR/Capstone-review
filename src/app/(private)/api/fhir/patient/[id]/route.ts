import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import FhirPatient from "@/models/patient";
import { getFhirPatientFromAPI } from "@/lib/fhir/fetchFromHapi";
import { transformFhirToSimplified } from "@/lib/fhir/transform";

// ✅ GET /api/fhir/patient/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = context.params;

    console.log(`[GET] Fetching patient with FHIR ID: ${id}`);

    const exists = await FhirPatient.findOne({ fhirId: id });
    if (exists) {
      return NextResponse.json(
        { message: "Patient already exists", id: exists._id },
        { status: 200 }
      );
    }

    const rawFhirData = await getFhirPatientFromAPI(id);
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
    console.error("[GET] Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE /api/fhir/patient/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const deleted = await FhirPatient.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Patient deleted", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE] Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

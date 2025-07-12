import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import FhirPatient from "@/models/patient";
import { getFhirPatientFromAPI } from "@/lib/fhir/fetchFromHapi";
import { transformFhirToSimplified } from "@/lib/fhir/transform";

// ✅ GET /api/fhir/patient/[id]
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();

    const fhirId = context.params.id;

    // Step 1: Check if already exists
    const exists = await FhirPatient.findOne({ fhirId });
    if (exists) {
      return Response.json(
        { message: "Patient already exists", id: exists._id },
        { status: 200 }
      );
    }

    // Step 2: Fetch from HAPI and transform
    const rawFhirData = await getFhirPatientFromAPI(fhirId);
    if (!rawFhirData) {
      return Response.json(
        { error: "Patient not found in HAPI" },
        { status: 404 }
      );
    }

    const patientData = transformFhirToSimplified(rawFhirData);

    // Step 3: Save transformed patient to Mongo
    const saved = await FhirPatient.create(patientData);

    return Response.json(
      { message: "Patient saved to MongoDB", id: saved._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("GET /api/fhir/patient/[id] error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE /api/fhir/patient/[id]
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();

    const patientId = context.params.id;

    const deleted = await FhirPatient.findByIdAndDelete(patientId);

    if (!deleted) {
      return Response.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Patient deleted successfully", id: patientId },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/fhir/patient/[id] error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

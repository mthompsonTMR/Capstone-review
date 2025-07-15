// ✅ /src/app/(private)/api/fhir/patient/[id]/route.ts
import { NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongo";
import FhirPatient from "@/models/patient";
import { getFhirPatientFromAPI } from "@/lib/fhir/fetchFromHapi";
import { transformFhirToSimplified } from "@/lib/fhir/transform";

// ✅ GET /api/fhir/patient/[id]
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // extract [id] from route

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID param" }), {
      status: 400,
    });
  }

  console.log(`[GET] FHIR ID received: ${id}`);
  await connectToDB();

  try {
    const fhirData = await getFhirPatientFromAPI(id);
    const simplified = transformFhirToSimplified(fhirData);

    return new Response(JSON.stringify(simplified), {
      status: 200,
    });
  } catch (error) {
    console.error("[GET] Fetch failed:", error);
    return new Response(JSON.stringify({ error: "Fetch failed" }), {
      status: 500,
    });
  }
}

// ✅ DELETE /api/fhir/patient/[id]
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // extract [id] from route

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID param" }), {
      status: 400,
    });
  }

  console.log(`[DELETE] Patient ID to delete: ${id}`);
  await connectToDB();

  try {
    const deleted = await FhirPatient.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Patient not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Patient deleted", id }), {
      status: 200,
    });
  } catch (error) {
    console.error("[DELETE] Delete failed:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}


// src/app/api/fhir/patient/mock/route.ts

import { NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongo";
import FhirPatient from "@/models/patient";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const countParam = url.searchParams.get("count");
    const count = parseInt(countParam || "1", 10);

    // Fetch from randomuser.me for mock uniqueness
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch patient from mock server" }),
        { status: 500 }
      );
    }

    const { results } = await response.json();

    const insertedPatients = [];
    const insertedFhirIds: string[] = [];

    for (const person of results) {
      const fhirId = person.login.uuid;

      const exists = await FhirPatient.findOne({ fhirId });
      if (exists) continue;

      const newPatient = {
        fhirId,
        firstName: person.name.first,
        lastName: person.name.last,
        gender: person.gender,
        birthDate: person.dob.date.split("T")[0],
        mrn: person.id.value || null,
        address: {
          line: person.location.street.name,
          city: person.location.city,
          state: person.location.state,
          postalCode: person.location.postcode.toString(),
          country: person.location.country,
        },
      };

      const saved = await FhirPatient.create(newPatient);
      insertedPatients.push(saved);
      insertedFhirIds.push(fhirId); // ✅ Track inserted IDs
    }

    return new Response(
      JSON.stringify({
        message: `${insertedPatients.length} unique patients saved to MongoDB.`,
        inserted: insertedPatients.length,
        ids: insertedFhirIds, // ✅ Include fhirIds in response
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Mock Import Error:", err);
    return new Response(
      JSON.stringify({ error: "Server error during mock import" }),
      { status: 500 }
    );
  }
}

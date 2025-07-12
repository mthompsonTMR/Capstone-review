// src/app/api/fhir/patient/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Patient from "@/models/patient";
import type { PatientType } from "@/types/patient";    // ✅ Type-only import

export async function GET(req: NextRequest) {
  const countParam = req.nextUrl.searchParams.get("count");
  const count = Math.min(Number(countParam) || 3, 10); // limit to 10

  try {
    await connectToDB();

    // Fetch mock patients from public FHIR server
    const res = await fetch(`https://hapi.fhir.org/baseR4/Patient?_count=${count}`);
    const bundle = await res.json();

    if (!bundle.entry || !Array.isArray(bundle.entry)) {
      return NextResponse.json({ error: "Invalid bundle received" }, { status: 500 });
    }

    const patients = bundle.entry.map((entry: any) => {
      const p = entry.resource;
      return {
        fhirId: p.id,
        name: `${p.name?.[0]?.given?.[0] || "Unknown"} ${p.name?.[0]?.family || ""}`,
        birthDate: p.birthDate || null,
        gender: p.gender || null,
        telecom: p.telecom?.[0]?.value || null,
        address: p.address?.[0]?.city || null,
        fullResource: p,
      };
    });

    // Remove duplicates or patients without ID
    const cleaned = patients.filter((p: PatientType) => p.fhirId && p.name);


    const result = await Patient.insertMany(cleaned, { ordered: false });

    return NextResponse.json({ inserted: result.length });
  } catch (error: any) {
    console.error("FHIR batch error:", error);
    return NextResponse.json({ error: "Failed to fetch and save mock patients." }, { status: 500 });
  }
}


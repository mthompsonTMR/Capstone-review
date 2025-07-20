// src/app/api/upload/url/route.ts
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import Slide from "@/models/slide";
import { connectToDB } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const { csvUrl } = await req.json();
    console.log("📥 CSV URL received:", csvUrl);

    if (!csvUrl) {
      return NextResponse.json({ error: "CSV URL is required" }, { status: 400 });
    }

    const response = await fetch(csvUrl);
    const csvText = await response.text();
    console.log("🌐 CSV text loaded");

    const { data, errors } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error("🛑 CSV parse errors:", errors);
      return NextResponse.json({ error: "CSV parse error", details: errors }, { status: 400 });
    }

    console.log("✅ Parsed data sample:", data.slice(0, 2));

    const requiredFields = [
  "Process date",
  "PM serial number",
  "Run ID",
  "Slide ID",
  "Slide created by",
  "Stain",
  "Marker name",
  "Case ID",
];

const firstRow = data[0] as Record<string, string>;
const missingFields = requiredFields.filter(field => !(field in firstRow));

if (missingFields.length > 0) {
  console.error("🛑 CSV missing fields:", missingFields);
  return NextResponse.json(
    {
      error: "Invalid CSV format",
      code: "CSV_SCHEMA_MISMATCH",
    },
    { status: 400 }
  );
}

    await connectToDB();

  
const transformedSlides = data.map((row: any) => ({
  pmSerialNumber: row["PM serial number"],
  processDate: new Date(row["Process date"]),
  runId: row["Run ID"],
  slideId: row["Slide ID"],
  createdBy: row["Slide created by"],
  stain: row["Stain"],
  markerName: row["Marker name"],
  caseId: row["Case ID"],
}));


    await Slide.insertMany(transformedSlides);

    return NextResponse.json({
      message: "CSV uploaded and saved",
      inserted: transformedSlides.length,
    });

  } catch (err: any) {
    console.error("❌ Upload error:", err?.message || err);
    return NextResponse.json(
      {
        error: "Failed to process CSV URL",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

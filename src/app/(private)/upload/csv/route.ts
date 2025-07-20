// ✅ /src/app/(private)/api/upload/csv/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";
import { parse } from "csv-parse/sync";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    const transformedSlides = records.map((row: any) => ({
      pmSerialNumber: row["PM serial number"],
      caseId: row["Case ID"],
      runId: row["Run ID"],
      slideId: row["Slide ID"],
      createdBy: row["Slide created by"],
      processDate: new Date(row["Process date"]),
      markerName: row["Marker name"],
    }));

    await Slide.insertMany(transformedSlides);

    return NextResponse.json({
      message: "CSV uploaded and saved",
      inserted: transformedSlides.length,
    });
  } catch (error: any) {
    console.error("❌ ETL error:", error);

    // Build a more detailed error message for the frontend
    let detailedMessage = "Upload failed due to validation error.";
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(" | ");
      detailedMessage += ` Details: ${details}`;
    } else if (error._message) {
      detailedMessage += ` ${error._message}`;
    }

    return NextResponse.json({ error: detailedMessage }, { status: 500 });
  }
}

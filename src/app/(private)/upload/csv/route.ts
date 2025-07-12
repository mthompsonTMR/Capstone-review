import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";
import { parse } from "csv-parse/sync";


export async function POST(req: NextRequest) {
  await connectToDB();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const text = await file.text();
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  const formatted = records.map((row: any) => ({
    pmSerialNumber: row["PM serial number"],
    caseId: row["Case ID"],
    runId: row["Run ID"],
    slideId: row["Slide ID"],
    createdBy: row["Slide created by"],
    processDate: new Date(row["Process date"]),
    markerName: row["Marker name"],
  }));

  await Slide.insertMany(formatted);
  return NextResponse.json({ message: "Slides uploaded", count: formatted.length });
}

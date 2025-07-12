import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";
import { Readable } from "stream";
import { parse } from "csv-parse";
import multer from "multer";
import { promisify } from "util";

// Disabling Next.js default body parser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Get the raw request buffer
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString("utf-8");

    // Parse CSV with headers
    const records: any[] = [];
    const parser = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    for await (const record of parser) {
      records.push(record);
    }

    await connectToDB();

    const transformedSlides = records.map((row: any) => ({
      processDate: new Date(row["Process date"]),
      pmSerialNumber: row["PM serial number"],
      runId: row["Run ID"],
      slideId: row["Slide ID"],
      createdBy: row["Slide created by"],
      stain: row["Stain"],
      markerName: row["Marker name"],
      caseId: row["Case ID"],
    }));

    await Slide.insertMany(transformedSlides);

    return NextResponse.json({
      message: `Uploaded and saved ${transformedSlides.length} slides from file.`,
    });
  } catch (err: any) {
    console.error("❌ File Upload Error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to upload CSV file", details: err?.message || err },
      { status: 500 }
    );
  }
}

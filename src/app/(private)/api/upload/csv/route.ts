// src/app/api/upload/csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { Readable } from "stream";
import Papa from "papaparse";

import Slide from "@/models/slide";

import { connectToDB } from "@/lib/mongo";

// 👇 Helper to convert NextRequest into a stream Multer can process
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const csvText = Buffer.from(arrayBuffer).toString("utf-8");

  const { data, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    return NextResponse.json({ error: "CSV parse error", details: errors }, { status: 400 });
  }

  try {
    await connectToDB();

    // Step 1: Transform each CSV row to match your Slide schema
    const transformedSlides = data.map((row: any) => ({
      processDate: new Date(row["Process date"]),
      pmSerialNumber: row["PM serial number"],
      runId: row["Run ID"],
      slideId: row["Slide ID"],
      createdBy: row["Slide created by"],
      stain: row["Stain"],
      markerName: row["Marker name"],
      caseId: row["Case ID"],
    }));

    // Step 2: Insert into MongoDB using Mongoose model
    await Slide.insertMany(transformedSlides);

    return NextResponse.json({ message: "CSV uploaded and saved", inserted: transformedSlides.length });
  } catch (error: any) {
    console.error("❌ ETL error:", error);
    return NextResponse.json({ error: "Failed to save to MongoDB" }, { status: 500 });
  }
}

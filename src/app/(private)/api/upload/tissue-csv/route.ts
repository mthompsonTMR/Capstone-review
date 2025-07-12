// src/app/api/upload/tissue-csv/route.ts

import { NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import { connectToDB } from "@/lib/mongo";
import Tissue from "@/models/tissue";

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function parseCSV(buffer: Buffer): Promise<any[]> {
  const results: any[] = [];
  const stream = bufferToStream(buffer);

  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

export async function POST(req: Request) {
  await connectToDB();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const records = await parseCSV(buffer);
    const inserted = await Tissue.insertMany(records);

    return NextResponse.json({
      message: `${inserted.length} tissue records uploaded successfully`,
    });
  } catch (err: any) {
    console.error("❌ Upload Error:", err);
    return NextResponse.json(
      { error: "Failed to upload tissue CSV", details: err.message },
      { status: 500 }
    );
  }
}

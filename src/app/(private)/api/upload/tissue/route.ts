import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Tissue from "@/models/tissue";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(req: NextRequest) {
  await connectToDB();
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const pmSerialNumber = formData.get("pmSerialNumber")?.toString();

  if (!file || !pmSerialNumber) {
    return NextResponse.json({ error: "Missing file or pmSerialNumber" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir = path.join(process.cwd(), "public", "uploads", "tissues");
  await mkdir(dir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(dir, fileName);

  await writeFile(filePath, buffer);

  const imageUrl = `/uploads/tissues/${fileName}`;
  const tissue = await Tissue.create({ pmSerialNumber, imageUrl });

  return NextResponse.json({ message: "Tissue uploaded", tissue }, { status: 201 });
}

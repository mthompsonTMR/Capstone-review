import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";
import { Parser } from "json2csv";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");

    let slides;

    if (start && end) {
      slides = await Slide.find({
        processDate: {
          $gte: new Date(`${start}T00:00:00Z`),
          $lte: new Date(`${end}T23:59:59Z`),
        },
      }).lean();
    } else {
      slides = await Slide.find().lean();
    }

    const fields = [
      "pmSerialNumber",
      "caseId",
      "slideId",
      "createdBy",
      "processDate",
      "markerName"
    ];
    
    const parser = new Parser({ fields });
    const csv = parser.parse(slides);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=slides-export.csv",
      },
    });
  } catch (err) {
    console.error("❌ Export error:", err);
    return NextResponse.json({ message: "Export failed" }, { status: 500 });
  }
}

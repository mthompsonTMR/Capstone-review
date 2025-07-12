import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide"; // Adjust if yours is named differently

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const deleted = await Slide.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error: any) {
    console.error("❌ Slide delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}

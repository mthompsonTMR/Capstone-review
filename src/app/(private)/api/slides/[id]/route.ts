// ✅ Updated DELETE handler for /api/slides/[id]
import { connectToDB } from "@/lib/mongo";
import Slide from "@/models/slide";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Extract the [id] from the URL

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID param" }), {
      status: 400,
    });
  }

  await connectToDB();

  try {
    const deleted = await Slide.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Slide not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Slide deleted", id }), {
      status: 200,
    });
  } catch (error) {
    console.error("[DELETE] Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

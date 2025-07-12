import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"; // ✅ Add this
import { cookies } from "next/headers"; // ✅ For setting cookies in Next.js (App Router)

export async function POST(request: NextRequest) {
  console.log("🛠️ /api/users/login route HIT");

  try {
    await connect();
    console.log("✅ MongoDB connected");

    const body = await request.json();
    console.log("📦 Received body:", body);

    const { email, password } = body;

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Compare hashed password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user._id,
        name: user.username,
       },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    
    console.log("✅ Login success for:", email);


    const response = NextResponse.json({
  message: "Login successful",
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
  },
});

// ✅ Set cookie on the response object
response.cookies.set("token", token, {
  httpOnly: true,
  maxAge: 60 * 60, // 1 hour
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
});

return response;


  } catch (err: any) {
    console.error("🔥 Login route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

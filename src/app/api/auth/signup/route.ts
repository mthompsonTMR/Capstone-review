import { NextResponse } from 'next/server';
import { sendSignupEmails } from '@/lib/email';
import User from '@/models/userModel';
import { connectToDB } from "@/lib/mongo";

export async function POST(request: Request) {
  try {
    console.log("📥 Incoming signup request");

    await connectToDB();
    console.log("🔗 MongoDB connected");

    const { username, email, password } = await request.json();
    console.log("📦 Parsed body:", { username, email, password });

    // ✅ Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("⚠️ Invalid email format");
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // ✅ Password length check
    if (!password || password.length < 5) {
      console.warn("⚠️ Password too short");
      return NextResponse.json(
        { message: 'Password must be at least 5 characters' },
        { status: 400 }
      );
    }

    // 🔍 Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ User already exists");
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // 🔐 Hash password manually if model doesn’t do it
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = await User.create({ username, email, password: hashedPassword });

    // ✅ Create new user (assumes pre-save hook hashes password)
    const newUser = await User.create({ username, email, password });
    console.log("✅ User created:", newUser._id);

    // 📧 Send emails
    try {
      await sendSignupEmails({
        toUser: email,
        adminEmail: process.env.ADMIN_EMAIL!,
        userName: username,
      });
      console.log("📨 Emails sent");
    } catch (mailErr) {
      console.warn("⚠️ Email send failed:", mailErr);
      // Do NOT throw here — user is already created
    }

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Signup handler error:", error.message || error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

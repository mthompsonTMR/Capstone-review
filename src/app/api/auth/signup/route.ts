import { NextResponse } from 'next/server';
import { sendSignupEmails } from '@/lib/email'; // 👈 import the email function
import User from '@/models/userModel'; // your Mongoose model or DB method
import { connectToDB } from "@/lib/mongo"; // ✅ Connection logic here

export async function POST(request: Request) {
  try {
    await connectToDB();
    const { username, email, password } = await request.json();
     console.log("Parsed data:", { username, email, password });

     // ✅ Basic email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
}

// ✅ Password length check
if (!password || password.length < 5) {
  return NextResponse.json(
    { message: 'Password must be at least 5 characters' },
    { status: 400 }
  );
}

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // 2. Create the user
    const newUser = await User.create({ username, email, password });
   

    // 3. Send welcome + admin alert emails
    await sendSignupEmails({
      toUser: email,
      adminEmail: process.env.ADMIN_EMAIL!,
      userName: username,
    });

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

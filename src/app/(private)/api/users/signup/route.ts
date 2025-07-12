import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();
    console.log("connected to MongoDB");

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("user already exits");
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("user saved:", savedUser)
    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("server Error in signup route", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

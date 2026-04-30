import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please provide all required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User with this email already exists." },
          { status: 409 }
        );
      } else {
        // Overwrite unverified user
        existingUser.name = name;
        existingUser.password = hashedPassword;
        await existingUser.save();
        return NextResponse.json(
          { message: "User registration updated. Please verify email.", userId: existingUser._id },
          { status: 200 }
        );
      }
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student", // Default role
    });

    return NextResponse.json(
      { message: "User registered successfully.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}

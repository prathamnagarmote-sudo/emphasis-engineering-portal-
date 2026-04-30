import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "Email, OTP, and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectToDatabase();

    // Verify OTP
    const record = await Otp.findOne({ email });

    if (!record) {
      return NextResponse.json({ message: "OTP not found or expired. Please request a new one." }, { status: 400 });
    }

    if (record.code !== otp) {
      return NextResponse.json({ message: "Invalid OTP. Please check your email and try again." }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password (and set verified in case they weren't before)
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, isVerified: true }
    );

    // Clean up OTP
    await Otp.deleteOne({ email });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Failed to reset password" }, { status: 500 });
  }
}

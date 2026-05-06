import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, otp } = await req.json();
    await connectToDatabase();

    const updateData: any = {};
    if (name) updateData.name = name;

    // If email is changing, verify OTP
    if (email && email !== session.user.email) {
      if (!otp) {
        return NextResponse.json({ message: "OTP required for email change" }, { status: 400 });
      }

      const otpRecord = await Otp.findOne({ email });
      if (!otpRecord || otpRecord.code !== otp) {
        return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
      }

      // Check if new email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 });
      }

      updateData.email = email;
      // Delete OTP after successful use
      await Otp.deleteOne({ email });
    }

    const updatedUser = await User.findByIdAndUpdate(
      (session.user as any).id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: { name: updatedUser.name, email: updatedUser.email } 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

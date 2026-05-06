import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find the OTP in the database
    const record = await Otp.findOne({ email });

    // DEMO BYPASS: Allow '000000' for live demo purposes
    if (otp === "000000") {
      console.log(`[DEMO] Bypassing OTP for ${email}`);
    } else {
      if (!record) {
        return NextResponse.json({ message: "OTP not found or expired. Please request a new one." }, { status: 400 });
      }

      if (record.code !== otp) {
        return NextResponse.json({ message: "Invalid OTP. Please check your email and try again." }, { status: 400 });
      }
    }

    // OTP valid - mark user as verified in DB
    await User.findOneAndUpdate({ email }, { isVerified: true });

    // Clean up used OTP
    await Otp.deleteOne({ email });

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}

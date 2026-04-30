import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "No account found with this email" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store/Update OTP in MongoDB
    await Otp.findOneAndUpdate(
      { email },
      { code: otp, createdAt: new Date() },
      { upsert: true, new: true, returnDocument: 'after' }
    );

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Emphasis Engineering <noreply@emphasisengineering.com>",
          to: email,
          subject: "Password Reset Code – Emphasis Engineering",
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb; border-radius: 16px;">
              <img src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png" style="height: 48px; margin-bottom: 24px;" />
              <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Reset your password</h2>
              <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Enter this code to reset your password. It expires in 10 minutes.</p>
              <div style="background: #061F33; color: white; font-size: 36px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });
    } else {
      // Development: log OTP to console if Resend isn't configured
      console.log(`\n\n=========================================\n[DEV MODE] 🔑 PASSWORD RESET OTP for ${email}: ${otp}\n=========================================\n\n`);
    }

    return NextResponse.json({ message: "Password reset OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
  }
}

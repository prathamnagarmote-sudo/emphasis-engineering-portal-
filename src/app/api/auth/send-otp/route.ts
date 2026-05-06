import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store/Update OTP in MongoDB
    await Otp.findOneAndUpdate(
      { email },
      { code: otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send email via Resend (add RESEND_API_KEY to .env.local to activate)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      console.log("Attempting to send email to:", email);
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Emphasis Engineering <verify@emphasisengineering.com>", 
          to: email,
          subject: "Your Verification Code – Emphasis Engineering",
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9fafb; border-radius: 16px;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 800; color: #061F33;">Emphasis<span style="color: #3F9FA3;">Engineering</span></span>
              </div>
              <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Your verification code</h2>
              <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Enter this code to verify your email address. It expires in 10 minutes.</p>
              <div style="background: #061F33; color: white; font-size: 36px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                ${otp}
              </div>
              <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const errorData = await resendRes.json();
        console.error("Resend API Error:", errorData);
        return NextResponse.json({ 
          message: "Email service error", 
          debug: errorData.message || "Unknown Resend error",
          code: errorData.name
        }, { status: 400 });
      } else {
        console.log("Email sent successfully via Resend");
      }
    } 

    // ALWAYS log OTP to console in development so you don't have to wait for emails
    if (process.env.NODE_ENV === 'development' || !resendApiKey) {
      console.log(`\n\n=========================================\n🔑 [AUTH DEBUG] OTP for ${email}: ${otp}\n=========================================\n\n`);
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}

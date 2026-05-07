import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const instructorEmail = process.env.INSTRUCTOR_EMAIL || "omnagarmote@gmail.com";

    // Email to Instructor
    const instructorHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #061F33;">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #3F9FA3;">
          ${message.replace(/\n/g, '<br>') || "No message provided"}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This message was sent from the Emphasis Engineering Contact Form.</p>
      </div>
    `;

    // Email to User (Confirmation)
    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #061F33;">Message Received – Emphasis Engineering</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. We have received your message regarding <strong>"${subject}"</strong> and our team will get back to you shortly.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #3F9FA3;">
          <p style="font-style: italic; color: #555;">"${message.length > 200 ? message.substring(0, 200) + '...' : message}"</p>
        </div>
        <p>In the meantime, feel free to browse our <a href="https://emphasisengineering.com/services" style="color: #3F9FA3; text-decoration: none; font-weight: bold;">Professional Services</a> or check out our <a href="https://emphasisengineering.com/courses" style="color: #3F9FA3; text-decoration: none; font-weight: bold;">Courses</a>.</p>
        <p>Best regards,<br>The Emphasis Engineering Team</p>
      </div>
    `;

    // Send to Instructor
    await sendEmail(
      instructorEmail,
      `New Contact: ${subject} from ${name}`,
      instructorHtml
    );

    // Send confirmation to User
    await sendEmail(
      email,
      "We received your message – Emphasis Engineering",
      userHtml
    );

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

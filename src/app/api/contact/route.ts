import { NextResponse } from "next/server";
import { Resend } from 'resend';
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/models/Contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to Database
    await Contact.create({
      name,
      email,
      subject,
      message,
    });

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
        <p style="font-size: 12px; color: #888;">This message was sent from the Emphasis Engineering Contact Form. It has also been saved to your Admin Dashboard.</p>
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
    const instructorResponse = await resend.emails.send({
      from: 'Contact Form <verify@emphasisengineering.com>',
      to: instructorEmail,
      subject: `New Contact: ${subject} from ${name}`,
      html: instructorHtml
    });

    if (instructorResponse.error) {
      throw new Error(`Resend Error (Instructor): ${instructorResponse.error.message}`);
    }

    // Send confirmation to User
    const userResponse = await resend.emails.send({
      from: 'Emphasis Engineering <verify@emphasisengineering.com>',
      to: email,
      subject: "We received your message – Emphasis Engineering",
      html: userHtml
    });

    if (userResponse.error) {
      console.warn("Could not send confirmation to user (likely due to unverified domain):", userResponse.error);
      // We don't throw here because we still want the contact form to succeed if the instructor got it
    }

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { message: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}

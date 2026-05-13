import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const INSTRUCTOR_EMAIL = process.env.INSTRUCTOR_EMAIL || 'engineeringemphasis@gmail.com';
const DOMAIN = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendPurchaseEmails(studentEmail: string, studentName: string, items: any[]) {
  try {
    const isService = items.some(i => i.type === 'service');
    const isCourse = items.some(i => i.type === 'course');
    const isTest = items.some(i => i.type === 'test');

    // 1. SEND EMAIL TO STUDENT
    let studentMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
        <h2 style="color: #0d9488;">Welcome to Emphasis Engineering!</h2>
        <p>Hi ${studentName},</p>
        <p>Thank you for your purchase. Your payment was successful and your content has been unlocked.</p>
        
        <h3 style="margin-top: 20px;">What's Next?</h3>
        <ul>
    `;

    if (isService) {
      studentMessage += `
        <li style="margin-bottom: 10px;">
          <strong>Service Access:</strong> Please visit your dashboard to fill out your intake form and schedule your first session. 
          <br><a href="${DOMAIN}/dashboard" style="color: #0d9488; font-weight: bold;">Schedule Now &rarr;</a>
        </li>
      `;
    }

    if (isCourse) {
      studentMessage += `
        <li style="margin-bottom: 10px;">
          <strong>Course Content:</strong> Your course is now active! You can start watching lessons directly from your student dashboard.
          <br><a href="${DOMAIN}/dashboard" style="color: #0d9488; font-weight: bold;">Start Learning &rarr;</a>
        </li>
      `;
    }

    if (isTest) {
      studentMessage += `
        <li style="margin-bottom: 10px;">
          <strong>Practice Tests:</strong> Your practice tests are ready. Good luck with your preparation!
          <br><a href="${DOMAIN}/dashboard" style="color: #0d9488; font-weight: bold;">Take Test &rarr;</a>
        </li>
      `;
    }

    studentMessage += `
        </ul>
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          If you have any questions, simply reply to this email or contact us at ${INSTRUCTOR_EMAIL}.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-weight: bold; color: #061F33;">The Emphasis Engineering Team</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Emphasis Engineering <onboarding@resend.dev>', // Change to your verified domain later
      to: studentEmail,
      subject: 'Payment Successful - Welcome to Emphasis Engineering',
      html: studentMessage,
    });

    // 2. SEND EMAIL TO INSTRUCTOR
    const instructorMessage = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #061F33;">New Purchase Notification</h2>
        <p>A new purchase has been made on the portal.</p>
        <p><strong>Student:</strong> ${studentName} (${studentEmail})</p>
        <p><strong>Items Purchased:</strong></p>
        <ul>
          ${items.map(i => `<li>${i.title} ($${i.price})</li>`).join('')}
        </ul>
        <p><strong>Next Steps:</strong> Check the Admin Dashboard to manage this booking.</p>
        <a href="${DOMAIN}/admin" style="display: inline-block; padding: 10px 20px; background: #0d9488; color: white; text-decoration: none; border-radius: 5px;">View Admin Dashboard</a>
      </div>
    `;

    await resend.emails.send({
      from: 'Portal Alerts <onboarding@resend.dev>',
      to: INSTRUCTOR_EMAIL,
      subject: `New Purchase: ${studentName}`,
      html: instructorMessage,
    });

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
}

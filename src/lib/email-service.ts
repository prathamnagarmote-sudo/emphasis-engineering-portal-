const DOMAIN = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const INSTRUCTOR_EMAIL = process.env.INSTRUCTOR_EMAIL || 'engineeringemphasis@gmail.com';

export async function sendPurchaseEmails(studentEmail: string, studentName: string, items: any[]) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('❌ [DEBUG] RESEND_API_KEY IS COMPLETELY MISSING!');
      throw new Error('RESEND_API_KEY is missing');
    }

    console.log(`✅ [DEBUG] Using API Key starting with: ${resendApiKey.substring(0, 5)}...`);

    const isService = items.some(i => i.type === 'service');
    const isCourse = items.some(i => i.type === 'course');
    const isTest = items.some(i => i.type === 'test');

    // 1. PREPARE STUDENT WELCOME EMAIL
    let studentMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #061F33;">Welcome to Emphasis Engineering!</h2>
        <p>Hi ${studentName},</p>
        <p>Thank you for your purchase. We are excited to support your engineering career goals.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #3F9FA3; margin: 20px 0;">
          <h3 style="margin-top: 0;">Purchased Items:</h3>
          <ul>
            ${items.map(i => `<li>${i.title}</li>`).join('')}
          </ul>
        </div>
    `;

    if (isService) {
      studentMessage += `
        <h3 style="color: #061F33;">Next Steps for Services:</h3>
        <p>To get started, please log in to your dashboard and complete the intake form for your purchased service. This allows our instructors to review your background before your first session.</p>
      `;
    }

    if (isCourse) {
      studentMessage += `
        <h3 style="color: #061F33;">Next Steps for Courses:</h3>
        <p>You can now access your course content directly from your student dashboard. Head over to the "My Courses" section to begin learning.</p>
      `;
    }

    if (isTest) {
      studentMessage += `
        <h3 style="color: #061F33;">Next Steps for Practice Tests:</h3>
        <p>Your practice tests are now unlocked! You can start your first attempt from the dashboard whenever you are ready.</p>
      `;
    }

    studentMessage += `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${DOMAIN}/dashboard" style="background: #061F33; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to My Dashboard</a>
        </div>
        <p>Best regards,<br>The Emphasis Engineering Team</p>
      </div>
    `;

    const instructorMessage = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #061F33;">New Purchase Notification</h2>
        <p>A new purchase has been made on the portal.</p>
        <p><strong>Student:</strong> ${studentName} (${studentEmail})</p>
        <p><strong>Items Purchased:</strong></p>
        <ul>
          ${items.map(i => `<li>${i.title} ($${i.price})</li>`).join('')}
        </ul>
        <a href="${DOMAIN}/admin" style="display: inline-block; padding: 10px 20px; background: #0d9488; color: white; text-decoration: none; border-radius: 5px;">View Admin Dashboard</a>
      </div>
    `;

    // SEND STUDENT EMAIL
    const studentRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Emphasis Engineering <verify@emphasisengineering.com>", 
        to: studentEmail,
        subject: "Welcome to Emphasis Engineering – Payment Successful",
        html: studentMessage,
      }),
    });

    if (!studentRes.ok) {
      const errorData = await studentRes.json();
      throw new Error(`Student Email Failed: ${errorData.message || "Unknown error"}`);
    }

    // SEND INSTRUCTOR EMAIL
    const instructorRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Emphasis Engineering <verify@emphasisengineering.com>", 
        to: INSTRUCTOR_EMAIL,
        subject: `New Purchase: ${studentName}`,
        html: instructorMessage,
      }),
    });

    if (!instructorRes.ok) {
      const errorData = await instructorRes.json();
      throw new Error(`Instructor Email Failed: ${errorData.message || "Unknown error"}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Email service failed:', error);
    return { success: false, error: error.message };
  }
}

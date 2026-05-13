const DOMAIN = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const INSTRUCTOR_EMAIL = process.env.INSTRUCTOR_EMAIL || 'engineeringemphasis@gmail.com';

export async function sendPurchaseEmails(studentEmail: string, studentName: string, items: any[]) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is missing');
    }

    const isService = items.some(i => i.type === 'service' || i.category === 'service');
    const isCourse = items.some(i => i.type === 'course' || i.category === 'course');
    const isTest = items.some(i => i.type === 'test' || i.category === 'test');

    // 1. BUILD STUDENT WELCOME EMAIL
    let studentMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
           <span style="font-size: 24px; font-weight: 800; color: #061F33;">Emphasis<span style="color: #3F9FA3;">Engineering</span></span>
        </div>
        
        <h2 style="color: #061F33; text-align: center; margin-bottom: 8px;">Success! Your Order is Confirmed</h2>
        <p style="color: #475569; text-align: center; margin-bottom: 32px;">Hi ${studentName}, welcome to Emphasis Engineering. Your access is now ready.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #061F33; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Order Details:</h3>
          <ul style="padding-left: 20px; color: #334155; margin-bottom: 0;">
            ${items.map(i => `<li style="margin-bottom: 8px;"><strong>${i.title}</strong></li>`).join('')}
          </ul>
        </div>
    `;

    // CUSTOMIZED NEXT STEPS (Pointing all to Dashboard)
    if (isService) {
      studentMessage += `
        <div style="margin-bottom: 24px;">
          <h3 style="color: #061F33; font-size: 18px; margin-bottom: 12px;">📋 Service Activation:</h3>
          <p style="color: #475569; line-height: 1.6;">To begin your application support, please log in to your dashboard to complete your <strong>Intake Form</strong> and schedule your initial review session with our instructors.</p>
        </div>
      `;
    }

    if (isCourse) {
      studentMessage += `
        <div style="margin-bottom: 24px;">
          <h3 style="color: #061F33; font-size: 18px; margin-bottom: 12px;">🎥 Course Learning:</h3>
          <p style="color: #475569; line-height: 1.6;">Your training modules are now unlocked! Simply log in to your dashboard to access your course content and start your engineering training.</p>
        </div>
      `;
    }

    if (isTest) {
      studentMessage += `
        <div style="margin-bottom: 24px;">
          <h3 style="color: #061F33; font-size: 18px; margin-bottom: 12px;">📝 Practice Exams:</h3>
          <p style="color: #475569; line-height: 1.6;">Your practice tests are ready. Log in to your dashboard to begin your first attempt and track your exam performance.</p>
        </div>
      `;
    }

    studentMessage += `
        <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
          <a href="${DOMAIN}/dashboard" style="background: #061F33; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Access My Dashboard</a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          If you have any questions or need assistance, simply reply to this email.<br>
          <strong>The Emphasis Engineering Team</strong>
        </p>
      </div>
    `;

    // 2. BUILD INSTRUCTOR NOTIFICATION
    const instructorMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0d9488;">🚀 New Enrollment Alert!</h2>
        <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; border-left: 5px solid #0d9488;">
          <p style="margin: 0 0 10px;"><strong>Student Name:</strong> ${studentName}</p>
          <p style="margin: 0 0 10px;"><strong>Student Email:</strong> ${studentEmail}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h3 style="color: #061F33; margin-top: 24px;">Items Purchased:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="text-align: left; border-bottom: 2px solid #f1f5f9;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Type</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(i => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px;">${i.title}</td>
                <td style="padding: 10px; text-transform: capitalize; color: #64748b;">${i.type || i.category || 'N/A'}</td>
                <td style="padding: 10px; text-align: right;">C$${i.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="text-align: center;">
          <a href="${DOMAIN}/admin" style="background: #061F33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Admin Dashboard</a>
        </div>
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
        subject: "🎉 Welcome! Your Emphasis Engineering Order is Ready",
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
        from: "Portal Alerts <verify@emphasisengineering.com>", 
        to: INSTRUCTOR_EMAIL,
        subject: `🔥 New Sale: ${studentName} purchased ${items.length} item(s)`,
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

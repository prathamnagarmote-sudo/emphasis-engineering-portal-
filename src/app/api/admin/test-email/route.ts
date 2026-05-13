import { NextResponse } from 'next/server';
import { sendPurchaseEmails } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We will send a test email to the instructor and a sample test address
    const testEmail = 'engineeringemphasis@gmail.com'; // Testing by sending to yourself
    const testItems = [
      { title: 'ICE – Interview Preparation (TEST)', price: 649, type: 'service' }
    ];

    console.log('Sending test purchase emails...');
    const result = await sendPurchaseEmails(testEmail, 'Test Student', testItems);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'TEST SUCCESSFUL: Check your inbox (engineeringemphasis@gmail.com) for both the Student Welcome and Instructor Alert emails.' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

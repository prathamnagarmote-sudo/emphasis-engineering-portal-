import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ServiceBooking from '@/models/ServiceBooking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { bookingId, formData } = await req.json();

    if (!bookingId || !formData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await ServiceBooking.findOneAndUpdate(
      { _id: bookingId, userId: (session.user as any).id },
      { 
        formData,
        status: 'pending' // Still pending until admin schedules it, but now with data
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Notify instructor
    try {
      const instructorEmail = process.env.INSTRUCTOR_EMAIL || process.env.EMAIL_USER;
      if (instructorEmail) {
        const { sendEmail } = await import('@/lib/mail');
        await sendEmail(
          instructorEmail,
          `New Service Intake: ${booking.serviceTitle} - ${session.user.name}`,
          `
          <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden;">
            <div style="background: #061F33; padding: 30px; text-align: center;">
              <h2 style="color: #3F9FA3; margin: 0; font-size: 24px;">New Service Intake Form</h2>
              <p style="color: white; opacity: 0.7; margin-top: 5px;">Student has provided their scheduling details</p>
            </div>
            
            <div style="padding: 30px;">
              <p><strong>Student:</strong> ${formData.name || session.user.name} (${formData.email || session.user.email})</p>
              <p><strong>Service:</strong> ${booking.serviceTitle}</p>
              
              <div style="background: #f9f9f9; padding: 25px; border-radius: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #061F33; font-size: 16px;">Scheduling & Location</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>Timeline:</strong></td>
                    <td style="padding: 5px 0;">${formData.preferredTimeline || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>Timezone:</strong></td>
                    <td style="padding: 5px 0;">${formData.timezone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>City:</strong></td>
                    <td style="padding: 5px 0;">${formData.city || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>Country:</strong></td>
                    <td style="padding: 5px 0;">${formData.country || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #f9f9f9; padding: 25px; border-radius: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #061F33; font-size: 16px;">Contact Details</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>Phone:</strong></td>
                    <td style="padding: 5px 0;">${formData.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>WhatsApp:</strong></td>
                    <td style="padding: 5px 0;">${formData.whatsapp || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <p>Please login to the <strong>Admin Dashboard</strong> to initiate the service and contact the student.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL}/admin" style="display: inline-block; background: #3F9FA3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; box-shadow: 0 4px 14px rgba(63,159,163,0.3);">Go to Admin Dashboard</a>
              </div>
            </div>
          </div>
          `
        );
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Service Booking Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    const query: any = { userId: (session.user as any).id };
    if (serviceId) query.serviceId = serviceId;

    const bookings = await ServiceBooking.find(query).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

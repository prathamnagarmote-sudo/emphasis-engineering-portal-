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
          <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #3F9FA3;">New Service Intake Form Submitted</h2>
            <p><strong>Student:</strong> ${session.user.name} (${session.user.email})</p>
            <p><strong>Service:</strong> ${booking.serviceTitle}</p>
            <p><strong>Details:</strong></p>
            <ul style="background: #f9f9f9; padding: 20px; border-radius: 10px; list-style: none;">
              <li><strong>Phone:</strong> ${formData.phone || 'N/A'}</li>
              <li><strong>WhatsApp:</strong> ${formData.whatsapp || 'N/A'}</li>
              <li><strong>Location:</strong> ${formData.city || 'N/A'}, ${formData.country || 'N/A'}</li>
              <li><strong>Preferred Time:</strong> ${formData.preferredDate || 'N/A'} at ${formData.preferredTime || 'N/A'}</li>
            </ul>
            <p>Please login to the <strong>Admin Dashboard</strong> to view full details and initiate the service.</p>
            <div style="margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/admin" style="background: #3F9FA3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a>
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

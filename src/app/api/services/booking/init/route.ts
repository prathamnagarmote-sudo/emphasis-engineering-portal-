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
    const { serviceId, serviceTitle } = await req.json();

    if (!serviceId || !serviceTitle) {
      return NextResponse.json({ error: 'Missing service details' }, { status: 400 });
    }

    // Create a new booking record (equivalent to what Stripe webhook does)
    const booking = await ServiceBooking.create({
      userId: (session.user as any).id,
      serviceId,
      serviceTitle,
      status: 'pending'
    });

    return NextResponse.json({ success: true, bookingId: booking._id });
  } catch (error: any) {
    console.error('Booking init error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

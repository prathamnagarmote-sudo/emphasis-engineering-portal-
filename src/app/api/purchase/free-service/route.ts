import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import ServiceBooking from '@/models/ServiceBooking';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, itemTitle } = await req.json();
    if (!itemId || !itemTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const userId = (session.user as any).id;

    // 1. Create a service booking
    const booking = await ServiceBooking.create({
      userId,
      serviceId: itemId,
      serviceTitle: itemTitle,
      status: 'pending'
    });

    // 2. Grant access to the user (add to purchasedContent)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedContent: itemId }
    });

    return NextResponse.json({ success: true, bookingId: booking._id });
  } catch (err: any) {
    console.error('Free Service Purchase Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

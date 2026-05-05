import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceId } = await req.json();
    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Add to scheduledServiceIds if not already there
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $addToSet: { scheduledServiceIds: serviceId } }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Schedule Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
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

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.scheduledServiceIds) {
      user.scheduledServiceIds = [];
    }

    if (!user.scheduledServiceIds.includes(serviceId)) {
      user.scheduledServiceIds.push(serviceId);
      await user.save();
    }

    return NextResponse.json({ success: true, scheduledServiceIds: user.scheduledServiceIds });
  } catch (err: any) {
    console.error('Schedule Service Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

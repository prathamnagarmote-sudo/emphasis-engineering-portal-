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

    const { itemId } = await req.json();
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.purchasedContent) {
      user.purchasedContent = [];
    }

    if (!user.purchasedContent.includes(itemId)) {
      user.purchasedContent.push(itemId);
      await user.save();
    }

    return NextResponse.json({ success: true, purchasedContent: user.purchasedContent });
  } catch (err: any) {
    console.error('Free Purchase Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

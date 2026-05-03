import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    if (!sig || !webhookSecret) {
      console.error('Webhook Error: Missing signature or secret');
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    
    const userId = session.metadata.userId;
    const itemIdsRaw = session.metadata.itemIds;
    const itemIds = itemIdsRaw ? JSON.parse(itemIdsRaw) : [];

    if (userId && itemIds.length > 0) {
      await connectDB();
      // Grant access to all purchased items
      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchasedContent: { $each: itemIds } }
      });
      console.log(`✅ Success: User ${userId} granted access to ${itemIds.length} items`);
    }
  }

  return NextResponse.json({ received: true });
}

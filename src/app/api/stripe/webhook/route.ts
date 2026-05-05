import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  if (!webhookSecret) {
    console.error('❌ Stripe Webhook Error: STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
  }

  if (!signature) {
    console.error('❌ Stripe Webhook Error: Missing stripe-signature header.');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    if (metadata && metadata.userId && metadata.itemIds) {
      const userId = metadata.userId;
      const itemIds = JSON.parse(metadata.itemIds);

      try {
        await connectToDatabase();
        await User.findByIdAndUpdate(userId, {
          $addToSet: { purchasedContent: { $each: itemIds } }
        });
        console.log(`✅ Webhook: Updated purchasedContent for user ${userId}:`, itemIds);
      } catch (dbErr) {
        console.error('❌ Webhook: Database update failed:', dbErr);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = 'force-dynamic';

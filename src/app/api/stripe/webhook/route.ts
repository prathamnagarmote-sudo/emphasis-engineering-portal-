import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Log from '@/models/Log';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function GET() {
  return NextResponse.json({ 
    status: 'active', 
    message: 'Emphasis Engineering Stripe Webhook is operational. Use POST for actual events.' 
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    await connectToDatabase();

    if (!webhookSecret) {
      await Log.create({ 
        type: 'error', 
        message: 'Stripe Webhook: STRIPE_WEBHOOK_SECRET is missing in environment variables.' 
      });
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      await Log.create({ 
        type: 'error', 
        message: `Stripe Webhook: Signature verification failed. Check if secret matches.`,
        details: { error: err.message }
      });
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    await Log.create({ 
      type: 'webhook', 
      message: `Received event: ${event.type}`,
      details: { id: event.id }
    });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (metadata && metadata.itemIds) {
        const itemIds = JSON.parse(metadata.itemIds);
        const userId = metadata.userId;

        let user;
        if (userId) {
          user = await User.findById(userId);
        }

        // FALLBACK: If userId missing or not found, try by email
        if (!user && customerEmail) {
          user = await User.findOne({ email: customerEmail.toLowerCase() });
          await Log.create({ 
            type: 'info', 
            message: `Webhook Fallback: User not found by ID, matched by email: ${customerEmail}` 
          });
        }

        if (user) {
          await User.findByIdAndUpdate(user._id, {
            $addToSet: { purchasedContent: { $each: itemIds } }
          });
          
          await Log.create({ 
            type: 'webhook', 
            message: `SUCCESS: Granted access to ${user.email}`,
            details: { items: itemIds, userId: user._id }
          });
          
          console.log(`✅ Webhook: Updated purchasedContent for user ${user.email}:`, itemIds);
        } else {
          await Log.create({ 
            type: 'error', 
            message: `FAILED: No user found for payment.`,
            details: { email: customerEmail, userId }
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (globalErr: any) {
    console.error('Webhook Global Error:', globalErr);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

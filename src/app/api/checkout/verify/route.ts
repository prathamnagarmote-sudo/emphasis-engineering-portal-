import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendPurchaseEmails } from '@/lib/email-service';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ServiceBooking from '@/models/ServiceBooking';
import Log from '@/models/Log';
import Voucher from '@/models/Voucher';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * FAIL-SAFE PAYMENT VERIFICATION
 *
 * Called immediately when the student lands on /payment-success?session_id=...
 * 
 * Flow:
 * 1. Stripe sends webhook -> /api/webhook/stripe (PRIMARY - auto, instant)
 * 2. Student lands on payment-success -> calls this route (BACKUP - always runs)
 *
 * This route checks if the webhook already fulfilled the order.
 * If YES: returns success immediately (no duplicate).
 * If NO:  fulfills everything right now (unlock course, create order, send emails).
 *
 * Result: The student ALWAYS gets access, even if the webhook missed.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const authSession = await getServerSession(authOptions);
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Step 1: Check if webhook already handled this (Order exists = already fulfilled)
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return NextResponse.json({
        status: 'already_fulfilled',
        message: 'Order already processed by webhook.',
        alreadyFulfilled: true,
      });
    }

    // Step 2: Webhook missed — verify payment directly with Stripe
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err: any) {
      return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 });
    }

    // Only proceed if payment is confirmed paid
    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json({
        status: 'not_paid',
        message: 'Payment not yet confirmed.',
        alreadyFulfilled: false,
      });
    }

    // Step 3: Fetch user
    const metadata = stripeSession.metadata || {};
    const customerEmail = stripeSession.customer_details?.email || stripeSession.customer_email;
    const userId = metadata.userId;

    let user;
    if (userId) {
      user = await User.findById(userId);
    }
    if (!user && customerEmail) {
      user = await User.findOne({ email: customerEmail.toLowerCase() });
    }

    if (!user) {
      await Log.create({
        type: 'error',
        message: `FAILSAFE: No user found for session ${sessionId}`,
        details: { email: customerEmail, userId },
      });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Step 4: Parse purchased items
    let itemIds: string[] = [];
    let itemDetails: any[] = [];

    if (metadata.itemIds) {
      try { itemIds = JSON.parse(metadata.itemIds); } catch (e) {}
    }
    if (metadata.itemDetails) {
      try { itemDetails = JSON.parse(metadata.itemDetails); } catch (e) {}
    }

    // Fallback: pull directly from Stripe line items if metadata missing
    if (itemIds.length === 0) {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      itemDetails = lineItems.data.map((item) => ({
        id: 'custom',
        title: item.description || 'Unknown Item',
        type: 'course',
        price: item.amount_total ? item.amount_total / 100 : 0,
      }));
      itemIds = itemDetails.map((i) => i.id);
    }

    // Step 5: Grant course/service access to user (idempotent — $addToSet won't double-add)
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { purchasedContent: { $each: itemIds } },
    });

    // Step 6: Create Order record in MongoDB
    const billingCountry = stripeSession.customer_details?.address?.country;
    try {
      await Order.create({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        items: itemDetails,
        totalAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : 0,
        currency: stripeSession.currency || 'cad',
        voucherCode: metadata.voucherCode || null,
        stripeSessionId: sessionId,
        country: billingCountry || user.country || 'Unknown',
        createdAt: new Date(stripeSession.created * 1000),
      });
    } catch (orderErr: any) {
      // If unique constraint fires, the webhook just beat us — that's fine
      if (orderErr.code === 11000) {
        return NextResponse.json({
          status: 'already_fulfilled',
          message: 'Order created by webhook (race condition — all good).',
          alreadyFulfilled: true,
        });
      }
      throw orderErr;
    }

    // Step 7: Create service bookings if any item is a service
    for (const item of itemDetails) {
      if (item.type === 'service') {
        try {
          await ServiceBooking.findOneAndUpdate(
            { userId: user._id, serviceId: item.id },
            { userId: user._id, serviceId: item.id, serviceTitle: item.title, status: 'pending' },
            { upsert: true }
          );
        } catch (bookingErr) {
          console.error('ServiceBooking failsafe error:', bookingErr);
        }
      }
    }

    // Step 8: Mark voucher as used if applicable
    if (metadata.voucherCode) {
      await Voucher.findOneAndUpdate(
        { code: metadata.voucherCode.toUpperCase() },
        { isUsed: true, usedBy: user._id, usedAt: new Date() }
      );
    }

    // Step 9: Send confirmation emails (student + instructor)
    try {
      await sendPurchaseEmails(user.email, user.name, itemDetails);
    } catch (emailErr) {
      console.error('Failsafe email error:', emailErr);
    }

    // Step 10: Log the auto-heal event for Admin Dashboard visibility
    await Log.create({
      type: 'webhook',
      message: `FAILSAFE AUTO-HEAL: Fulfilled missing purchase for ${user.email}`,
      details: { items: itemIds, sessionId, userId: user._id },
    });

    return NextResponse.json({
      status: 'fulfilled',
      message: `Access granted to ${user.email} via fail-safe.`,
      alreadyFulfilled: false,
      items: itemIds,
    });
  } catch (err: any) {
    console.error('Checkout verify error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

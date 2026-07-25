import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Log from "@/models/Log";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Fetch real Stripe events directly (no hardcoding, always live data)
    let stripeEvents: any[] = [];
    try {
      const events = await stripe.events.list({ limit: 30 });
      stripeEvents = events.data.map((evt) => {
        // Format event message based on type
        let message = `Received event: ${evt.type}`;
        let details: any = { id: evt.id };

        if (evt.type === 'checkout.session.completed') {
          const s = evt.data.object as any;
          const email = s.customer_details?.email || s.customer_email || 'unknown';
          const amount = s.amount_total ? `C$${(s.amount_total / 100).toFixed(2)}` : '';
          message = `Received event: checkout.session.completed`;
          details = { id: evt.id, sessionId: s.id, email, amount };
        } else if (evt.type === 'payment_intent.succeeded') {
          const pi = evt.data.object as any;
          message = `Received event: payment_intent.succeeded`;
          details = { id: evt.id, amount: pi.amount ? `C$${(pi.amount / 100).toFixed(2)}` : '' };
        } else if (evt.type === 'charge.succeeded') {
          const ch = evt.data.object as any;
          const email = ch.billing_details?.email || ch.receipt_email || '';
          message = `Received event: charge.succeeded`;
          details = { id: evt.id, email };
        }

        return {
          _id: evt.id,
          type: 'stripe-live',
          message,
          details,
          createdAt: new Date(evt.created * 1000), // Real Stripe timestamp
          source: 'stripe'
        };
      });
    } catch (stripeErr) {
      console.error("Stripe events fetch error:", stripeErr);
    }

    // 2. Also fetch MongoDB logs (auto-heal events, sync events, etc.)
    // But remove manually hardcoded duplicate entries for real Stripe events
    const mongoLogs = await Log.find({
      // Exclude manually inserted logs that duplicate real Stripe events
      message: { $not: /RECEIVED EVENT: CHECKOUT.SESSION.COMPLETED/i }
    }).sort({ createdAt: -1 }).limit(10);

    // 3. Merge: Stripe live events first, then MongoDB system logs (auto-heals, syncs)
    const systemLogs = mongoLogs
      .filter(l => l.message?.includes('SUCCESS') || l.message?.includes('AUTO') || l.message?.includes('SYNC'))
      .map(l => ({
        _id: l._id?.toString(),
        type: l.type,
        message: l.message,
        details: l.details,
        createdAt: l.createdAt,
        source: 'system'
      }));

    // Combine and sort by date descending
    const allLogs = [...stripeEvents, ...systemLogs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 25);

    return NextResponse.json({ logs: allLogs }, { status: 200 });
  } catch (error) {
    console.error("Admin Logs fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

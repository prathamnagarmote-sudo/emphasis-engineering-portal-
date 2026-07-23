import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Log from '@/models/Log';
import ServiceBooking from '@/models/ServiceBooking';
import { stripe } from '@/lib/stripe';
import { sendPurchaseEmails } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Fetch recent paid sessions from Stripe
    const stripeSessions = await stripe.checkout.sessions.list({ limit: 20 });
    const paidSessions = stripeSessions.data.filter(s => s.payment_status === 'paid');

    let restoredCount = 0;
    const restoredDetails: string[] = [];

    for (const sessionObj of paidSessions) {
      const sessionId = sessionObj.id;
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

      if (!existingOrder) {
        // Unsynced payment found!
        const metadata = sessionObj.metadata || {};
        const customerEmail = sessionObj.customer_details?.email || sessionObj.customer_email;
        const userId = metadata.userId;

        let user;
        if (userId) {
          user = await User.findById(userId);
        }
        if (!user && customerEmail) {
          user = await User.findOne({ email: customerEmail.toLowerCase() });
        }

        if (user) {
          let itemDetails: any[] = [];
          let itemIds: string[] = [];

          if (metadata.itemIds) {
            try {
              itemIds = JSON.parse(metadata.itemIds);
            } catch (e) {}
          }
          if (metadata.itemDetails) {
            try {
              itemDetails = JSON.parse(metadata.itemDetails);
            } catch (e) {}
          }

          // Fallback if metadata items missing: query line items directly from Stripe
          if (itemDetails.length === 0 || itemIds.length === 0) {
            const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
            itemDetails = lineItems.data.map(item => {
              const name = item.description || '';
              let id = 'custom';
              if (name.includes('IET')) id = 'iet-101';
              else if (name.includes('IMechE') || name.includes('IMECH')) id = 'imech-101';
              else if (name.includes('Canadian') || name.includes('CBA')) id = 'cpeng-1';
              else if (name.includes('Interview') || name.includes('ICE')) id = 'ICE';
              
              return {
                id,
                title: name,
                type: 'course',
                price: item.amount_total ? item.amount_total / 100 : 0
              };
            });
            itemIds = itemDetails.map(i => i.id);
          }

          // 1. Update user purchased content with exact IDs
          await User.findByIdAndUpdate(user._id, {
            $addToSet: { purchasedContent: { $each: itemIds } }
          });

          // 2. Create Order document
          const country = sessionObj.customer_details?.address?.country || user.country || 'Unknown';
          await Order.create({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            items: itemDetails,
            totalAmount: sessionObj.amount_total ? sessionObj.amount_total / 100 : 0,
            currency: sessionObj.currency || 'cad',
            stripeSessionId: sessionId,
            country: country,
            createdAt: new Date(sessionObj.created * 1000)
          });

          // 3. Handle service bookings if applicable
          for (const item of itemDetails) {
            if (item.type === 'service') {
              await ServiceBooking.findOneAndUpdate(
                { userId: user._id, serviceId: item.id },
                { userId: user._id, serviceId: item.id, serviceTitle: item.title, status: 'pending' },
                { upsert: true }
              );
            }
          }

          // 4. Send emails
          try {
            await sendPurchaseEmails(user.email, user.name, itemDetails);
          } catch (emailErr) {
            console.error('Auto-sync email error:', emailErr);
          }

          // 5. Log auto-heal event
          await Log.create({
            type: 'webhook',
            message: `AUTO-SYNC: Restored missing purchase for ${user.email}`,
            details: { items: itemIds, sessionId }
          });

          restoredCount++;
          restoredDetails.push(`${user.email} (${itemDetails.map(i => i.title).join(', ')})`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      restoredCount,
      restoredDetails,
      message: restoredCount > 0 
        ? `Successfully synced ${restoredCount} missing Stripe payment(s)!`
        : 'All Stripe payments are already fully in sync with MongoDB.'
    });
  } catch (error: any) {
    console.error('Admin Stripe Sync error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

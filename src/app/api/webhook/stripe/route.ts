import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendPurchaseEmails } from '@/lib/email-service';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import ServiceBooking from '@/models/ServiceBooking';
import Log from '@/models/Log';
import Voucher from '@/models/Voucher';
import Order from '@/models/Order';
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    await connectToDatabase();

    if (!webhookSecret) {
      await Log.create({ 
        type: 'error', 
        message: 'Stripe Webhook: STRIPE_WEBHOOK_SECRET is missing.' 
      });
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      
      // Log every event type for health monitoring
      await Log.create({
        type: 'webhook',
        message: `RECEIVED EVENT: ${event.type.toUpperCase()}`,
        details: { id: event.id }
      });
    } catch (err: any) {
      await Log.create({ 
        type: 'error', 
        message: `Stripe Webhook: Signature verification failed.`,
        details: { error: err.message }
      });
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (metadata && metadata.itemIds) {
        const itemIds = JSON.parse(metadata.itemIds);
        const itemDetails = metadata.itemDetails ? JSON.parse(metadata.itemDetails) : [];
        const userId = metadata.userId;

        let user;
        if (userId) {
          user = await User.findById(userId);
        }

        if (!user && customerEmail) {
          user = await User.findOne({ email: customerEmail.toLowerCase() });
        }

        if (user) {
          // Grant access (allow duplicates now for multiple service purchases)
          await User.findByIdAndUpdate(user._id, {
            $addToSet: { purchasedContent: { $each: itemIds } }
          });

          // Create an Order record for accurate revenue tracking
          try {
            const billingCountry = session.customer_details?.address?.country;
            
            await Order.create({
              userId: user._id,
              userEmail: user.email,
              userName: user.name,
              items: itemDetails,
              totalAmount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency || 'cad',
              voucherCode: metadata.voucherCode || null,
              stripeSessionId: session.id,
              country: billingCountry || user.country || 'Unknown'
            });
          } catch (orderErr: any) {
            console.error('Order creation failed in webhook:', orderErr);
            await Log.create({
              type: 'error',
              message: `Webhook Order creation error for ${user.email}: ${orderErr.message}`,
              details: { error: orderErr.message, sessionId: session.id }
            });
          }

          // Send automated emails to Student and Instructor (always runs independently)
          try {
            const emailResult = await sendPurchaseEmails(user.email, user.name, itemDetails);
            await Log.create({
              type: emailResult.success ? 'webhook' : 'error',
              message: emailResult.success 
                ? `Purchase confirmation emails sent to ${user.email}` 
                : `Purchase email issue for ${user.email}: ${emailResult.studentError || emailResult.instructorError || emailResult.error}`,
              details: { emailResult, items: itemDetails, email: user.email }
            });
          } catch (emailErr: any) {
            console.error('Webhook email sending exception:', emailErr);
            await Log.create({
              type: 'error',
              message: `Webhook email sending exception for ${user.email}: ${emailErr.message}`,
              details: { error: emailErr.message, email: user.email }
            });
          }


          // Handle Service Bookings
          for (const item of itemDetails) {
            if (item.type === 'service') {
              try {
                await ServiceBooking.create({
                  userId: user._id,
                  serviceId: item.id,
                  serviceTitle: item.title,
                  status: 'pending'
                });
              } catch (bookingErr) {
                console.error('Service Booking creation failed:', bookingErr);
              }
            }
          }

          // Mark voucher as used if applicable
          if (metadata.voucherCode) {
            await Voucher.findOneAndUpdate(
              { code: metadata.voucherCode.toUpperCase() },
              { 
                isUsed: true, 
                usedBy: user._id, 
                usedAt: new Date() 
              }
            );
          }
          
          await Log.create({ 
            type: 'webhook', 
            message: `SUCCESS: Granted access to ${user.email}`,
            details: { items: itemIds, userId: user._id }
          });
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

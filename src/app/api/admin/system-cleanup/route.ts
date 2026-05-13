import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    const email = 'pccvalenzuela@gmail.com';
    const orders = await Order.find({ userEmail: { $regex: new RegExp(email, 'i') } }).lean();
    
    let message = `Found ${orders.length} orders for Patrick. `;
    
    if (orders.length > 1) {
      const orderWithItems = orders.find(o => o.items && o.items.length > 0);
      const orderWithStripe = orders.find(o => o.stripeSessionId);
      
      message += ` | ItemsOrder: ${orderWithItems?._id} (Len: ${orderWithItems?.items?.length}) | StripeOrder: ${orderWithStripe?._id} (Stripe: ${orderWithStripe?.stripeSessionId})`;
      
      if (orderWithItems && orderWithStripe && String(orderWithItems._id) !== String(orderWithStripe._id)) {
        await Order.findByIdAndUpdate(orderWithItems._id, {
          stripeSessionId: orderWithStripe.stripeSessionId,
          country: orderWithStripe.country || 'Canada'
        });
        
        await Order.findByIdAndDelete(orderWithStripe._id);
        message += ' | Successfully merged and deleted duplicate order. Total is now $40.';
      } else {
        message += ' | Could not merge - criteria not met.';
      }
    } else {
      message += 'No duplicates found.';
    }

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

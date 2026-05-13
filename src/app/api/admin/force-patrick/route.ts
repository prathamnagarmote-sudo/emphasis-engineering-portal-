import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const email = 'pccvalenzuela@gmail.com';
    const orders = await Order.find({ userEmail: { $regex: new RegExp(email, 'i') } }).lean();
    
    if (orders.length > 1) {
      const orderWithItems = orders.find(o => o.items && o.items.length > 0);
      const orderWithStripe = orders.find(o => o.stripeSessionId);
      
      if (orderWithItems && orderWithStripe && String(orderWithItems._id) !== String(orderWithStripe._id)) {
        
        // Update the stripe order to include the items from the legacy manual order
        await Order.collection.updateOne(
          { _id: orderWithStripe._id },
          { $set: { items: orderWithItems.items } }
        );
        
        // Delete the legacy manual order that had no stripe ID
        await Order.collection.deleteOne({ _id: orderWithItems._id });
        
        return NextResponse.json({ success: true, merged: true, message: "Items merged into Stripe order." });
      }
    }
    
    return NextResponse.json({ success: false, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 200 });
  }
}

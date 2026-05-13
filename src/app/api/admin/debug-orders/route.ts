import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();
  const orders = await Order.find({}).lean();
  
  let count = 0;
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      count += order.items.length;
    }
  });

  return NextResponse.json({ 
    totalOrders: orders.length, 
    totalItems: count, 
    ordersData: orders 
  }, { status: 200 });
}

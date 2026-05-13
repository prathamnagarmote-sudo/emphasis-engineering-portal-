import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import ServiceBooking from '@/models/ServiceBooking';
import { stripe } from '@/lib/stripe';
import { services } from '@/data/services';
import { courses } from '@/data/courses';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'ashvinbhogesara7@gmail.com';

    await connectToDatabase();
    
    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
    if (!user) return NextResponse.json({ error: `User ${email} not found.` });

    // 1. GET STRIPE SESSION
    const stripeSessions = await stripe.checkout.sessions.list({
      customer_details: { email: email.toLowerCase() },
      limit: 10,
    });
    const successfulSession = stripeSessions.data.find(s => s.payment_status === 'paid');
    if (!successfulSession) return NextResponse.json({ error: `No payment found for ${email}.` });

    // 2. GET LINE ITEMS DIRECTLY FROM STRIPE (Most Reliable)
    const lineItems = await stripe.checkout.sessions.listLineItems(successfulSession.id);
    const stripeAmount = successfulSession.amount_total ? successfulSession.amount_total / 100 : 0;
    const currency = successfulSession.currency || 'cad';
    const country = successfulSession.customer_details?.address?.country || user.country || 'Unknown';
    
    // 3. RECONSTRUCT ITEMS & NORMALIZE CAD
    const finalItems = [];
    let calculatedCADTotal = 0;

    for (const item of lineItems.data) {
      const name = item.description || '';
      let id = 'custom';
      let type = 'service';
      let price = item.amount_total / 100; // Default to stripe amount

      // Match against our data by name or description
      if (name.includes('Interview Preparation') || name.includes('ICE')) {
        id = 'ICE';
        price = 649; // Force CAD price
        type = 'service';
      } else if (name.includes('Canadian PEng') || name.includes('CBA')) {
        id = 'cpeng-1';
        price = 350;
        type = 'service';
      }

      finalItems.push({ id, title: name, type, price });
      calculatedCADTotal += price;

      // Update user's purchasedContent so they have access
      if (!user.purchasedContent?.includes(id)) {
        await User.findByIdAndUpdate(user._id, { $addToSet: { purchasedContent: id } });
      }

      // Create booking for services
      if (type === 'service') {
        await ServiceBooking.findOneAndUpdate(
          { userId: user._id, serviceId: id },
          { userId: user._id, serviceId: id, serviceTitle: name, status: 'pending' },
          { upsert: true }
        );
      }
    }

    // Use Calculated CAD if conversion happened
    const finalAmount = (currency.toLowerCase() === 'cad') ? stripeAmount : (calculatedCADTotal || stripeAmount);

    // 4. SAVE TO DATABASE
    const orderCollection = Order.collection;
    await orderCollection.deleteMany({ userId: user._id, totalAmount: 0 });

    const orderData = {
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      items: finalItems,
      totalAmount: finalAmount,
      currency: 'cad',
      stripeSessionId: successfulSession.id,
      paymentStatus: 'paid',
      country: country,
      createdAt: new Date(successfulSession.created * 1000),
      updatedAt: new Date()
    };

    await orderCollection.updateOne(
      { stripeSessionId: successfulSession.id },
      { $set: orderData },
      { upsert: true }
    );
    
    if (country !== 'Unknown') await User.findByIdAndUpdate(user._id, { country });
    
    return NextResponse.json({ 
      success: true, 
      email: user.email, 
      paidAmount: finalAmount,
      detectedCountry: country,
      items: finalItems.map(i => i.title),
      message: `ULTIMATE SYNC: Cyrus is now correctly recorded at $${finalAmount} CAD.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

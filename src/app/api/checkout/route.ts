import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, currency = 'cad' } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in checkout' }, { status: 400 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const hasService = items.some((i: any) => i.type === 'service');

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      locale: 'en-CA',
      submit_type: 'pay',
      success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}${hasService ? '&has_service=true' : ''}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email as string,
      payment_intent_data: {
        metadata: {
          userId: (session.user as any).id,
          itemIds: JSON.stringify(items.map((i: any) => i.id)),
          hasService: hasService ? 'true' : 'false',
        }
      },
      metadata: {
        userId: (session.user as any).id,
        itemIds: JSON.stringify(items.map((i: any) => i.id)),
        hasService: hasService ? 'true' : 'false',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export { POST, dynamic } from '@/app/api/webhook/stripe/route';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    message: 'Stripe webhook route is active (alias for /api/webhook/stripe).' 
  });
}

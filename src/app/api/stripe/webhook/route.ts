import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    error: 'DEPRECATED: This webhook route is no longer in use. Please use /api/webhook/stripe instead.' 
  }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ 
    message: 'This webhook route is deprecated. Please update your Stripe settings to use /api/webhook/stripe.' 
  });
}

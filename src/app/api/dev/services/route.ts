import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServicePage from '@/models/Service';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  console.log("Dev Panel: Fetching services...");
  const services = await ServicePage.find({}).sort({ createdAt: -1 });
  console.log(`Dev Panel: Found ${services.length} services`);
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const body = await request.json();
    const service = await ServicePage.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

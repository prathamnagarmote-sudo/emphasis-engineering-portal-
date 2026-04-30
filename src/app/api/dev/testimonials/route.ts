import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const body = await request.json();
    if (!body.testimonialId) {
      const count = await Testimonial.countDocuments();
      body.testimonialId = `t${count + 1}`;
    }
    const testimonial = await Testimonial.create(body);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

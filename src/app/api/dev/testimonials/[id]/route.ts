import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const testimonial = await Testimonial.findOne({ testimonialId: id }) || await Testimonial.findById(id);
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(testimonial);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const testimonial = await Testimonial.findOneAndUpdate(
      { testimonialId: id },
      body,
      { new: true, runValidators: true }
    ) || await Testimonial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const testimonial = await Testimonial.findOneAndDelete({ testimonialId: id }) || await Testimonial.findByIdAndDelete(id);
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const course = await Course.findOne({ courseId: id }) || await Course.findById(id);
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(course);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const course = await Course.findOneAndUpdate(
      { courseId: id },
      body,
      { new: true, runValidators: true }
    ) || await Course.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const course = await Course.findOneAndDelete({ courseId: id }) || await Course.findByIdAndDelete(id);
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PracticeTest from '@/models/PracticeTest';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const test = await PracticeTest.findOne({ testId: id }) || await PracticeTest.findById(id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(test);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const test = await PracticeTest.findOneAndUpdate(
      { testId: id },
      body,
      { new: true, runValidators: true }
    ) || await PracticeTest.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(test);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const test = await PracticeTest.findOneAndDelete({ testId: id }) || await PracticeTest.findByIdAndDelete(id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

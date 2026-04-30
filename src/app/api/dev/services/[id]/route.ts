import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServicePage from '@/models/Service';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const service = await ServicePage.findOne({ pageId: id }) || await ServicePage.findById(id);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const service = await ServicePage.findOneAndUpdate(
      { pageId: id },
      body,
      { new: true, runValidators: true }
    ) || await ServicePage.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const service = await ServicePage.findOneAndDelete({ pageId: id }) || await ServicePage.findByIdAndDelete(id);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

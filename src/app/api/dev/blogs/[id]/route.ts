import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const blog = await Blog.findOne({ blogId: id }) || await Blog.findById(id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const blog = await Blog.findOneAndUpdate(
      { blogId: id },
      body,
      { new: true, runValidators: true }
    ) || await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const { id } = await params;
  const blog = await Blog.findOneAndDelete({ blogId: id }) || await Blog.findByIdAndDelete(id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

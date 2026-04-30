import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const body = await request.json();
    // Auto-generate blogId if not provided
    if (!body.blogId) {
      const count = await Blog.countDocuments();
      body.blogId = String(count + 1);
    }
    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

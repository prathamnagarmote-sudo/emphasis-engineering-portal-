import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service');
    const tag = searchParams.get('tag');

    let query: any = {};
    if (service) query.service = service;
    if (tag) query.tags = tag;

    // Fetch blogs sorted by creation date (newest first)
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

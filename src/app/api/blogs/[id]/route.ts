import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    // Try finding by blogId first (human readable ID like '1'), then by MongoDB _id
    let blog = await Blog.findOne({ blogId: id });
    
    if (!blog) {
      // Check if id is a valid MongoDB ObjectId
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await Blog.findById(id);
      }
    }

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('Fetch blog detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

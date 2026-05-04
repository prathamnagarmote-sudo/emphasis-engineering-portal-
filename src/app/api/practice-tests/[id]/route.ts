import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PracticeTest from '@/models/PracticeTest';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Find by testId (slug) or MongoDB ID
    const test = await PracticeTest.findOne({ testId: id }) || await PracticeTest.findById(id);
    
    if (!test) {
      return NextResponse.json({ error: 'Practice test not found' }, { status: 404 });
    }
    
    return NextResponse.json(test);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PracticeTest from '@/models/PracticeTest';

export async function GET() {
  try {
    await connectDB();
    // Return test metadata without questions for public listing
    const tests = await PracticeTest.find({}).select('-questions').sort({ createdAt: -1 });
    return NextResponse.json(tests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

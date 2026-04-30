import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PracticeTest from '@/models/PracticeTest';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  // Return tests without questions for the list view (lighter payload)
  const tests = await PracticeTest.find({}).select('-questions').sort({ createdAt: -1 });
  return NextResponse.json(tests);
}

export async function POST(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const body = await request.json();
    if (!body.testId) {
      const slug = body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') || 'test';
      body.testId = `${slug}-${Date.now()}`;
    }
    const test = await PracticeTest.create(body);
    return NextResponse.json(test, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

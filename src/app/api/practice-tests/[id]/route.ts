import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import PracticeTest from '@/models/PracticeTest';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Find by testId (slug) or MongoDB ID
    let test = await PracticeTest.findOne({ testId: id });
    if (!test && id.match(/^[0-9a-fA-F]{24}$/)) {
      test = await PracticeTest.findById(id);
    }
    
    if (!test) {
      return NextResponse.json({ error: 'Practice test not found' }, { status: 404 });
    }
    
    // Free tests are accessible to everyone
    if (test.isFree) {
      return NextResponse.json(test);
    }

    // Check authentication and purchase status for paid tests
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const purchasedContent = ((session?.user as any)?.purchasedContent || []) as string[];

    const isPurchased = userRole === 'admin' ||
      purchasedContent.includes(test.testId) ||
      purchasedContent.includes(test._id?.toString()) ||
      purchasedContent.includes(id);

    const testObj = test.toObject ? test.toObject() : { ...test._doc };

    // Always preserve question count metadata
    testObj.questionsCount = test.questionsCount || test.questions?.length || 0;

    if (!isPurchased) {
      // Strip confidential questions and explanations for unpaid visitors
      testObj.questions = [];
      testObj.isLocked = true;
      testObj.isPurchased = false;
      return NextResponse.json(testObj);
    }

    testObj.isLocked = false;
    testObj.isPurchased = true;
    return NextResponse.json(testObj);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


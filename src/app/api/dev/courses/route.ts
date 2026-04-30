import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

export async function GET(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  await connectDB();
  console.log("Dev Panel: Fetching courses...");
  const courses = await Course.find({}).sort({ createdAt: -1 });
  console.log(`Dev Panel: Found ${courses.length} courses`);
  return NextResponse.json(courses);
}


export async function POST(request: Request) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const body = await request.json();
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

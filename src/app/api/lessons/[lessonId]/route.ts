import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Lesson from "@/models/Lesson";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    await connectToDatabase();
    const lessonData = await Lesson.findOne({ lessonId }).lean();

    if (!lessonData) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    // 1. Check if it's a free lesson (we'll need to know which ones are free)
    // For now, let's assume we pass a 'courseId' and check purchase.
    // In a real app, you might want to store 'isFree' in the DB too.
    
    const session = await getServerSession(authOptions);
    
    // If not logged in, they might still access 'free' lessons.
    // For premium lessons, we must check session and purchasedContent.
    
    // NOTE: In the courses.ts file, some lessons are marked 'free: true'.
    // The client-side should probably only call this API for premium lessons,
    // or we should store the 'isFree' status in the DB.
    
    // Let's implement the purchase check:
    const userPurchased = session?.user && ((session.user as any).purchasedContent || []).includes(lessonData.courseId);
    const isAdmin = session?.user && (session.user as any).role === "admin";

    // For now, let's just return the vimeoId if purchased or admin.
    // We will handle 'free' lessons in a simplified way or by adding isFree to DB.
    
    if (!lessonData.isFree && !userPurchased && !isAdmin) {
        return NextResponse.json({ message: "Content Locked" }, { status: 403 });
    }

    return NextResponse.json({ vimeoId: lessonData.vimeoId });
  } catch (error) {
    console.error("Secure Lesson API Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

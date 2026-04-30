import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Ensure user is logged in
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();

    // 2. Update their purchased content in MongoDB
    await connectToDatabase();
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $addToSet: { purchasedContent: courseId } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mock Purchase Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { userId, contentId } = await req.json();

    if (!userId || !contentId) {
      return NextResponse.json({ message: "User ID and Content ID are required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.purchasedContent) {
      user.purchasedContent = [];
    }

    if (!user.purchasedContent.includes(contentId)) {
      user.purchasedContent.push(contentId);
      await user.save();
    }

    return NextResponse.json({ message: "Access granted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Grant access error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { contentId, voucherCode } = await req.json();

    if (!contentId) {
      return NextResponse.json({ message: "Content ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Add contentId to purchasedContent array if it doesn't exist
    if (!user.purchasedContent) {
      user.purchasedContent = [];
    }

    if (!user.purchasedContent.includes(contentId)) {
      user.purchasedContent.push(contentId);
      await user.save();
    }

    // Invalidate voucher if provided
    if (voucherCode) {
      const Voucher = (await import("@/models/Voucher")).default;
      await Voucher.findOneAndUpdate(
        { code: voucherCode.toUpperCase() },
        { 
          isUsed: true, 
          usedBy: user._id, 
          usedAt: new Date() 
        }
      );
    }

    return NextResponse.json({ 
      message: "Purchase simulated successfully", 
      purchasedContent: user.purchasedContent 
    }, { status: 200 });

  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json({ message: "Failed to process purchase" }, { status: 500 });
  }
}

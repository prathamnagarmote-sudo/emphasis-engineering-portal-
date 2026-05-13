import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch orders for the logged-in user by email or ID
    const orders = await Order.find({ 
      $or: [
        { userId: (session.user as any).id },
        { userEmail: session.user.email }
      ]
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("User Orders fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

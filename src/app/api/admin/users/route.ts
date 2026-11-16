import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const purchased = searchParams.get("purchased") === "true";
    const skip = (page - 1) * limit;

    await connectToDatabase();

    let baseQuery: any = {};

    if (purchased) {
      // Find orders to get associated user emails and userIds
      const orders = await Order.find({}).select("userId userEmail").lean();
      const orderUserIds = orders
        .map((o: any) => o.userId)
        .filter((id: any) => id && mongoose.isValidObjectId(id));
      const orderEmails = orders
        .map((o: any) => o.userEmail)
        .filter(Boolean);

      baseQuery = {
        $or: [
          { purchasedContent: { $exists: true, $ne: [] } },
          ...(orderUserIds.length > 0 ? [{ _id: { $in: orderUserIds } }] : []),
          ...(orderEmails.length > 0 ? [{ email: { $in: orderEmails } }] : []),
        ],
      };
    }

    let finalQuery: any = baseQuery;
    if (search) {
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
      if (purchased) {
        finalQuery = { $and: [baseQuery, searchQuery] };
      } else {
        finalQuery = searchQuery;
      }
    }

    const [users, total] = await Promise.all([
      User.find(finalQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password"),
      User.countDocuments(finalQuery),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Admin Users fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

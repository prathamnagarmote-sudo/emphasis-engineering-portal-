import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Achievement from "@/models/Achievement";

export async function GET() {
  try {
    await connectToDatabase();

    // Find achievements that are active and either have no expiry or expire in the future
    const now = new Date();
    const achievements = await Achievement.find({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    // Transform `_id` to `id` for frontend consistency
    const transformed = achievements.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      credential: a.credential,
      location: a.location,
      detail: a.detail,
      photo: a.photo,
      badge: a.badge,
      color: a.color,
    }));

    return NextResponse.json(transformed, { status: 200 });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

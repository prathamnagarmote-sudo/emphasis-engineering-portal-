import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { verifyDevAuth, unauthorized } from "@/lib/devAuth";

export async function GET(req: Request) {
  try {
    if (!verifyDevAuth(req)) return unauthorized();

    await connectToDatabase();
    const achievements = await Achievement.find({}).sort({ createdAt: -1 });

    return NextResponse.json(achievements, { status: 200 });
  } catch (error) {
    console.error("Error fetching dev achievements:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!verifyDevAuth(req)) return unauthorized();

    await connectToDatabase();
    const body = await req.json();

    const newAchievement = new Achievement(body);
    await newAchievement.save();

    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

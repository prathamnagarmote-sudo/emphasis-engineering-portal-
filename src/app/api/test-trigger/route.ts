import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import ServiceBooking from "@/models/ServiceBooking";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "tester@gmail.com";

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (user) {
      await ServiceBooking.deleteMany({ userId: user._id });
      await Order.deleteMany({ userId: user._id });
      await User.deleteOne({ _id: user._id });
      
      return NextResponse.json({ 
        success: true, 
        message: `CLEANUP SUCCESSFUL! All data for ${email} has been permanently deleted.` 
      });
    }

    return NextResponse.json({ message: "No test user found to delete." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

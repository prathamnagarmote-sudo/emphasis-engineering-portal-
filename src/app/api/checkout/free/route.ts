import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import ServiceBooking from "@/models/ServiceBooking";
import Voucher from "@/models/Voucher";
import Log from "@/models/Log";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, voucherCode } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "No items provided" }, { status: 400 });
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const itemIds = items.map(i => i.id);

    // 1. Grant access (allow duplicates for multiple purchases)
    await User.findByIdAndUpdate(userId, {
      $push: { purchasedContent: { $each: itemIds } }
    });

    // 2. Create Order Record
    try {
      await Order.create({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        items: items.map((i: any) => ({
          id: i.id,
          title: i.title,
          type: i.type,
          price: i.price
        })),
        totalAmount: 0,
        currency: 'cad',
        voucherCode: voucherCode || null,
        paymentStatus: 'free',
        country: user.country || 'Unknown'
      });
    } catch (orderError) {
      console.error("Order creation failed:", orderError);
      // Continue anyway or handle accordingly
    }

    // 3. Handle Service Bookings
    for (const item of items) {
      if (item.type === 'service') {
        try {
          await ServiceBooking.create({
            userId: user._id,
            serviceId: item.id,
            serviceTitle: item.title,
            status: 'pending'
          });
        } catch (bookingError) {
          console.error("Booking creation failed:", bookingError);
        }
      }
    }

    // 4. Mark voucher as used if applicable
    if (voucherCode) {
      await Voucher.findOneAndUpdate(
        { code: voucherCode.toUpperCase() },
        { 
          isUsed: true, 
          usedBy: user._id, 
          usedAt: new Date() 
        }
      );
    }

    // 5. Log activity
    await Log.create({
      type: 'purchase',
      message: `Free purchase: ${user.email} acquired ${items.length} items`,
      details: { items: itemIds, userId: user._id }
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error) {
    console.error("Free checkout error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

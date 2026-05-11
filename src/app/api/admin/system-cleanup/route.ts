import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    
    const emailsToKeep = [
      'pccvalenzuela@gmail.com',
      'cyrus.sk.work@gmail.com',
      'faecommongodb@gmail.com'
    ].map(e => e.toLowerCase());

    const User = mongoose.connection.collection('users');
    const Order = mongoose.connection.collection('orders');
    const ServiceBooking = mongoose.connection.collection('servicebookings');
    const Achievement = mongoose.connection.collection('achievements');
    const Log = mongoose.connection.collection('logs');
    const Otp = mongoose.connection.collection('otps');

    // 1. Find users to keep
    const usersToKeep = await User.find({ email: { $in: emailsToKeep } }).toArray();
    const userIdsToKeep = usersToKeep.map(u => u._id);

    // 2. Delete other users
    const deleteUsersResult = await User.deleteMany({ 
      _id: { $nin: userIdsToKeep },
      email: { $nin: emailsToKeep }
    });

    // 3. Delete orders for deleted users
    const deleteOrdersResult = await Order.deleteMany({ 
      $and: [
        { userEmail: { $nin: emailsToKeep } },
        { userId: { $nin: userIdsToKeep } }
      ]
    });

    // 4. Delete service bookings
    const deleteBookingsResult = await ServiceBooking.deleteMany({ userId: { $nin: userIdsToKeep } });

    // 5. Delete achievements
    const deleteAchievementsResult = await Achievement.deleteMany({ userId: { $nin: userIdsToKeep } });

    // 6. Clear logs and OTPs
    await Log.deleteMany({});
    await Otp.deleteMany({});

    // 7. Update country for the orders of the kept users
    await Order.updateMany({ userEmail: 'cyrus.sk.work@gmail.com' }, { $set: { country: 'United Kingdom' } });
    await Order.updateMany({ userEmail: 'pccvalenzuela@gmail.com' }, { $set: { country: 'Canada' } });

    return NextResponse.json({ 
      message: "Cleanup Successful", 
      details: {
        usersDeleted: deleteUsersResult.deletedCount,
        ordersDeleted: deleteOrdersResult.deletedCount,
        bookingsDeleted: deleteBookingsResult.deletedCount
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

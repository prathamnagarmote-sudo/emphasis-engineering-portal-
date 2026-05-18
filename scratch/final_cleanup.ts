import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import User from "../src/models/User";
import Order from "../src/models/Order";
import ServiceBooking from "../src/models/ServiceBooking";

async function cleanup() {
  const email = "tester@gmail.com";
  console.log(`Cleaning up all test data for ${email}...`);
  
  await connectToDatabase();
  
  const user = await User.findOne({ email });
  if (user) {
    // 1. Delete all bookings
    const bookingRes = await ServiceBooking.deleteMany({ userId: user._id });
    console.log(`Deleted ${bookingRes.deletedCount} test bookings.`);

    // 2. Delete all orders
    const orderRes = await Order.deleteMany({ userId: user._id });
    console.log(`Deleted ${orderRes.deletedCount} test orders.`);

    // 3. Delete the user
    await User.deleteOne({ _id: user._id });
    console.log(`Deleted test user: ${email}`);
  } else {
    console.log("No test user found to delete.");
  }

  console.log("CLEANUP SUCCESSFUL!");
  process.exit(0);
}

cleanup();

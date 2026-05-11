import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://engineeringemphasis_db_user:EmpEng2014@emphasiscluster01.6a7stxj.mongodb.net/?appName=emphasiscluster01";

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

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
    
    console.log(`Found ${usersToKeep.length} users to keep: ${usersToKeep.map(u => u.email).join(', ')}`);

    // 2. Delete other users
    const deleteUsersResult = await User.deleteMany({ 
      _id: { $nin: userIdsToKeep },
      email: { $nin: emailsToKeep }
    });
    console.log(`Deleted ${deleteUsersResult.deletedCount} users.`);

    // 3. Delete orders for deleted users
    const deleteOrdersResult = await Order.deleteMany({ 
      $and: [
        { userEmail: { $nin: emailsToKeep } },
        { userId: { $nin: userIdsToKeep } }
      ]
    });
    console.log(`Deleted ${deleteOrdersResult.deletedCount} orders.`);

    // 4. Delete service bookings
    const deleteBookingsResult = await ServiceBooking.deleteMany({ userId: { $nin: userIdsToKeep } });
    console.log(`Deleted ${deleteBookingsResult.deletedCount} service bookings.`);

    // 5. Delete achievements
    const deleteAchievementsResult = await Achievement.deleteMany({ userId: { $nin: userIdsToKeep } });
    console.log(`Deleted ${deleteAchievementsResult.deletedCount} achievements.`);

    // 6. Clear logs and OTPs
    await Log.deleteMany({});
    await Otp.deleteMany({});
    console.log("Cleared logs and OTPs.");

    // 7. Update country for the orders of the kept users
    // Cyrus -> United Kingdom (User corrected: "649 in the uk")
    // Patrick -> Canada
    await Order.updateMany({ userEmail: 'cyrus.sk.work@gmail.com' }, { $set: { country: 'United Kingdom' } });
    await Order.updateMany({ userEmail: 'pccvalenzuela@gmail.com' }, { $set: { country: 'Canada' } });
    console.log("Updated order countries for legacy users.");

    console.log("Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
}

cleanup();

import connectToDatabase from "../src/lib/mongodb";
import User from "../src/models/User";
import Order from "../src/models/Order";

async function simulate() {
  const email = "tester@gmail.com";
  console.log(`Starting ghost purchase for ${email}...`);
  
  await connectToDatabase();
  
  const user = await User.findOne({ email });
  if (!user) {
    console.error("Test user not found! Please make sure you registered with tester@gmail.com");
    process.exit(1);
  }

  const items = [
    { id: "imech-101", title: "Chartered Engineer Masterclass", type: "course", price: 70 },
    { id: "us-pe-starter", title: "US PE Starter Package", type: "service", price: 299 },
    { id: "ethics-test", title: "NPPE Practice Exam", type: "practice-test", price: 49 }
  ];

  // 1. Update User Access
  await User.findByIdAndUpdate(user._id, {
    $addToSet: { purchasedContent: { $each: items.map(i => i.id) } },
    isVerified: true
  });

  // 2. Create Order Record (for Admin Stats)
  await Order.create({
    userId: user._id,
    userEmail: user.email,
    userName: user.name,
    items: items.map(i => ({ title: i.title, price: i.price })),
    totalAmount: 418, // Total of all items
    currency: "cad",
    paymentStatus: "paid",
    country: "Canada",
    createdAt: new Date(),
    stripeSessionId: "ghost_test_" + Date.now()
  });

  console.log("SUCCESS: Simulation complete!");
  console.log("1. Course Unlocked: imech-101");
  console.log("2. Service Unlocked: us-pe-starter");
  console.log("3. Test Unlocked: ethics-test");
  console.log("4. Revenue Added: C$ 418");
  
  process.exit(0);
}

simulate();

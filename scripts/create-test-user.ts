import connectToDatabase from "../src/lib/mongodb";
import User from "../src/models/User";
import bcrypt from "bcryptjs";

async function createTestUser() {
  try {
    await connectToDatabase();
    
    const email = "student@emphasisengineering.com";
    const password = "student123";
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Remove existing if any
    await User.deleteOne({ email });
    
    await User.create({
      name: "Test Student",
      email: email,
      password: hashedPassword,
      role: "student",
      isVerified: true, // Bypass OTP
      purchasedContent: []
    });
    
    console.log("Successfully created verified student user!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating user:", err);
    process.exit(1);
  }
}

createTestUser();

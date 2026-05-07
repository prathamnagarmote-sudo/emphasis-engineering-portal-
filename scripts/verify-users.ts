import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkUsers() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
  
  console.log("\n======================================");
  console.log("🔍 FETCHING USERS FROM MONGODB...");
  console.log("======================================\n");

  const users = await User.find({});
  console.log(`✅ Found ${users.length} Users in MongoDB!`);
  
  users.forEach((u, i) => {
    console.log(`${i+1}. ${u.name} (${u.email}) - Role: ${u.role}`);
  });

  console.log("\n======================================\n");

  process.exit(0);
}

checkUsers();

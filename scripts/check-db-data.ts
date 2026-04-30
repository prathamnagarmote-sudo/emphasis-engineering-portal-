import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkData() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  const ServicePage = mongoose.models.ServicePage || mongoose.model("ServicePage", new mongoose.Schema({}, { strict: false }));
  const Course = mongoose.models.Course || mongoose.model("Course", new mongoose.Schema({}, { strict: false }));
  
  console.log("\n======================================");
  console.log("🔍 FETCHING DATA FROM MONGODB...");
  console.log("======================================\n");

  const services = await ServicePage.find({});
  console.log(`✅ Found ${services.length} Service Pages in MongoDB!`);
  if (services.length > 0) {
    console.log(`   Example: Page ID -> "${services[0].pageId}"`);
    console.log(`   Title -> "${services[0].title}"`);
    console.log(`   It has ${services[0].services?.length || 0} pricing packages/services to sell.`);
    console.log(`   It has ${services[0].faqs?.length || 0} FAQs.`);
  }

  console.log("\n--------------------------------------\n");

  const courses = await Course.find({});
  console.log(`✅ Found ${courses.length} Courses in MongoDB!`);
  if (courses.length > 0) {
    console.log(`   Example: Course ID -> "${courses[0].courseId}"`);
    console.log(`   Title -> "${courses[0].title}"`);
    console.log(`   Price -> $${courses[0].price}`);
  }
  
  console.log("\n======================================\n");

  process.exit(0);
}

checkData();

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env.local");
  process.exit(1);
}

const ServiceItemSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true, default: "Premium service package" },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  popular: { type: Boolean, default: false },
  features: [{ type: String }],
  calendlyUrl: { type: String, required: true, default: "https://cal.com/emphasis-engineering-cbfkch/30min" },
});

const ServicePageSchema = new mongoose.Schema({
  pageId: { type: String, required: true },
  services: [ServiceItemSchema],
});

const ServicePage = mongoose.models.ServicePage || mongoose.model("ServicePage", ServicePageSchema);

async function fixServices() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    const pages = await ServicePage.find({});
    console.log(`🔍 Checking ${pages.length} service pages...`);

    // Fix missing description
    const res1 = await ServicePage.updateMany(
      { "services.description": { $exists: false } },
      { $set: { "services.$[].description": "Premium service package" } }
    );
    console.log(`✔️ Description fix: matched ${res1.matchedCount}, modified ${res1.modifiedCount}`);

    // Fix missing calendlyUrl or generic calendly
    const res2 = await ServicePage.updateMany(
      { 
        $or: [
          { "services.calendlyUrl": { $exists: false } },
          { "services.calendlyUrl": "" },
          { "services.calendlyUrl": "https://calendly.com" },
          { "services.calendlyUrl": "https://calendly.com/" }
        ]
      },
      { $set: { "services.$[].calendlyUrl": "https://cal.com/emphasis-engineering-cbfkch/30min" } }
    );
    console.log(`✔️ Cal.com URL fix: matched ${res2.matchedCount}, modified ${res2.modifiedCount}`);

    console.log(`✨ DONE!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Fix failed:", error);
    process.exit(1);
  }
}

fixServices();

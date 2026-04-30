/**
 * BULK IMPORT SCRIPT — Services
 * ─────────────────────────────────────────────
 * Usage:
 *   1. Paste your real Service data into the "servicesData" array below.
 *   2. Tell me (the AI) to run this script, or run it yourself:
 *      npx ts-node scripts/importServices.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env.local");
  process.exit(1);
}

import { services as localServicesData } from "../src/data/services";

const StepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String },
});

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const ServiceItemSchema = new mongoose.Schema({
  serviceId: { type: String, required: true }, 
  title: { type: String, required: true },
  description: { type: String }, // Made optional in case it's missing in frontend data
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  features: [{ type: String }],
  calendlyUrl: { type: String }, // Made optional for now
});

const ServicePageSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true }, 
  title: { type: String, required: true }, 
  description: { type: String, required: true },
  icon: { type: String },
  image: { type: String },
  features: [{ type: String }],
  stepByStepProcess: [StepSchema],
  faqs: [FAQSchema],
  services: [ServiceItemSchema], 
});

const ServicePage = mongoose.models.ServicePage || mongoose.model("ServicePage", ServicePageSchema);

async function importServices() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected.");

    console.log(`⏳ Importing ${localServicesData.length} service pages from src/data/services.ts...`);

    for (const data of localServicesData) {
      // Map the frontend data structure to our MongoDB schema
      const mappedPage = {
        pageId: data.id.toLowerCase().replace(/\s+/g, '-'), // e.g. "US PE" -> "us-pe"
        title: data.title,
        description: data.description,
        icon: data.icon,
        image: (data as any).image || "",
        features: data.features || [],
        
        // Map steps (Prioritize 'phases' if it exists as it often contains more detailed 'content')
        stepByStepProcess: (data.phases && data.phases.length > 0 ? data.phases : (data.steps || [])).map((s: any) => ({
          stepNumber: s.step,
          title: s.title,
          description: s.description,
          content: s.content || ""
        })),

        // Map FAQs
        faqs: (data.faqs || []).map(f => ({
          question: f.question,
          answer: f.answer
        })),

        // Map packages to services
        services: (data.packages || []).map(p => ({
          serviceId: p.id,
          title: p.title,
          description: "Premium service package", // Fallback description
          price: p.price,
          features: p.features,
          calendlyUrl: data.calendlyLink || "https://calendly.com"
        }))
      };

      await ServicePage.findOneAndUpdate(
        { pageId: mappedPage.pageId },
        { ...mappedPage },
        { upsert: true, new: true }
      );
      console.log(`✔️  Imported: ${mappedPage.title}`);
    }

    console.log("✨ ALL SERVICE PAGES IMPORTED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

importServices();

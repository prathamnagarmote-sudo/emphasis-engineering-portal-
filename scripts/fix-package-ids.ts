/**
 * fix-package-ids.ts
 * 
 * Fixes the duplicate serviceId bug: all packages within a service page
 * currently share the same serviceId (e.g. "IMECHE"), which causes the
 * cart to treat them as a single item.
 * 
 * This script gives each package a globally unique ID:
 *   pageSlug-pkg-1, pageSlug-pkg-2, etc.
 *   e.g. imeche-pkg-1, imeche-pkg-2, imeche-pkg-3, imeche-pkg-4
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

const StepSchema = new mongoose.Schema({
  stepNumber: Number,
  title: String,
  description: String,
  content: String,
});

const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const ServiceItemSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  features: [String],
  calendlyUrl: String,
});

const ServicePageSchema = new mongoose.Schema(
  {
    pageId: { type: String, required: true, unique: true },
    title: String,
    description: String,
    icon: String,
    image: String,
    features: [String],
    stepByStepProcess: [StepSchema],
    faqs: [FAQSchema],
    services: [ServiceItemSchema],
  },
  { timestamps: true }
);

const ServicePage =
  mongoose.models.ServicePage ||
  mongoose.model("ServicePage", ServicePageSchema);

async function fixPackageIds() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!\n");

  const pages = await ServicePage.find({});
  console.log(`Found ${pages.length} service pages.\n`);

  let totalFixed = 0;

  for (const page of pages) {
    const slug = page.pageId; // e.g. "imeche", "iet", "us-pe"
    console.log(`--- ${page.title} (${slug}) ---`);

    let changed = false;

    for (let i = 0; i < page.services.length; i++) {
      const svc = page.services[i];
      const newId = `${slug}-pkg-${i + 1}`;
      const oldId = svc.serviceId;

      if (oldId !== newId) {
        console.log(`  [${i}] "${oldId}" → "${newId}"  (${svc.title})`);
        svc.serviceId = newId;
        changed = true;
        totalFixed++;
      } else {
        console.log(`  [${i}] "${oldId}" — already correct`);
      }
    }

    if (changed) {
      await page.save();
      console.log(`  ✅ Saved!\n`);
    } else {
      console.log(`  — No changes needed.\n`);
    }
  }

  console.log(`\nDone! Fixed ${totalFixed} package IDs across ${pages.length} service pages.`);
  await mongoose.disconnect();
}

fixPackageIds().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

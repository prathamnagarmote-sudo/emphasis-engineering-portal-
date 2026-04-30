import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { testimonials as localTestimonials } from "../src/data/testimonials";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("❌ MONGODB_URI missing"); process.exit(1); }

const TestimonialSchema = new mongoose.Schema({
  testimonialId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String },
  image: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, required: true },
  platform: { type: String, default: 'Direct' },
  date: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  linkedInUrl: { type: String },
}, { timestamps: true });

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

async function migrate() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected.");
    console.log(`⏳ Migrating ${localTestimonials.length} testimonials...`);

    for (const t of localTestimonials) {
      await Testimonial.findOneAndUpdate(
        { testimonialId: t.id },
        {
          testimonialId: t.id,
          name: t.name,
          role: t.role,
          company: t.company || "",
          image: t.image,
          quote: t.quote,
          rating: t.rating,
          platform: t.platform,
          date: t.date,
          category: t.category,
          featured: t.featured,
          linkedInUrl: "",
        },
        { upsert: true, new: true }
      );
      console.log(`✔️  Migrated: ${t.name}`);
    }

    console.log("✨ ALL TESTIMONIALS MIGRATED!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();

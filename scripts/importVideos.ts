/**
 * BULK IMPORT SCRIPT — Course Videos (Vimeo IDs)
 * ─────────────────────────────────────────────
 * Usage:
 *   1. Put your video mappings in the "videoMappings" array below.
 *   2. Run this script once: npx ts-node scripts/importVideos.ts
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

// Minimal Lesson Schema for the script
const LessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true, unique: true },
  vimeoId: { type: String, required: true },
  courseId: { type: String, required: true },
  isFree: { type: Boolean, default: false },
});

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);

/* ─────────────────────────────────────────────────────────────────────────────
   👇 PASTE YOUR VIDEO MAPPINGS HERE
   ───────────────────────────────────────────────────────────────────────────── */
const videoMappings = [
  // ─── IMechE (imech-101) ──────────────────────────────────────────────────
  { lessonId: "imech-101-l1",  vimeoId: "https://vimeo.com/1166966274", courseId: "imech-101", isFree: true },
  { lessonId: "imech-101-l2",  vimeoId: "https://vimeo.com/1166966339", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l3",  vimeoId: "https://vimeo.com/1166966422", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l4",  vimeoId: "https://vimeo.com/1166966480", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l5",  vimeoId: "https://vimeo.com/1166966491", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l6",  vimeoId: "https://vimeo.com/1166966522", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l7",  vimeoId: "https://vimeo.com/1166966529", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l8",  vimeoId: "https://vimeo.com/1166966597", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l9",  vimeoId: "https://vimeo.com/1166966723", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l10", vimeoId: "https://vimeo.com/1166966819", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l11", vimeoId: "https://vimeo.com/1166966838", courseId: "imech-101", isFree: false },
  { lessonId: "imech-101-l12", vimeoId: "https://vimeo.com/1166966959", courseId: "imech-101", isFree: false },

  // ─── IET (iet-101) ────────────────────────────────────────────────────────
  { lessonId: "iet-101-l1",  vimeoId: "https://vimeo.com/1166937140", courseId: "iet-101", isFree: true },
  { lessonId: "iet-101-l2",  vimeoId: "https://vimeo.com/1166946766", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l3",  vimeoId: "https://vimeo.com/1166946842", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l4",  vimeoId: "https://vimeo.com/1166946913", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l5",  vimeoId: "https://vimeo.com/1166946950", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l6",  vimeoId: "https://vimeo.com/1166946928", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l7",  vimeoId: "https://vimeo.com/1166947035", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l8",  vimeoId: "https://vimeo.com/1166947046", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l9",  vimeoId: "https://vimeo.com/1166947098", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l10", vimeoId: "https://vimeo.com/1166947209", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l11", vimeoId: "https://vimeo.com/1166947277", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l12", vimeoId: "https://vimeo.com/1166947297", courseId: "iet-101", isFree: false },
  { lessonId: "iet-101-l13", vimeoId: "https://vimeo.com/1166947392", courseId: "iet-101", isFree: false },

  // ─── ICE (ice-101) ────────────────────────────────────────────────────────
  { lessonId: "ice-101-l1",  vimeoId: "https://vimeo.com/1166966969", courseId: "ice-101", isFree: true },
  { lessonId: "ice-101-l2",  vimeoId: "https://vimeo.com/1166967437", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l3",  vimeoId: "https://vimeo.com/1166967481", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l4",  vimeoId: "https://vimeo.com/1166967545", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l5",  vimeoId: "https://vimeo.com/1166967574", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l6",  vimeoId: "https://vimeo.com/1166967583", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l7",  vimeoId: "https://vimeo.com/1166967609", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l8",  vimeoId: "https://vimeo.com/1166967623", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l9",  vimeoId: "https://vimeo.com/1166967730", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l10", vimeoId: "https://vimeo.com/1166967817", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l11", vimeoId: "https://vimeo.com/1166967692", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l12", vimeoId: "https://vimeo.com/1166967864", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l13", vimeoId: "https://vimeo.com/1166967903", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l14", vimeoId: "https://vimeo.com/1166967922", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l15", vimeoId: "https://vimeo.com/1166967933", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l16", vimeoId: "https://vimeo.com/1166968000", courseId: "ice-101", isFree: false },
  { lessonId: "ice-101-l17", vimeoId: "https://vimeo.com/1166968028", courseId: "ice-101", isFree: false },

  // ─── P.Eng (peng-101) ─────────────────────────────────────────────────────
  { lessonId: "peng-101-l1", vimeoId: "https://vimeo.com/1166968035", courseId: "peng-101", isFree: true },
  { lessonId: "peng-101-l2", vimeoId: "https://vimeo.com/1166968045", courseId: "peng-101", isFree: false },
  { lessonId: "peng-101-l3", vimeoId: "https://vimeo.com/1166968081", courseId: "peng-101", isFree: false },
  { lessonId: "peng-101-l4", vimeoId: "https://vimeo.com/1166968116", courseId: "peng-101", isFree: false },
  { lessonId: "peng-101-l5", vimeoId: "https://vimeo.com/1166968127", courseId: "peng-101", isFree: false },
];

async function importVideos() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected.");

    console.log(`⏳ Importing ${videoMappings.length} video mappings...`);

    for (const mapping of videoMappings) {
      // Automatically extract numeric ID if a full Vimeo URL is provided
      let cleanVimeoId = mapping.vimeoId;
      if (cleanVimeoId.includes("vimeo.com/")) {
        const parts = cleanVimeoId.split("/");
        cleanVimeoId = parts[parts.length - 1].split("?")[0]; // Get the last part of URL
      }

      await Lesson.findOneAndUpdate(
        { lessonId: mapping.lessonId },
        { 
          ...mapping, 
          vimeoId: cleanVimeoId 
        },
        { upsert: true, new: true }
      );
    }

    console.log("✨ ALL VIDEOS IMPORTED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

importVideos();

import mongoose from "mongoose";
import Lesson from "../src/models/Lesson";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const lessons = await Lesson.find({ courseId: "ds-101" });
  console.log(`Found ${lessons.length} lessons for ds-101`);
  if (lessons.length > 0) {
    console.log("Example lesson:", JSON.stringify(lessons[0], null, 2));
  }
  process.exit(0);
}

check();

import mongoose, { Schema, Document, models } from "mongoose";

export interface ILesson extends Document {
  lessonId: string; // Unique identifier matched in courses.ts (e.g. "imech-101-l1")
  vimeoId: string;  // The actual Vimeo video ID
  courseId: string; // To double check purchase
  isFree: boolean;  // Whether the lesson is a free preview
}

const LessonSchema = new Schema<ILesson>({
  lessonId: { type: String, required: true, unique: true, index: true },
  vimeoId: { type: String, required: true },
  courseId: { type: String, required: true, index: true },
  isFree: { type: Boolean, default: false },
});

const Lesson = models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { practiceTests as localTests, practiceQuestions as localQuestions } from "../src/data/practiceTests";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("❌ MONGODB_URI missing"); process.exit(1); }

const PracticeQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
});

const PracticeTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  category: { type: String, required: true },
  duration: { type: Number, required: true },
  questionsCount: { type: Number, required: true },
  instructor: { type: String },
  level: { type: String, default: 'Intermediate' },
  rating: { type: Number },
  reviews: { type: Number },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  isFree: { type: Boolean, default: false },
  questions: [PracticeQuestionSchema],
}, { timestamps: true });

const PracticeTest = mongoose.models.PracticeTest || mongoose.model("PracticeTest", PracticeTestSchema);

async function migrate() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected.");

    // Migrate each test
    for (const test of localTests) {
      // For ethics-test, attach the questions from practiceQuestions
      const questions = test.id === "ethics-test"
        ? localQuestions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
          }))
        : []; // free-test-1 has no questions in the data file

      await PracticeTest.findOneAndUpdate(
        { testId: test.id },
        {
          testId: test.id,
          title: test.title,
          description: test.description,
          image: test.image,
          category: test.category,
          duration: test.duration,
          questionsCount: test.questions,
          instructor: test.instructor,
          level: test.level,
          rating: test.rating,
          reviews: test.reviews,
          price: test.price,
          originalPrice: test.originalPrice,
          isFree: (test as any).isFree || false,
          questions: questions,
        },
        { upsert: true, new: true }
      );
      console.log(`✔️  Migrated test: ${test.title} (${questions.length} questions)`);
    }

    console.log("✨ ALL PRACTICE TESTS MIGRATED!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();

import mongoose from 'mongoose';

const PracticeQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
});

const PracticeTestSchema = new mongoose.Schema(
  {
    testId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    questionsCount: { type: Number, required: true },
    instructor: { type: String },
    level: { type: String, default: 'Intermediate' },
    rating: { type: Number },
    reviews: { type: Number },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    isFree: { type: Boolean, default: false },
    questions: [PracticeQuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.PracticeTest || mongoose.model('PracticeTest', PracticeTestSchema);

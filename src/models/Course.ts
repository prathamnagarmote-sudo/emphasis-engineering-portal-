import mongoose from 'mongoose';

const CourseLessonSchema = new mongoose.Schema({
  id: { type: String, required: true }, // 'imech-101-l1'
  title: { type: String, required: true },
  vimeoId: { type: String },
  duration: { type: String, required: true },
  free: { type: Boolean, default: false },
});


const CourseSectionSchema = new mongoose.Schema({
  section: { type: String, required: true },
  lessons: [CourseLessonSchema],
});

const DownloadableResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  fileSize: { type: String, required: true },
  url: { type: String, required: true },
});

const CourseSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true, unique: true }, // e.g. 'imech-101'
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number },
    reviews: { type: Number },
    students: { type: Number },
    instructor: { type: String },
    instructorImage: { type: String },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String },
    duration: { type: String },
    lessonsCount: { type: Number }, // Replaced 'lessons' with 'lessonsCount' to avoid conflict
    curriculum: [CourseSectionSchema],
    downloadableResources: [DownloadableResourceSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);

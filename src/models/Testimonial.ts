import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    testimonialId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String },
    image: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    platform: { type: String, enum: ['LinkedIn', 'Trustpilot', 'Direct', 'Google'], default: 'Direct' },
    date: { type: String, required: true },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    linkedInUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

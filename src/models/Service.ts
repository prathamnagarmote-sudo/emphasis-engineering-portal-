import mongoose from 'mongoose';

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
  serviceId: { type: String, required: true }, // e.g., 'us-pe-1'
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  features: [{ type: String }],
  calendlyUrl: { type: String, required: true }, // Redirect here after payment
});

const ServicePageSchema = new mongoose.Schema(
  {
    pageId: { type: String, required: true, unique: true }, // e.g., 'us-pe', 'imeche'
    title: { type: String, required: true }, // Title of the entire page
    description: { type: String, required: true },
    icon: { type: String, default: 'Briefcase' },
    image: { type: String },
    features: [{ type: String }],
    stepByStepProcess: [StepSchema],
    faqs: [FAQSchema],
    services: [ServiceItemSchema], // The buying cards for this page
  },
  { timestamps: true }
);

export default mongoose.models.ServicePage || mongoose.model('ServicePage', ServicePageSchema);

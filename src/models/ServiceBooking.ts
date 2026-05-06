import mongoose from 'mongoose';

const ServiceBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: String, required: true },
  serviceTitle: { type: String },
  status: { type: String, enum: ['pending', 'scheduled', 'completed'], default: 'pending' },
  formData: {
    name: String,
    email: String,
    city: String,
    country: String,
    phone: String,
    whatsapp: String,
    preferredDate: String,
    preferredTime: String,
    additionalDetails: String,
  },
  meetingLink: String,
  scheduledAt: Date,
}, { timestamps: true });

export default mongoose.models.ServiceBooking || mongoose.model('ServiceBooking', ServiceBookingSchema);

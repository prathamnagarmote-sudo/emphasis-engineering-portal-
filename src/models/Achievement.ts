import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    credential: { type: String, required: true },
    location: { type: String, required: true },
    detail: { type: String, required: true },
    photo: { type: String, required: true },
    badge: { type: String, required: true },
    color: { type: String, default: '#3F9FA3' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null }, // Optional expiration date
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

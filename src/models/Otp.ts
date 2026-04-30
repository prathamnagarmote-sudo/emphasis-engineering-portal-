import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Only one active OTP per email at a time
    },
    code: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document automatically deletes after 10 minutes (600 seconds)
    },
  }
);

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    purchasedContent: [
      {
        type: String, // Storing string IDs like 'imech-101' for now
      }
    ],
    scheduledServiceIds: [
      {
        type: String, // IDs of services that have been scheduled
      }
    ],
  },
  {
    timestamps: true,
  }
);

// If the model exists, use it. Otherwise, create a new one.
export default mongoose.models.User || mongoose.model('User', UserSchema);

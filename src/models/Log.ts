import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // 'info', 'error', 'webhook'
    message: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Log || mongoose.model('Log', LogSchema);

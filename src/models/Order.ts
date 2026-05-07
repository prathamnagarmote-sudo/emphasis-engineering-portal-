import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: String,
    userName: String,
    items: [
      {
        id: String,
        title: String,
        type: String,
        price: Number, // Original price
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'cad',
    },
    voucherCode: String,
    discountAmount: Number,
    paymentStatus: {
      type: String,
      default: 'paid',
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    country: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

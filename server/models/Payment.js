import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const paymentSchema = new Schema(
  {
    organization: objectId('Organization', true),
    invoice: objectId('Invoice', true),
    provider: { type: String, enum: ['manual', 'stripe', 'razorpay'], default: 'manual' },
    providerPaymentId: optionalText(160),
    amount: { type: Number, min: 0, required: true },
    currency: { type: String, minlength: 3, maxlength: 3, default: 'USD' },
    status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
    paidAt: Date,
    failureReason: optionalText(1000),
  },
  timestamps,
);

paymentSchema.index({ organization: 1, status: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);

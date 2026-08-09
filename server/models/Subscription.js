import mongoose from 'mongoose';
import { Schema, objectId, subscriptionStatuses, timestamps } from './common.js';

const subscriptionSchema = new Schema(
  {
    organization: objectId('Organization', true),
    plan: { type: String, enum: ['free', 'starter', 'growth', 'enterprise'], required: true },
    status: { type: String, enum: subscriptionStatuses, default: 'trialing' },
    seats: { type: Number, min: 1, default: 5 },
    amount: { type: Number, min: 0, required: true },
    currency: { type: String, minlength: 3, maxlength: 3, default: 'USD' },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelledAt: Date,
  },
  timestamps,
);

subscriptionSchema.index({ organization: 1, status: 1 });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);

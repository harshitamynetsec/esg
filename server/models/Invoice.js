import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const invoiceSchema = new Schema(
  {
    organization: objectId('Organization', true),
    subscription: objectId('Subscription', true),
    invoiceNumber: { type: String, required: true, trim: true, unique: true },
    amount: { type: Number, min: 0, required: true },
    taxAmount: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, min: 0, required: true },
    currency: { type: String, minlength: 3, maxlength: 3, default: 'USD' },
    status: { type: String, enum: ['draft', 'issued', 'paid', 'overdue', 'void'], default: 'draft' },
    dueDate: { type: Date, required: true },
    paidAt: Date,
    notes: optionalText(1000),
  },
  timestamps,
);

invoiceSchema.index({ organization: 1, dueDate: -1 });

export const Invoice = mongoose.model('Invoice', invoiceSchema);

import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const policySchema = new Schema(
  {
    organization: objectId('Organization', true),
    category: objectId('PolicyCategory'),
    title: nameField('Policy title', 2, 160),
    summary: optionalText(1200),
    content: { type: String, required: true, trim: true, minlength: 20, maxlength: 50000 },
    owner: objectId('User'),
    approver: objectId('User'),
    effectiveDate: { type: Date, required: true },
    reviewDate: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'in_review', 'approved', 'active', 'archived'], default: 'draft' },
    tags: [{ type: String, trim: true, maxlength: 40 }],
  },
  timestamps,
);

policySchema.index({ organization: 1, category: 1, status: 1 });
policySchema.index({ organization: 1, title: 1 }, { unique: true });
policySchema.pre('validate', function validateReview(next) {
  if (this.effectiveDate && this.reviewDate && this.reviewDate <= this.effectiveDate) {
    next(new Error('Policy review date must be after effective date'));
    return;
  }
  // next();
});

export const Policy = mongoose.model('Policy', policySchema);

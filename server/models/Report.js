import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const reportSchema = new Schema(
  {
    organization: objectId('Organization', true),
    title: nameField('Report title', 2, 180),
    type: { type: String, enum: ['esg_summary', 'sdg_alignment', 'kpi_performance', 'policy_compliance'], required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'generating', 'ready', 'failed', 'archived'], default: 'draft' },
    generatedBy: objectId('User'),
    summary: optionalText(3000),
    metricsSnapshot: { type: Schema.Types.Mixed, default: {} },
  },
  timestamps,
);

reportSchema.index({ organization: 1, type: 1, createdAt: -1 });
reportSchema.pre('validate', function validatePeriod(next) {
  if (this.periodStart && this.periodEnd && this.periodEnd < this.periodStart) {
    next(new Error('Report period end must be after period start'));
    return;
  }
});

export const Report = mongoose.model('Report', reportSchema);

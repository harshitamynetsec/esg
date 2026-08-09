import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const kpiHistorySchema = new Schema(
  {
    organization: objectId('Organization', true),
    kpi: objectId('KPI', true),
    value: { type: Number, required: true, min: 0 },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    note: optionalText(1000),
    evidenceUpload: objectId('Upload'),
    recordedBy: objectId('User', true),
  },
  timestamps,
);

kpiHistorySchema.index({ organization: 1, kpi: 1, periodEnd: -1 });
kpiHistorySchema.pre('validate', function validatePeriod(next) {
  if (this.periodStart && this.periodEnd && this.periodEnd < this.periodStart) {
    next(new Error('KPI history period end must be after period start'));
    return;
  }
  next();
});

export const KPIHistory = mongoose.model('KPIHistory', kpiHistorySchema);

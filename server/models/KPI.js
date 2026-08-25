import mongoose from 'mongoose';
import { Schema, esgPillars, lifecycleStatuses, nameField, objectId, optionalText, timestamps } from './common.js';

const kpiSchema = new Schema(
  {
    organization: objectId('Organization', true),
    materialTopic: objectId('MaterialTopic'),
    sdgs: [objectId('SDG')],
    objective: objectId('Objective'),
    goal: objectId('Goal'),
    name: nameField('KPI name', 2, 140),
    description: optionalText(1200),
    pillar: { type: String, enum: esgPillars, required: true },
    metricType: {
      type: String,
      enum: ['number', 'percentage', 'currency', 'ratio', 'boolean'],
      default: 'number',
    },
    unit: nameField('KPI unit', 1, 40),
    baselineValue: { type: Number, min: 0, default: 0 },
    targetValue: { type: Number, required: true, min: [0, 'KPI target must be positive'] },
    currentValue: { type: Number, min: 0, default: 0 },
    frequency: { type: String, enum: ['monthly', 'quarterly', 'annually'], required: true },
    owner: objectId('User'),
    status: { type: String, enum: lifecycleStatuses, default: 'active' },
    trackingStatus: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    progressStage: { type: String, enum: ['early', 'mid', 'late'], default: 'early' },
    startDate: { type: Date },
    targetDate: { type: Date },
  },
  timestamps,
);

kpiSchema.index({ organization: 1, pillar: 1, status: 1 });
kpiSchema.index({ organization: 1, name: 1 }, { unique: true });
kpiSchema.index({ materialTopic: 1, sdgs: 1 });

export const KPI = mongoose.model('KPI', kpiSchema);

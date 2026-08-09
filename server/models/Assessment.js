import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const assessmentSchema = new Schema(
  {
    organization: objectId('Organization'),
    user: objectId('User'),
    respondentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Respondent email must be valid'],
    },
    type: { type: String, enum: ['compass', 'onboarding', 'annual'], required: true },
    scores: {
      environmental: { type: Number, min: 0, max: 100, default: 0 },
      social: { type: Number, min: 0, max: 100, default: 0 },
      governance: { type: Number, min: 0, max: 100, default: 0 },
      overall: { type: Number, min: 0, max: 100, default: 0 },
    },
    recommendations: [{ type: String, trim: true, maxlength: 500 }],
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    completedAt: Date,
    notes: optionalText(2000),
  },
  timestamps,
);

assessmentSchema.index({ organization: 1, type: 1, createdAt: -1 });
assessmentSchema.index({ respondentEmail: 1 });

export const Assessment = mongoose.model('Assessment', assessmentSchema);

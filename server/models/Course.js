import mongoose from 'mongoose';
import { Schema, esgPillars, nameField, optionalText, timestamps } from './common.js';

const courseSchema = new Schema(
  {
    title: nameField('Course title', 2, 160),
    description: optionalText(1600),
    pillar: { type: String, enum: [...esgPillars, 'cross_pillar'], required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    durationMinutes: { type: Number, min: 1, required: true },
    isPublished: { type: Boolean, default: false },
  },
  timestamps,
);

courseSchema.index({ pillar: 1, level: 1 });

export const Course = mongoose.model('Course', courseSchema);

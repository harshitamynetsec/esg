import mongoose from 'mongoose';
import { Schema, objectId, timestamps } from './common.js';

const progressSchema = new Schema(
  {
    organization: objectId('Organization', true),
    user: objectId('User', true),
    course: objectId('Course', true),
    module: objectId('Module'),
    lesson: objectId('Lesson'),
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    percentComplete: { type: Number, min: 0, max: 100, default: 0 },
    completedAt: Date,
  },
  timestamps,
);

progressSchema.index({ user: 1, course: 1, lesson: 1 }, { unique: true });
progressSchema.pre('save', function setCompletion(next) {
  if (this.percentComplete === 100 && !this.completedAt) {
    this.status = 'completed';
    this.completedAt = new Date();
  }
  next();
});

export const Progress = mongoose.model('Progress', progressSchema);

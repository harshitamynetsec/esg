import mongoose from 'mongoose';
import { Schema, lifecycleStatuses, nameField, objectId, optionalText, timestamps } from './common.js';

const goalSchema = new Schema(
  {
    organization: objectId('Organization', true),
    objective: objectId('Objective'),
    title: nameField('Goal title', 5, 160),
    description: optionalText(1200),
    baselineValue: { type: Number, min: 0, default: 0 },
    targetValue: { type: Number, required: true, min: [0, 'Target value must be positive'] },
    currentValue: { type: Number, min: 0, default: 0 },
    unit: nameField('Goal unit', 1, 40),
    dueDate: { type: Date, required: true },
    status: { type: String, enum: lifecycleStatuses, default: 'active' },
  },
  timestamps,
);

goalSchema.index({ organization: 1, objective: 1 });
goalSchema.pre('validate', function validateTarget(next) {
  if (this.targetValue <= this.baselineValue) {
    next(new Error('Goal target value must be greater than baseline value'));
    return;
  }
  next();
});

export const Goal = mongoose.model('Goal', goalSchema);

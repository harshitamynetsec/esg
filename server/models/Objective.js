import mongoose from 'mongoose';
import { Schema, lifecycleStatuses, nameField, objectId, optionalText, timestamps } from './common.js';

const objectiveSchema = new Schema(
  {
    organization: objectId('Organization', true),
    materialTopic: objectId('MaterialTopic'),
    title: nameField('Objective title', 5, 160),
    description: optionalText(1600),
    owner: objectId('User'),
    smart: {
      specific: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
      measurable: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
      achievable: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
      relevant: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
      timeBound: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
    },
    startDate: { type: Date, required: true },
    targetDate: { type: Date, required: true },
    status: { type: String, enum: lifecycleStatuses, default: 'active' },
  },
  timestamps,
);

objectiveSchema.index({ organization: 1, materialTopic: 1 });
objectiveSchema.index({ targetDate: 1 });
objectiveSchema.pre('validate', function validateDates(next) {
  if (this.startDate && this.targetDate && this.targetDate <= this.startDate) {
    next(new Error('Objective target date must be after start date'));
    return;
  }
  next();
});

export const Objective = mongoose.model('Objective', objectiveSchema);

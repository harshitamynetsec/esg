import mongoose from 'mongoose';
import { Schema, esgPillars, optionalText, timestamps } from './common.js';

const questionSchema = new Schema(
  {
    text: { type: String, required: true, trim: true, minlength: 5, maxlength: 800 },
    pillar: { type: String, enum: esgPillars, required: true, index: true },
    weight: { type: Number, min: 1, max: 10, default: 1 },
    materialTopics: [{ type: Schema.Types.ObjectId, ref: 'MaterialTopic', index: true }],
    sdgs: [{ type: Schema.Types.ObjectId, ref: 'SDG', index: true }],
    order: { type: Number, default: 0 },
    category: { type: String, trim: true, maxlength: 120 },
    guidance: optionalText(1000),
    isActive: { type: Boolean, default: true, index: true },
  },
  timestamps,
);

questionSchema.index({ materialTopics: 1, isActive: 1 });
questionSchema.index({ sdgs: 1, isActive: 1 });

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

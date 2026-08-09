import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const moduleSchema = new Schema(
  {
    course: objectId('Course', true),
    title: nameField('Module title', 2, 160),
    description: optionalText(1200),
    order: { type: Number, min: 1, required: true },
  },
  timestamps,
);

moduleSchema.index({ course: 1, order: 1 }, { unique: true });

export const Module = mongoose.model('Module', moduleSchema);

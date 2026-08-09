import mongoose from 'mongoose';
import { Schema, esgPillars, nameField, objectId, optionalText, timestamps } from './common.js';

const policyCategorySchema = new Schema(
  {
    organization: objectId('Organization'),
    name: nameField('Policy category name', 2, 100),
    pillar: { type: String, enum: esgPillars, required: true },
    description: optionalText(600),
    isSystem: { type: Boolean, default: false },
  },
  timestamps,
);

policyCategorySchema.index({ organization: 1, name: 1 }, { unique: true });

export const PolicyCategory = mongoose.model('PolicyCategory', policyCategorySchema);

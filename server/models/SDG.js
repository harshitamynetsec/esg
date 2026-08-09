import mongoose from 'mongoose';
import { Schema, nameField, optionalText, timestamps, esgPillars } from './common.js';

const sdgSchema = new Schema(
  {
    number: { type: Number, required: true, min: 1, max: 17, unique: true },
    name: nameField('SDG name', 2, 140),
    shortName: { type: String, trim: true }, // Added to capture 'short' field
    description: optionalText(1200),
    color: { type: String, trim: true, match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a hex code'] },
    iconUrl: optionalText(500),
    pillars: [{ type: String, enum: esgPillars }] // Added to capture 'categories' field
  },
  timestamps,
);

export const SDG = mongoose.model('SDG', sdgSchema);

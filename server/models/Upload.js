import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const uploadSchema = new Schema(
  {
    organization: objectId('Organization'),
    uploadedBy: objectId('User'),
    originalName: { type: String, required: true, trim: true, maxlength: 255 },
    storedName: { type: String, required: true, trim: true, maxlength: 255 },
    mimeType: { type: String, required: true, trim: true, maxlength: 120 },
    size: { type: Number, min: 1, required: true },
    path: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, enum: ['policy', 'kpi_evidence', 'report', 'profile', 'other'], default: 'other' },
    checksum: optionalText(160),
  },
  timestamps,
);

uploadSchema.index({ organization: 1, category: 1, createdAt: -1 });

export const Upload = mongoose.model('Upload', uploadSchema);

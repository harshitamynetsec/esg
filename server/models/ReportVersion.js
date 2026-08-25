import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const reportVersionSchema = new Schema(
  {
    organization: objectId('Organization', true),
    report: objectId('Report', true),
    version: { type: Number, min: 1, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    upload: objectId('Upload'),
    pdfFileId: { type: Schema.Types.ObjectId },
    notes: optionalText(1000),
    createdBy: objectId('User', true),
  },
  timestamps,
);

reportVersionSchema.index({ report: 1, version: -1 }, { unique: true });

export const ReportVersion = mongoose.model('ReportVersion', reportVersionSchema);

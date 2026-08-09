import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const policyDocumentSchema = new Schema(
  {
    organization: objectId('Organization', true),
    policy: objectId('Policy', true),
    upload: objectId('Upload', true),
    version: { type: Number, min: 1, required: true },
    notes: optionalText(1000),
    uploadedBy: objectId('User', true),
  },
  timestamps,
);

policyDocumentSchema.index({ policy: 1, version: -1 }, { unique: true });

export const PolicyDocument = mongoose.model('PolicyDocument', policyDocumentSchema);

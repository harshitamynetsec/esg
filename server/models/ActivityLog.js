import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const activityLogSchema = new Schema(
  {
    organization: objectId('Organization'),
    actor: objectId('User'),
    action: { type: String, required: true, trim: true, maxlength: 120 },
    entityType: { type: String, required: true, trim: true, maxlength: 80 },
    entityId: { type: Schema.Types.ObjectId },
    message: optionalText(1000),
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  timestamps,
);

activityLogSchema.index({ organization: 1, createdAt: -1 });
activityLogSchema.index({ actor: 1, createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

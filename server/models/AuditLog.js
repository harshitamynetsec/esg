import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const auditLogSchema = new Schema(
  {
    organization: objectId('Organization'),
    actor: objectId('User'),
    action: { type: String, required: true, trim: true, maxlength: 120 },
    resource: { type: String, required: true, trim: true, maxlength: 80 },
    resourceId: { type: Schema.Types.ObjectId },
    ipAddress: optionalText(80),
    userAgent: optionalText(500),
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    outcome: { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  timestamps,
);

auditLogSchema.index({ organization: 1, resource: 1, createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

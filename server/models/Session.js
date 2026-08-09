import crypto from 'crypto';
import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const sessionSchema = new Schema(
  {
    user: objectId('User', true),
    refreshTokenHash: { type: String, required: true, index: true },
    ipAddress: optionalText(80),
    userAgent: optionalText(500),
    expiresAt: { type: Date, required: true },
    revokedAt: Date,
  },
  timestamps,
);

sessionSchema.index({ user: 1, expiresAt: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

sessionSchema.statics.hashToken = function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const Session = mongoose.model('Session', sessionSchema);

import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const notificationSchema = new Schema(
  {
    organization: objectId('Organization'),
    user: objectId('User', true),
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    message: { type: String, required: true, trim: true, minlength: 2, maxlength: 1000 },
    type: { type: String, enum: ['info', 'success', 'warning', 'danger'], default: 'info' },
    link: optionalText(500),
    readAt: Date,
  },
  timestamps,
);

notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);

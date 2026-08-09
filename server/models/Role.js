import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const roleSchema = new Schema(
  {
    name: nameField('Role name', 2, 80),
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9_]+$/, 'Role key can contain lowercase letters, numbers, and underscores'],
    },
    description: optionalText(500),
    permissions: [objectId('Permission')],
    organization: objectId('Organization'),
    isSystem: { type: Boolean, default: false },
  },
  timestamps,
);

roleSchema.index({ key: 1, organization: 1 }, { unique: true });

export const Role = mongoose.model('Role', roleSchema);

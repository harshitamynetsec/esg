import mongoose from 'mongoose';
import { Schema, nameField, optionalText, timestamps } from './common.js';

const permissionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z]+:[a-z]+$/, 'Permission key must use resource:action format'],
    },
    name: nameField('Permission name'),
    description: optionalText(500),
    category: nameField('Permission category', 2, 80),
  },
  timestamps,
);

permissionSchema.index({ category: 1, key: 1 });

export const Permission = mongoose.model('Permission', permissionSchema);

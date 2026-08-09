import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const departmentSchema = new Schema(
  {
    organization: objectId('Organization', true),
    name: nameField('Department name', 2, 100),
    description: optionalText(500),
    manager: objectId('User'),
    isActive: { type: Boolean, default: true },
  },
  timestamps,
);

departmentSchema.index({ organization: 1, name: 1 }, { unique: true });

export const Department = mongoose.model('Department', departmentSchema);

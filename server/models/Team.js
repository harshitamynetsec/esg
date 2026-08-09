import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const teamSchema = new Schema(
  {
    organization: objectId('Organization', true),
    department: objectId('Department', true),
    name: nameField('Team name', 2, 100),
    description: optionalText(500),
    members: [objectId('User')],
    lead: objectId('User'),
  },
  timestamps,
);

teamSchema.index({ organization: 1, department: 1, name: 1 }, { unique: true });

export const Team = mongoose.model('Team', teamSchema);

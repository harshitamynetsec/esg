import mongoose from 'mongoose';
import { Schema, emailField, nameField, optionalText, timestamps } from './common.js';

const demoRequestSchema = new Schema(
  {
    fullName: nameField('Full name', 2, 160),
    workEmail: emailField,
    company: nameField('Company', 1, 160),
    jobTitle: optionalText(160),
    companySize: optionalText(40),
    region: optionalText(160),
    frameworks: [{ type: String, trim: true, maxlength: 40 }],
    notes: optionalText(2000),
    status: { type: String, enum: ['new', 'contacted', 'scheduled', 'closed'], default: 'new' },
  },
  timestamps,
);

demoRequestSchema.index({ createdAt: -1 });

export const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);

import mongoose from 'mongoose';
import { Schema, emailField, nameField, optionalText, timestamps } from './common.js';

const organizationSchema = new Schema(
  {
    name: nameField('Company', 2, 100),
    legalName: nameField('Legal name', 2, 160),
    industry: nameField('Industry', 2, 100),
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-250', '251-1000', '1000+'],
      required: true,
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+\..+/, 'Website must be a valid URL'],
    },
    contactEmail: emailField,
    country: nameField('Country', 2, 80),
    address: optionalText(500),
    sustainabilityMaturity: {
      type: String,
      enum: ['starter', 'developing', 'managed', 'advanced', 'leader'],
      default: 'starter',
    },
    settings: {
      fiscalYearStartMonth: { type: Number, min: 1, max: 12, default: 4 },
      reportingCurrency: { type: String, minlength: 3, maxlength: 3, default: 'USD' },
      defaultFrameworks: [{ type: String, trim: true }],
    },
    isActive: { type: Boolean, default: true },
  },
  timestamps,
);

organizationSchema.index({ name: 1 });
organizationSchema.index({ contactEmail: 1 }, { unique: true });

export const Organization = mongoose.model('Organization', organizationSchema);

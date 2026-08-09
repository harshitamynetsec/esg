import mongoose from 'mongoose';

export const { Schema } = mongoose;

export const objectId = (ref, required = false) => ({
  type: Schema.Types.ObjectId,
  ref,
  required,
});

export const emailField = {
  type: String,
  lowercase: true,
  trim: true,
  required: true,
  match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
};

export const nameField = (label = 'Name', min = 2, max = 120) => ({
  type: String,
  required: [true, `${label} is required`],
  trim: true,
  minlength: [min, `${label} must be at least ${min} characters`],
  maxlength: [max, `${label} must be at most ${max} characters`],
});

export const optionalText = (max = 2000) => ({
  type: String,
  trim: true,
  maxlength: [max, `Text must be at most ${max} characters`],
});

export const timestamps = { timestamps: true };

export const lifecycleStatuses = ['draft', 'active', 'archived'];
export const esgPillars = ['environmental', 'social', 'governance'];
export const userRoles = ['subscriber', 'esg_manager', 'organization_admin', 'platform_super_admin'];
export const subscriptionStatuses = ['trialing', 'active', 'past_due', 'cancelled', 'expired'];

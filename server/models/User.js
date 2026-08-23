import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Schema, emailField, nameField, objectId, optionalText, timestamps, userRoles } from './common.js';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const userSchema = new Schema(
  {
    firstName: nameField('First name', 1, 80),
    lastName: nameField('Last name', 1, 80),
    email: emailField,
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
      validate: {
        validator(value) {
          if (!value) return true;
          return value.startsWith('$2') || passwordPattern.test(value);
        },
        message: 'Password must contain uppercase, lowercase, number, and special character',
      },
    },
    organization: objectId('Organization'),
    roles: [objectId('Role')],
    roleKey: { type: String, enum: userRoles, default: 'subscriber' },
    title: optionalText(120),
    phone: optionalText(40),
    avatarUrl: optionalText(500),
    status: { type: String, enum: ['invited', 'active', 'inactive'], default: 'active' },
    inviteTokenHash: { type: String, select: false },
    inviteTokenExpiresAt: { type: Date, select: false },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  timestamps,
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ organization: 1, roleKey: 1 });

userSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.pre('save', async function hashPassword() {
  if (!this.password || !this.isModified('password') || this.password.startsWith('$2')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.password;
    delete ret.inviteTokenHash;
    delete ret.inviteTokenExpiresAt;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);

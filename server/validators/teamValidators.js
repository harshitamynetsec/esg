import { body } from 'express-validator';
import { userRoles } from '../models/common.js';

export const inviteValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('firstName').trim().isLength({ min: 1, max: 80 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1, max: 80 }).withMessage('Last name is required'),
  body('roleKey')
    .optional()
    .isIn(userRoles)
    .withMessage('Role key must be a valid role'),
];

export const updateMemberValidator = [
  body('firstName').optional().trim().isLength({ min: 1, max: 80 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 80 }),
  body('roleKey').optional().isIn(userRoles),
  body('title').optional().trim().isLength({ max: 120 }),
  body('phone').optional().trim().isLength({ max: 40 }),
];

export const statusValidator = [
  body('status').optional().isIn(['active', 'inactive', 'invited']),
  body('isActive').optional().isBoolean(),
];

export const setPasswordValidator = [
  body('token').isString().trim().isLength({ min: 1 }).withMessage('Token is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
];

import { body } from 'express-validator';

export const registerValidator = [
  body('firstName').trim().isLength({ min: 1, max: 80 }),
  body('lastName').trim().isLength({ min: 1, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('organization.name').trim().isLength({ min: 2, max: 100 }),
  body('organization.legalName').trim().isLength({ min: 2, max: 160 }),
  body('organization.industry').trim().isLength({ min: 2, max: 100 }),
  body('organization.size').isIn(['1-10', '11-50', '51-250', '251-1000', '1000+']),
  body('organization.contactEmail').isEmail().normalizeEmail(),
  body('organization.country').trim().isLength({ min: 2, max: 80 }),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 1 }),
];

export const refreshValidator = [body('refreshToken').isJWT()];

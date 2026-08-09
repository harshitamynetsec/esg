import { body, param, query } from 'express-validator';

export const idParamValidator = [param('id').isMongoId().withMessage('Valid id is required')];

export const paginationValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim().isLength({ max: 120 }),
  query('sort').optional().trim().isLength({ max: 80 }),
];

export const mongoIdBody = (field) => body(field).optional().isMongoId();

export const requiredMongoIdBody = (field) => body(field).isMongoId();

export const stringBody = (field, min = 1, max = 500, optional = false) => {
  const validator = body(field).trim().isLength({ min, max });
  return optional ? validator.optional() : validator;
};

export const positiveNumberBody = (field, optional = false) => {
  const validator = body(field).isFloat({ min: 0 });
  return optional ? validator.optional() : validator;
};

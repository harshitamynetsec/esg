import { validationResult } from 'express-validator';

export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
    return;
  }

  const error = new Error('Validation failed');
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.errors = result.array().map((item) => ({ path: item.path, message: item.msg }));
  next(error);
};

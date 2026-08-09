import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, next) => {
  void next;
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  const errors = error.errors
    ? Object.values(error.errors).map((item) => ({ field: item.path, message: item.message }))
    : undefined;

  logger.error(error.message, {
    statusCode,
    stack: env.nodeEnv === 'production' ? undefined : error.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && env.nodeEnv === 'production' ? 'Internal server error' : error.message,
    code: error.code || error.name || 'ERROR',
    errors,
  });
};

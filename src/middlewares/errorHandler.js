const config = require('../config');
const AppError = require('../utils/AppError');

/**
 * Converts known "unexpected" error types (Mongoose validation errors,
 * duplicate key errors, invalid ObjectId casts, JWT errors) into our
 * consistent AppError shape, so the final handler below never has to
 * special-case them.
 */
function normalizeError(err) {
  if (err instanceof AppError) return err;

  // Mongoose validation error (schema-level, not our Zod/Joi layer)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    return new AppError(message, 400, 'VALIDATION_ERROR');
  }

  // Mongoose invalid ObjectId (e.g. GET /products/not-a-valid-id)
  if (err.name === 'CastError') {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_ID');
  }

  // Mongo duplicate key (e.g. unique email/SKU already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(`Duplicate value for ${field}`, 409, 'DUPLICATE_KEY');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Authentication token expired', 401, 'TOKEN_EXPIRED');
  }

  // Anything else is an unexpected bug, not an operational error.
  return new AppError(
    config.isProduction ? 'Something went wrong' : err.message,
    err.statusCode || 500,
    'INTERNAL_ERROR'
  );
}

/**
 * Single, centralized error-formatting middleware. Every route just calls
 * next(err) (or uses catchAsync) — this is the only place that decides the
 * response shape.
 *
 * Must be registered LAST, after all routes, with 4 args so Express
 * recognizes it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err);

  if (!config.isProduction || normalized.statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ->`, err);
  }

  res.status(normalized.statusCode).json({
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
    },
  });
}

/** 404 handler for unmatched routes — converted into the same error shape. */
function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
}

module.exports = { errorHandler, notFoundHandler };

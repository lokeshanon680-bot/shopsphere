/**
 * Custom error class used everywhere in the app instead of throwing raw
 * Error objects. This lets the centralized error middleware format every
 * error the same way: { statusCode, code, message }.
 *
 * Usage: throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

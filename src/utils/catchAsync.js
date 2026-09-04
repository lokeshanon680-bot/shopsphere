/**
 * Wraps an async route/controller function so any rejected promise is
 * forwarded to next(err) automatically. Removes the need for a try/catch
 * block in every single controller (rule: no route handles its own
 * try/catch formatting ad hoc).
 *
 * Usage: router.get('/', catchAsync(async (req, res) => { ... }));
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;

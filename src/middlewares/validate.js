const AppError = require('../utils/AppError');

/**
 * Generic schema-based validation middleware (Zod).
 *
 * Usage:
 *   router.post('/', validate({ body: createProductSchema }), controller.create);
 *
 * Validates req.body / req.params / req.query against the given Zod
 * schemas. Invalid input never reaches the controller — it's rejected here
 * with a 422 and a field-level breakdown.
 */
function validate(schemas) {
  return (req, res, next) => {
    for (const key of ['body', 'params', 'query']) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        const details = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return next(
          new AppError(
            `Invalid ${key}: ${details.map((d) => `${d.field} - ${d.message}`).join(', ')}`,
            422,
            'INVALID_INPUT'
          )
        );
      }
      // Use the parsed (and coerced/defaulted) value going forward.
      req[key] = result.data;
    }
    next();
  };
}

module.exports = validate;

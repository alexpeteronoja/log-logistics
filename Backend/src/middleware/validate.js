const AppError = require('../utils/AppError');

/**
 * Generic Zod validation middleware factory.
 *
 * @param {import('zod').ZodSchema} schema  Zod schema to validate against.
 * @param {'body'|'params'|'query'} [source='body']  Which part of the request to validate.
 * @returns {Function} Express middleware.
 *
 * @example
 *   router.post('/shipments', validate(createShipmentSchema), controller.create);
 */
function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        Object.assign(
          new AppError('Validation failed.', 400),
          { details },
        ),
      );
    }

    // Replace the source with the parsed (and possibly transformed) data
    req[source] = result.data;
    next();
  };
}

module.exports = validate;

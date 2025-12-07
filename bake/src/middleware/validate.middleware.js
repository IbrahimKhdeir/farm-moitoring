const Joi = require('joi');

/**
 * Generic request validator middleware using Joi.
 * By default it validates `req.body`, but you can also
 * pass an object of { body, params, query } schemas.
 *
 * Examples:
 *   validate(registerSchema)                     // body only
 *   validate({ body: registerSchema })          // body only
 *   validate({ params: idSchema, body: data })  // params + body
 */
function validate(schema) {
  return (req, res, next) => {
    const schemas =
      schema && typeof schema.validate === 'function'
        ? { body: schema }
        : schema || {};

    const segments = ['body', 'params', 'query'];
    const errors = [];

    for (const segment of segments) {
      if (!schemas[segment]) continue;

      const { error, value } = schemas[segment].validate(req[segment], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(
          ...error.details.map((d) => ({
            message: d.message,
            path: d.path,
            segment,
          }))
        );
      } else {
        // assign sanitized value back
        req[segment] = value;
      }
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors,
      });
    }

    return next();
  };
}

module.exports = validate;



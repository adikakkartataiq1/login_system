const { z } = require('zod');
const {
  number_validator,
  bearer_token_validator
} = require('./components/appComponents.js');

const ERROR_DEFINITIONS = require('../error/errorDefinition.js');
const AppError = require('../error/AppError.js')
const logger = require('../logger/index.js');

const headerSchema = z.object({
  authorization: bearer_token_validator
});
// /addNumbers

const add_numbers_validator = (req, res, next) => {
  const bodySchema = z.object({
    a: number_validator,
    b: number_validator
  });

  try {
    bodySchema.parse(req.body);
    headerSchema.parse(req.headers);

    logger.info('Add numbers request validation passed', {
      allowed_fields: ['a', 'b'],
      headers: ['authorization']
    });

    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || 'Validation error';

    logger.warn('Add numbers request validation failed', {
      error: message,
      input: {
        body: req.body,
        headers: req.headers
      }
    });

    return next(new AppError(message, ERROR_DEFINITIONS.VALIDATION));
  }
};

module.exports = {
  add_numbers_validator,
};
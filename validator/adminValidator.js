const { z } = require("zod");
const {  email_validator, password_validator,
  cookie_validator,first_name_validator,last_name_validator, 
  username_validator,level_validator
} = require('./components/authComponents');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const AppError = require('../error/AppError.js')
const logger = require('../logger');
 
const change_level_validator = (req, res, next) => {

  const change_level_body = z.object({
    email: email_validator,
    level: level_validator,
  })

  try {
    change_level_body.parse(req.body);

    logger.info('Login body validation passed', {
      allowed_fields: ['email', 'level']
    });

    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || 'Validation error';
    logger.warn('change level body validation failed', {
      error: message,
      input: req.body
    });

    return next(new AppError(message, ERROR_DEFINITIONS.VALIDATION));
  }
};

module.exports = {
  change_level_validator
};
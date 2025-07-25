const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const logger = require('../logger');

const validateStrictRequest = (allowedParts = []) => {
  return (req, res, next) => {
    const errors = [];
    const requestParts = {
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
      cookies: req.cookies,
      files: req.files,
      session: req.session,
      rawBody: req.rawBody,
    };

    for (const [key, value] of Object.entries(requestParts)) {
      const isAllowed = allowedParts.includes(key);
      const isNonEmpty =
        value &&
        ((typeof value === 'object' && Object.keys(value).length > 0) ||
         (typeof value === 'string' && value.trim() !== ''));

      if (!isAllowed && isNonEmpty) {
        errors.push(`Unexpected data in ${key}`);
      }
    }

    if (errors.length > 0) {
      const errorMessage = errors[0];

      logger.warn('Strict request validation failed', {
        error: errorMessage, 
        allowed_parts: allowedParts 
      });

      return next(new AppError('Invalid request structure', ERROR_DEFINITIONS.VALIDATION));
    }

    logger.info('Request passed strict validation', {
      allowed_parts: allowedParts
    });

    next();
  };
};

module.exports = {
  validateStrictRequest
};

const { z } = require("zod");
const {  email_validator, password_validator,
  cookie_validator,first_name_validator,last_name_validator, 
  username_validator
} = require('./components/authComponents');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const AppError = require('../error/AppError.js')
const logger = require('../logger');
 
const login_validator = (req, res, next) => {

  const login_body = z.object({
    email: email_validator.optional(),
    username: username_validator.optional(),
    password: password_validator,
  }).refine(
    (data) => data.email || data.username,
    {
      message: 'Either email or username is required',
      path: ['email'], // attaches error to `email` field
    }
  );

  try {
    login_body.parse(req.body);

    logger.info('Login body validation passed', {
      allowed_fields: ['email', 'password']
    });

    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || 'Validation error';
    logger.warn('Login body validation failed', {
      error: message,
      input: req.body
    });

    return next(new AppError(message, ERROR_DEFINITIONS.VALIDATION));
  }
};

const refresh_token_validator = (req, res, next) => {
  const refresh_token_cookie = z.object({
    refreshToken: cookie_validator
  });

  try {
    refresh_token_cookie.parse(req.cookies);

    logger.info('Refresh token cookie validation passed', {
      allowed_fields: ['refreshToken']
    });

    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || 'Validation error';
    logger.warn('Refresh token cookie validation failed', {
      error: message,
      cookies: req.cookies
    });

    return next(new AppError(message, ERROR_DEFINITIONS.VALIDATION));
  }
};

const register_validator = (req, res, next) => {

  const register_body = z.object({
    first_name: first_name_validator,
    last_name: last_name_validator,
    email: email_validator,
    password: password_validator,
    username: username_validator
  });

  try {
    register_body.parse(req.body);

    logger.info('Register body validation passed', {
      allowed_fields: ['first_name', 'last_name', 'email', 'password', 'username']
    });

    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || 'Validation error';
    logger.warn('Register body validation failed', {
      error: message,
      input: req.body
    });

    return next(new AppError(message, ERROR_DEFINITIONS.VALIDATION));
  }
};

const change_password_validator = (req, res, next) => {
  const change_password_body = z.object({
    old_password: password_validator,
    new_password: password_validator,
  });

  try {
    change_password_body.parse(req.body);

    logger.info('Register body validation passed', {
      allowed_fields: ['old_password', 'new_password']
    });

    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || 'Validation error';
    logger.warn('Register body validation failed', {
      error: message,
      input: req.body
    });

    return next(new AppError(message, ERROR_DEFINITIONS.VALIDATION));
  }
};

module.exports = {
  login_validator,
  refresh_token_validator,
  register_validator,
  change_password_validator
};
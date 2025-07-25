const ERROR_DEFINITIONS = {
  VALIDATION: { type: 'ValidationError', code: 400 },
  AUTH: { type: 'AuthError', code: 401 },
  DATABASE: { type: 'DatabaseError', code: 500 },
  NOT_FOUND: { type: 'NotFoundError', code: 404 },
  INTERNAL: { type: 'InternalServerError', code: 500 },
  BAD_REQUEST: { type: 'BadRequest', code: 400 },
};

module.exports = ERROR_DEFINITIONS;

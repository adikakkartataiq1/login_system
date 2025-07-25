class AppError extends Error {
  constructor(message, codeOrDefinition = null, maybeType = null) {
    super(message);

    if (typeof codeOrDefinition === 'object' && codeOrDefinition !== null) {
      // Pattern: new AppError(message, ERROR_DEFINITIONS.X)
      this.code = codeOrDefinition.code || 500;
      this.type = codeOrDefinition.type || 'InternalServerError';
    } else {
      // Pattern: new AppError(message, code, type)
      this.code = codeOrDefinition || 500;
      this.type = maybeType || 'InternalServerError';
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

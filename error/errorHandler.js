const ERROR_DEFINITIONS = require('./errorDefinition');

const errorHandler = (err, req, res, next) => {
  const matched = Object.values(ERROR_DEFINITIONS).find(def => def.type === err.type);
  const statusCode = err.code || matched?.code || 500;
  const type = err.type || 'InternalServerError';

  res.status(statusCode).json({
    error: {
      message: err.message || 'Something went wrong',
      code: statusCode,
      type
    }
  });
};


module.exports =  errorHandler;

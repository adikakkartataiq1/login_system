const { getLoggerContext } = require('../utils/loggerContext');
const winston = require('winston');

const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const context = getLoggerContext() || {};
  return JSON.stringify({
    timestamp,
    level,
    message,
    request_id: context.request_id || null,
    data: {
      userId: context.userId || null,
      ...meta
    }
  });
});

module.exports = { logFormat };

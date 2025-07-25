const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const { logFormat } = require('./format');

const createTransport = (filename, level) =>
  new winston.transports.DailyRotateFile({
    level,
    filename: path.join('logs', `${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles: process.env.MAX_LOGFILE_DURATION,
    dirname: 'logs'
  });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    createTransport('info', 'info'),
    createTransport('error', 'error'),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ]
});

// Console transport for dev
if (process.env.NODE_ENV !== 'prod') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  }));
}

module.exports = logger;

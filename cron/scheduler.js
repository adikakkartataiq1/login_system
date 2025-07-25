const cron = require('node-cron');
const { resetAllTokenVersions } = require('../models/authModel');
const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const logger = require('../logger');

// Cronjob function wrapped with structured logging and error handling
const resetTokenVersions = async () => {
  try {
    await resetAllTokenVersions();

    logger.info('Cronjob executed: token_version reset for all users', {
      job: 'resetTokenVersions',
      time: new Date().toISOString()
    });
  } catch (err) {
    logger.error('Cronjob failed: token_version reset', {
      job: 'resetTokenVersions',
      time: new Date().toISOString(),
      error: err.message
    });

    // Optional: throw AppError if you have monitoring on thrown cron exceptions
    throw new AppError('Cronjob failed: token reset error', ERROR_DEFINITIONS.INTERNAL);
  }
};

// Schedule to run every day at 2 AM

cron.schedule(process.env.CRON_TIME, resetTokenVersions, {
  timezone: 'Asia/Kolkata'
});


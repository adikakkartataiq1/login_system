const { change_level_query } = require('../models/authModel');
const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition'); 
const logger = require('../logger');

const change_level = async (req, res, next) => {
  try {
    const { email, level } = req.body;
    await change_level_query(email, level)
    logger.info('Level changed successfully', {
      userId: req.user.id
    });
    res.json({ message: 'Level changed successfully' });
  } catch (err) {
    logger.error('Failed to change level', {
      userId: req.user.id,error: err.message
    });
    return next(new AppError('Internal error while changing level', ERROR_DEFINITIONS.INTERNAL));
  }
};

module.exports = {
  change_level
};
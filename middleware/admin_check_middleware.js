

const logger = require('../logger');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const { findUserById } = require('../models/authModel');


const admin_check_middleware = async (req, res, next) => {
  
  try {
    const user = await findUserById(req.user.id);

    if(Number(user.level)>1){
      logger.info('Admin authentication successful', { userId: user.id });
    }
    next()
  } catch (err) {
    logger.warn('You are not an admin.', {
      error: err.message,
    });

    return res.status(401).json({
      type: ERROR_DEFINITIONS.AUTH.type,
      message: 'You are not an admin.',
    });
  }
};

module.exports = {
  admin_check_middleware
};

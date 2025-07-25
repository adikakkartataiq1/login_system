const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const logger = require('../logger');

const addNumbers = async (req, res, next) => {
  try {
    const { a, b } = req.body;
    const sum = Number(a) + Number(b);
    logger.info('Numbers added successfully', {
      userId: req.user.id,a,b,result: sum
    });
    res.json({ sum });
  } catch (err) {
    logger.error('Failed to add numbers', {
      userId: req.user.id,a: req.body?.a,b: req.body?.b,error: err.message
    });
    return next(new AppError('Internal error while adding numbers', ERROR_DEFINITIONS.INTERNAL));
  }
};

module.exports = {
  addNumbers
};

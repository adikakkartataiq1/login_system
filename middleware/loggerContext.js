const { generateUUID } = require('../utils/uuid');
const { loggerContext } = require('../utils/loggerContext');

const loggerContextMiddleware = (req, res, next) => {
  const requestId = generateUUID();
  const userId = req.user?.id || null;

  loggerContext.run({ request_id: requestId, userId }, () => {
    next();
  });
};

module.exports = loggerContextMiddleware;

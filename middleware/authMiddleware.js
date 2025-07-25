
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const ERROR_DEFINITIONS = require('../error/errorDefinition');
const { getTokenVersionByUserId } = require('../models/authModel');


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Token missing in request headers');
    return res.status(401).json({
      type: ERROR_DEFINITIONS.AUTH.type,
      message: 'Authorization token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const dbTokenVersion = await getTokenVersionByUserId(decoded.id);

    if (dbTokenVersion === null) {
      logger.warn('User not found while verifying token', { userId: decoded.id });
      return res.status(401).json({
        type: ERROR_DEFINITIONS.AUTH.type,
        message: 'Invalid token',
      });
    }

    if (decoded.token_version !== dbTokenVersion) {
      logger.warn('Token version mismatch (user may have logged in elsewhere)', {
        userId: decoded.id,
        tokenVersion: decoded.token_version,
        dbTokenVersion,
      });

      return res.status(401).json({
        type: ERROR_DEFINITIONS.AUTH.type,
        message: 'Session expired due to login on another device',
      });
    }

    req.user = decoded;

    logger.info('JWT authentication successful', { userId: decoded.id });

    next();
  } catch (err) {
    logger.warn('Invalid or expired token', {
      token,
      error: err.message,
    });

    return res.status(401).json({
      type: ERROR_DEFINITIONS.AUTH.type,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = {
  authenticateToken
};

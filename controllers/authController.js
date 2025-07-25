const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail, saveRefreshToken, createUser, getUserByUsername, increaseJwtVersion,findUserById,change_password_query,getTokenVersionByUserId } = require('../models/authModel');
const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition'); 
const logger = require('../logger');

const register = async (req, res, next) => {
  const { first_name, last_name, email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      first_name,
      last_name,
      email,
      hashedPassword,
      username
    });
    logger.info("User registration successful", { email });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    logger.error('User registration failed', {
      email,error: err.message
    });
    return next(new AppError('Registration failed', ERROR_DEFINITIONS.DATABASE));
  }
};

const login = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    let user;

    if (email) {
      user = await getUserByEmail(email);
    } else if (username) {
      user = await getUserByUsername(username);
    }

    if (!user) {
      logger.warn('Login failed: User not found', { email, username });
      return next(new AppError('Invalid credentials', ERROR_DEFINITIONS.AUTH));
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Login failed: Invalid password', { userId: user.id });
      return next(new AppError('Invalid credentials', ERROR_DEFINITIONS.AUTH));
    }

    const accessToken = jwt.sign(
      { id: user.id,
        token_version: user.token_version +1
       },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id,
        token_version: user.token_version +1
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    await increaseJwtVersion(user.id)

    await saveRefreshToken(user.id, refreshToken);

    const refreshMaxAgeMs =
      parseInt(process.env.REFRESH_TOKEN_EXPIRY) * 1000 || 5 * 60 * 1000;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.TOKEN_SECURE,
      sameSite: 'strict',
      maxAge: refreshMaxAgeMs,
    });

    logger.info('Login successful', { userId: user.id });

    res.json({
      accessToken,
      first_name: user.first_name,
      last_name: user.last_name
    });

  } catch (err) {
    logger.error('Login failed due to server error', {
      error: err.message,
    });

    return next(new AppError('Login failed', ERROR_DEFINITIONS.INTERNAL));
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        logger.warn('Refresh failed: Invalid token', {
          error: err.message
        });
        return next(new AppError('Invalid refresh token', ERROR_DEFINITIONS.AUTH));
      }
      const { id, token_version } = decoded;
      try {
        user = await findUserById(id);
        token_version_db = await getTokenVersionByUserId(id)
        if (token_version_db!== token_version) {
          logger.warn('Refresh failed: Invalid token, already logged in', {
          error: "Logged somewhere else"
        });
        return next(new AppError('Invalid refresh token, already logged in', ERROR_DEFINITIONS.AUTH));
        }
        const newAccessToken = jwt.sign(
          { id: user.id,
            token_version: user.token_version+1
           },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
          { id: user.id,
            token_version: user.token_version +1
           },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        await increaseJwtVersion(user.id)

        await saveRefreshToken(user.id, newRefreshToken);

        logger.info('Refresh token successful', { userId: user.id });

        res.json({ accessToken: newAccessToken });

      } catch (innerErr) {
        logger.error('Refresh token generation failed', {
          userId: user.id,
          error: innerErr.message
        });

        return next(new AppError('Token refresh failed', ERROR_DEFINITIONS.INTERNAL));
      }
    });

  } catch (err) {
    logger.error('Refresh handler failed', {
      error: err.message
    });

    return next(new AppError('Token refresh failed', ERROR_DEFINITIONS.INTERNAL));
  }
};

const change_password = async (req, res, next) => {
  try {
    const {old_password, new_password} = req.body;
    user = await findUserById(req.user.id);

    const validPassword = await bcrypt.compare(old_password,user.password);
    if (!validPassword) {
      logger.warn('Old password is incorrect', { userId: user.id });
      return next(new AppError('Invalid credentials', ERROR_DEFINITIONS.AUTH));
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await change_password_query(user.id, hashedPassword);
    logger.info('Password changed successfully', { userId: user.id });

    res.json({ message: "Password changed successfully"});
  } catch (err) {
    logger.error('Password change failed', {
      error: err.message
    });

    return next(new AppError('Password change failed', ERROR_DEFINITIONS.INTERNAL));
  }
};

module.exports = {
  login,
  refreshToken,
  register,
  change_password
};


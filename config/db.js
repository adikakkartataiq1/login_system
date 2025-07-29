require('dotenv').config();
const { DataSource } = require('typeorm');
const User = require('../entities/User');
const logger = require('../logger');
const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition');

let dbOptions = {};

try {
  switch (process.env.DB_TYPE) {
    case 'mysql':
    case 'postgres':
      dbOptions = {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD.replace(/'/g, ''),
        database: process.env.DB_NAME,
        synchronize: false,
        logging: false,
        entities: [User],
      };
      break;

    case 'mongodb':
      dbOptions = {
        type: 'mongodb',
        url: process.env.DB_URL,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [User],
      };
      break;

    default:
      const msg = `Unsupported DB_TYPE: ${process.env.DB_TYPE}`;
      logger.error(msg);
      throw new AppError(msg, ERROR_DEFINITIONS.DATABASE);
  }
} catch (err) {
  logger.error('❌ Failed to configure database', {
    error: err.message,
    dbType: process.env.DB_TYPE,
  });
  throw err;
}

const AppDataSource = new DataSource(dbOptions);

AppDataSource.initialize()
  .then(() => {
    logger.info(`Database connected successfully using ${process.env.DB_TYPE}`);
  })
  .catch((err) => {
    logger.error('❌ TypeORM initialization error', {
      error: err.message,
      stack: err.stack,
    });
    throw new AppError('Database connection failed', ERROR_DEFINITIONS.DATABASE);
  });

module.exports = AppDataSource;

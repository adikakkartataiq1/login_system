const mysql = require('mysql2/promise');
require('dotenv').config();
const logger = require('../logger');
const AppError = require('../error/AppError');
const ERROR_DEFINITIONS = require('../error/errorDefinition');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    logger.error('❌ Failed to connect to database', {
      error: error.message
    });

    throw new AppError('Failed to connect to database', ERROR_DEFINITIONS.DATABASE);
  }
})();

module.exports = pool;

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    if (process.env.NODE_ENV !== 'dev') {
      console.log('Skipping database/table creation: NODE_ENV is not "dev"');
      return;
    }

    // Step 1: Connect without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD.replace(/'/g, ''),
      multipleStatements: true, // allows running more than one query
    });

    // Step 2: Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database "${process.env.DB_NAME}" ensured.`);

    // Step 3: Switch to the newly created (or existing) database
    await connection.changeUser({ database: process.env.DB_NAME });

    // Step 4: Create the users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        refresh_token VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        token_version INT DEFAULT 0,
        level INT DEFAULT 0
      )
    `;
    const insertFirstUserQuery = `
    INSERT INTO users 
      (first_name, last_name, email, password, username, token_version, level)
    VALUES 
      (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE email = email
    `;

    await connection.execute(createTableQuery);
    console.log('✅ User table created or already exists.');
    const hashedPassword = await bcrypt.hash(process.env.FIRST_USER_PASSWORD, 10);

    await connection.execute(insertFirstUserQuery, [
    process.env.FIRST_USER_FIRST_NAME,         // first_name
    process.env.FIRST_USER_LAST_NAME,          // last_name
    process.env.FIRST_USER_EMAIL,// email
    hashedPassword, // password
    process.env.FIRST_USER_USERNAME,         // username
    0,               // token_version
    3                // level (e.g. admin)
  ]);

  console.log('✅ Table created and first user inserted (if not exists)');

    await connection.end();
  } catch (err) {
    console.error('❌ Error during database/table creation:', err);
  }
})();

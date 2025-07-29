require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    if (process.env.NODE_ENV !== 'dev') {
      console.log('Skipping database/table creation: NODE_ENV is not "dev"');
      return;
    }

    const client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD.replace(/'/g, ''),
      port: parseInt(process.env.DB_PORT || '5432'),
      database: 'postgres', // connect to default DB first
    });

    await client.connect();

    // Step 1: Create the database if it doesn't exist
    const dbName = process.env.DB_NAME;
    const dbCheck = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (dbCheck.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`✅ Database "${dbName}" already exists.`);
    }

    await client.end();

    // Step 2: Connect to the new database
    const dbClient = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD.replace(/'/g, ''),
      port: parseInt(process.env.DB_PORT || '5432'),
      database: dbName,
    });

    await dbClient.connect();

    // Step 3: Create the users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        refresh_token VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        token_version INT DEFAULT 0,
        level INT DEFAULT 0
      );
    `;
    await dbClient.query(createTableQuery);
    console.log('✅ User table created or already exists.');

    // Step 4: Insert the admin user
    const hashedPassword = await bcrypt.hash(process.env.FIRST_USER_PASSWORD, 10);
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, username, token_version, level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING;
    `;
    await dbClient.query(insertQuery, [
      process.env.FIRST_USER_FIRST_NAME,
      process.env.FIRST_USER_LAST_NAME,
      process.env.FIRST_USER_EMAIL,
      hashedPassword,
      process.env.FIRST_USER_USERNAME,
      0,
      3,
    ]);

    console.log('✅ Admin user inserted or already exists.');
    await dbClient.end();
  } catch (err) {
    console.error('❌ Error during PostgreSQL setup:', err);
  }
})();

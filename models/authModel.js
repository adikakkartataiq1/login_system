const db = require('../config/db');

const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const getUserByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const saveRefreshToken = async (userId, refreshToken) => {
  await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
};

const change_password_query = async (userId, new_password) => {
  await db.execute('UPDATE users SET password = ? WHERE id = ?', [new_password, userId]);
};



const createUser = async ({ first_name, last_name, email, hashedPassword, username }) => {
  const [result] = await db.execute(
    'INSERT INTO users (first_name, last_name, email, password, username) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, hashedPassword, username]
  );
  return result;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const change_level_query = async (email, level) => {
  await db.execute(
    'UPDATE users SET level = ? WHERE email = ?',
    [level, email]
  );
};
const updateRefreshToken = async (userId, token) => {
  await db.execute(
    'UPDATE users SET refresh_token = ? WHERE id = ?',
    [token, userId]
  );
};

const increaseJwtVersion = async (userId) => {
  await db.execute(
    'UPDATE users SET token_version = token_version + 1 WHERE id = ?',
    [userId]
  );
};

const findUserByRefreshToken = async (token) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE refresh_token = ?',
    [token]
  );
  return rows[0];
};

const getTokenVersionByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT token_version FROM users WHERE id = ?',
    [userId]
  );
  return rows.length > 0 ? rows[0].token_version : null;
};

const resetAllTokenVersions = async () => {
  await db.query('UPDATE users SET token_version = 0');
};

module.exports = {
  createUser,
  findUserByEmail,
  updateRefreshToken,
  findUserByRefreshToken,
  getUserByEmail,
  saveRefreshToken,
  getUserByUsername,
  increaseJwtVersion,
  getTokenVersionByUserId,
  resetAllTokenVersions,
  findUserById,
  change_password_query,
  change_level_query
};

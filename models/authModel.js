const getUserRepo = require('../utils/getUserRepo');

const getUserByEmail = async (email) => {
  const repo = getUserRepo();
  return await repo.findOneBy({ email });
};

const getUserByUsername = async (username) => {
  const repo = getUserRepo();
  return await repo.findOneBy({ username });
};

const saveRefreshToken = async (userId, refreshToken) => {
  const repo = getUserRepo();
  await repo.update(userId, { refresh_token: refreshToken });
};

const change_password_query = async (userId, new_password) => {
  const repo = getUserRepo();
  await repo.update(userId, { password: new_password });
};

const createUser = async ({ first_name, last_name, email, hashedPassword, username }) => {
  const repo = getUserRepo();
  const user = process.env.DB_TYPE === 'mongodb'
    ? { first_name, last_name, email, password: hashedPassword, username }
    : repo.create({ first_name, last_name, email, password: hashedPassword, username });

  return process.env.DB_TYPE === 'mongodb'
    ? await repo.insertOne(user)
    : await repo.save(user);
};

const findUserById = async (id) => {
  const repo = getUserRepo();
  return await repo.findOneBy({ id });
};

const change_level_query = async (email, level) => {
  const repo = getUserRepo();
  await repo.update({ email }, { level });
};

const increaseJwtVersion = async (userId) => {
  const repo = getUserRepo();
  const user = await repo.findOneBy({ id: userId });
  if (user) {
    user.token_version = (user.token_version || 0) + 1;
    if (process.env.DB_TYPE === 'mongodb') {
      await repo.update({ _id: user._id }, { $set: { token_version: user.token_version } });
    } else {
      await repo.save(user);
    }
  }
};

const findUserByRefreshToken = async (token) => {
  const repo = getUserRepo();
  return await repo.findOneBy({ refresh_token: token });
};

const getTokenVersionByUserId = async (userId) => {
  const repo = getUserRepo();
  const user = await repo.findOneBy({ id: userId });
  return user?.token_version || null;
};

const resetAllTokenVersions = async () => {
  const repo = getUserRepo();
  if (process.env.DB_TYPE === 'mongodb') {
    await repo.updateMany({}, { $set: { token_version: 0 } });
  } else {
    await repo.createQueryBuilder()
      .update()
      .set({ token_version: 0 })
      .execute();
  }
};

module.exports = {
  createUser,
  findUserByRefreshToken,
  getUserByEmail,
  saveRefreshToken,
  getUserByUsername,
  increaseJwtVersion,
  getTokenVersionByUserId,
  resetAllTokenVersions,
  findUserById,
  change_password_query,
  change_level_query,
};

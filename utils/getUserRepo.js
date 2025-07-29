// utils/getUserRepo.js
const AppDataSource = require('../config/db');
const User = require('../entities/User');

function getUserRepo() {
  if (process.env.DB_TYPE === 'mongodb') {
    return AppDataSource.getMongoRepository(User);
  }
  return AppDataSource.getRepository(User);
}

module.exports = getUserRepo;

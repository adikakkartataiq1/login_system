const express = require('express');
const router = express.Router();
const {addNumbers} = require('../controllers/appController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateStrictRequest } = require('../validator/apiStrictValidator');
const {add_numbers_validator} = require('../validator/appValidator');

router.post(
  '/add',
  validateStrictRequest(["body", "headers","cookies"]),
  add_numbers_validator,
  authenticateToken,
  addNumbers
);

module.exports = router;

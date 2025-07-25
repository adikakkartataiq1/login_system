const express = require('express');
const router = express.Router();
const { change_level } = require('../controllers/adminController');
const { change_level_validator } = require('../validator/adminValidator');
const { validateStrictRequest } = require('../validator/apiStrictValidator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { admin_check_middleware} = require('../middleware/admin_check_middleware');
const { register } = require('../controllers/authController');
const { register_validator } = require('../validator/authValidator');

router.post('/admin-change-level', validateStrictRequest(["body","headers","cookies"]), authenticateToken, admin_check_middleware, change_level_validator, change_level);
router.post('/admin-register',validateStrictRequest(["body","headers","cookies"]), authenticateToken, admin_check_middleware, register_validator, register)

module.exports = router;

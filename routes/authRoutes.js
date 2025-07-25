const express = require('express');
const router = express.Router();
const { login, refreshToken,register,change_password } = require('../controllers/authController');
const { login_validator, refresh_token_validator, register_validator, change_password_validator } = require('../validator/authValidator');
const { validateStrictRequest } = require('../validator/apiStrictValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/login', validateStrictRequest(["body","headers","cookies"]), login_validator, login);
router.post('/change-password', validateStrictRequest(["body","headers","cookies"]), authenticateToken, change_password_validator, change_password);
router.post('/refresh',validateStrictRequest(["cookies","headers","cookies"]), refresh_token_validator,refreshToken);
router.post('/register',validateStrictRequest(["body","headers","cookies"]), register_validator, register)


module.exports = router;

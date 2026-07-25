const express = require('express');
const authController = require('../controllers/auth.controller');
const { authmiddleware } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

router.post('/register', registerLimiter, authController.userRegisterController);

router.post('/login', loginLimiter, authController.userLoginController);

router.post("/logout", authController.userLogoutController);

router.get('/me', authmiddleware, authController.getMeController);

module.exports = router;
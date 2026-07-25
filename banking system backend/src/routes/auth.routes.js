const express = require('express');
const authController = require('../controllers/auth.controller');
const { authmiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.userRegisterController);

router.post('/login', authController.userLoginController);

router.post("/logout", authController.userLogoutController);

router.get('/me', authmiddleware, authController.getMeController);

module.exports = router;
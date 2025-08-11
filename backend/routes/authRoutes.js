const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ✅ Correct usage: reference the function, do NOT call it
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

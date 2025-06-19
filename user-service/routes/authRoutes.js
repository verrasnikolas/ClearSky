const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authToken');
const { login, logout, refreshToken } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', authenticateToken, refreshToken);

module.exports = router;
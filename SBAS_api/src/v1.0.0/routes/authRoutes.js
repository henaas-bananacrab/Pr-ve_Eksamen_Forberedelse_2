const express = require('express');

const { register, login } = require('../controller/authController');

const router = express.Router();

// POST /auth/register
router.post('/auth/register', register);

// POST /auth/login
router.post('/auth/login', login);

module.exports = router;
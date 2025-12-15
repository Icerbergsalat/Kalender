const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Registrer ny bruger
router.post('/registrer', authController.registrer);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Tjek login status
router.get('/status', authController.tjekLogin);

module.exports = router;
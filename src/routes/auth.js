const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Demasiados intentos de inicio de sesion. Intente nuevamente en unos minutos.'
});

router.get('/login', authController.showLogin);
// router.post('/auth/login', loginRateLimiter, authController.login);
router.post('/auth/login', authController.login); // Rate limit desactivado temporalmente
router.post('/auth/logout', authController.logout);

module.exports = router;

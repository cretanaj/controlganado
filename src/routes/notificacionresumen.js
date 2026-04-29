const express = require('express');
const router = express.Router();

const notificacionResumenController = require('../controllers/notificacionResumenController');

router.get('/', notificacionResumenController.list);

module.exports = router;

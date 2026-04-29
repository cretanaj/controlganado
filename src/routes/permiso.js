const express = require('express');
const router = express.Router();

const permisoController = require('../controllers/permisoController');

router.get('/', permisoController.list);
router.post('/save', permisoController.save);

module.exports = router;

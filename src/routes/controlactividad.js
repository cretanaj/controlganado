const express = require('express');
const router = express.Router();

const controlActividadController = require('../controllers/controlActividadController');

router.get('/', controlActividadController.list);
router.post('/addControlActividad', controlActividadController.save);
router.get('/deleteControlActividad/:idActividad/:idPaquete', controlActividadController.delete);

module.exports = router;

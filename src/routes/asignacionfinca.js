const express = require('express');
const router = express.Router();

const asignacionFincaController = require('../controllers/asignacionFincaController');

router.get('/', asignacionFincaController.list);
router.post('/addAsignacionFinca', asignacionFincaController.save);
router.get('/deleteAsignacionFinca/:idPerfil/:idFinca', asignacionFincaController.delete);

module.exports = router;

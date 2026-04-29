const express = require('express');
const router = express.Router();

const tipoNotificacionController = require('../controllers/tipoNotificacionController');

router.get('/', tipoNotificacionController.list);
router.post('/addTipoNotificacion', tipoNotificacionController.save);
router.get('/deleteTipoNotificacion/:id', tipoNotificacionController.delete);
router.get('/updateTipoNotificacion/:id', tipoNotificacionController.edit);
router.post('/updateTipoNotificacion/:id', tipoNotificacionController.update);

module.exports = router;
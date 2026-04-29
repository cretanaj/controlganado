const express = require('express');
const router = express.Router();

const notificacionController = require('../controllers/notificacionController');

router.get('/', notificacionController.list);
router.post('/addNotificacion', notificacionController.save);
router.get('/deleteNotificacion/:id', notificacionController.delete);
router.get('/updateNotificacion/:id', notificacionController.edit);
router.post('/updateNotificacion/:id', notificacionController.update);

module.exports = router;
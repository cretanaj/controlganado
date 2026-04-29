const express = require('express');
const router = express.Router();

const controlPaqueteController = require('../controllers/controlPaqueteController');

router.get('/', controlPaqueteController.list);
router.post('/addControlPaquete', controlPaqueteController.save);
router.get('/deleteControlPaquete/:idPaquete/:idProducto', controlPaqueteController.delete);
router.get('/updateControlPaquete/:idPaquete/:idProducto', controlPaqueteController.edit);
router.post('/updateControlPaquete/:idPaquete/:idProducto', controlPaqueteController.update);

module.exports = router;

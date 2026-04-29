const express = require('express');
const router = express.Router();

const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.list);
router.post('/addInventario', inventarioController.save);
router.get('/updateInventario/:idProducto/:idFinca/:idUsuario/:fecha', inventarioController.edit);
router.post('/updateInventario/:idProducto/:idFinca/:idUsuario/:fecha', inventarioController.update);
router.get('/deleteInventario/:idProducto/:idFinca/:idUsuario/:fecha', inventarioController.delete);

module.exports = router;

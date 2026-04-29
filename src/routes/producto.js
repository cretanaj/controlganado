const express = require('express');
const router = express.Router();

const productoController = require('../controllers/productoController');

router.get('/', productoController.list);
router.post('/addProducto', productoController.save);
router.get('/deleteProducto/:id', productoController.delete);
router.get('/updateProducto/:id', productoController.edit);
router.post('/updateProducto/:id', productoController.update);

module.exports = router;

const express = require('express');
const router = express.Router();

const compraVentaGanadoController = require('../controllers/compraVentaGanadoController');

router.get('/', compraVentaGanadoController.list);
router.post('/addCompraVentaGanado', compraVentaGanadoController.save);
router.get('/deleteCompraVentaGanado/:id', compraVentaGanadoController.delete);
router.get('/updateCompraVentaGanado/:id', compraVentaGanadoController.edit);
router.post('/updateCompraVentaGanado/:id', compraVentaGanadoController.update);

module.exports = router;

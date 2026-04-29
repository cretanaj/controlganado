const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.list);
router.post('/addCliente', clienteController.save);
router.get('/deleteCliente/:id', clienteController.delete);
router.get('/updateCliente/:id', clienteController.edit);
router.post('/updateCliente/:id', clienteController.update);

module.exports = router;

const express = require('express');
const router = express.Router();

const proveedorController = require('../controllers/proveedorController');

router.get('/', proveedorController.list);
router.post('/addProveedor', proveedorController.save);
router.get('/deleteProveedor/:id', proveedorController.delete);
router.get('/updateProveedor/:id', proveedorController.edit);
router.post('/updateProveedor/:id', proveedorController.update);

module.exports = router;

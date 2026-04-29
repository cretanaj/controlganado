const express = require('express');
const router = express.Router();

const paqueteController = require('../controllers/paqueteController');

router.get('/', paqueteController.list);
router.post('/addPaquete', paqueteController.save);
router.get('/deletePaquete/:id', paqueteController.delete);
router.get('/updatePaquete/:id', paqueteController.edit);
router.post('/updatePaquete/:id', paqueteController.update);

module.exports = router;

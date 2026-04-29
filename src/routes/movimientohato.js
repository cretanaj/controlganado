const express = require('express');
const router = express.Router();

const movimientoHatoController = require('../controllers/movimientoHatoController')

router.get('/', movimientoHatoController.list);
router.post('/moverAnimal', movimientoHatoController.updateAnimalHato);


module.exports = router;
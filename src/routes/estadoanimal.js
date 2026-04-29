const express = require('express');
const router = express.Router();

const estadoAnimalController = require('../controllers/estadoAnimalController');

router.get('/', estadoAnimalController.list);
router.post('/addEstadoAnimal', estadoAnimalController.save);
router.get('/deleteEstadoAnimal/:id', estadoAnimalController.delete);
router.get('/updateEstadoAnimal/:id', estadoAnimalController.edit);
router.post('/updateEstadoAnimal/:id', estadoAnimalController.update);

module.exports = router;

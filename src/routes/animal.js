const express = require('express');
const router = express.Router();

const animalController = require('../controllers/animalController')

router.get('/', animalController.list);
router.post('/addAnimal', animalController.save);
router.get('/deleteAnimal/:id', animalController.delete);
router.get('/updateAnimal/:id', animalController.edit);
router.post('/updateAnimal/:id', animalController.update);
router.post('/importAnimal', animalController.importcsv);

module.exports = router;



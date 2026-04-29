const express = require('express');
const router = express.Router();

const vacunacionController = require('../controllers/vacunacionController');

router.get('/', vacunacionController.list);
router.post('/addVacunacion', vacunacionController.save);
router.get('/deleteVacunacion/:id', vacunacionController.delete);
router.get('/updateVacunacion/:id', vacunacionController.edit);
router.post('/updateVacunacion/:id', vacunacionController.update);

module.exports = router;

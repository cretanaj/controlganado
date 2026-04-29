const express = require('express');
const router = express.Router();

const palpacionController = require('../controllers/palpacionController');

router.get('/', palpacionController.list);
router.post('/addPalpacion', palpacionController.save);
router.get('/deletePalpacion/:id', palpacionController.delete);
router.get('/updatePalpacion/:id', palpacionController.edit);
router.post('/updatePalpacion/:id', palpacionController.update);

module.exports = router;

const express = require('express');
const router = express.Router();

const pesajeController = require('../controllers/pesajeController');

router.get('/', pesajeController.list);
router.post('/addPesaje', pesajeController.save);
router.get('/deletePesaje/:id', pesajeController.delete);

module.exports = router;

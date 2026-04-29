const express = require('express');
const router = express.Router();

const colaboradorController = require('../controllers/colaboradorController');

router.get('/', colaboradorController.list);
router.post('/addColaborador', colaboradorController.save);
router.get('/deleteColaborador/:id', colaboradorController.delete);
router.get('/updateColaborador/:id', colaboradorController.edit);
router.post('/updateColaborador/:id', colaboradorController.update);

module.exports = router;

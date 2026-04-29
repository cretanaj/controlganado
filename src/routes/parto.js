const express = require('express');
const router = express.Router();

const partoController = require('../controllers/partoController');

router.get('/', partoController.list);
router.post('/addParto', partoController.save);
router.get('/deleteParto/:id', partoController.delete);
router.get('/updateParto/:id', partoController.edit);
router.post('/updateParto/:id', partoController.update);

module.exports = router;
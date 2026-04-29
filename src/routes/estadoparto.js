const express = require('express');
const router = express.Router();

const estadoPartoController = require('../controllers/estadoPartoController');

router.get('/', estadoPartoController.list);
router.post('/addEstadoParto', estadoPartoController.save);
router.get('/deleteEstadoParto/:id', estadoPartoController.delete);
router.get('/updateEstadoParto/:id', estadoPartoController.edit);
router.post('/updateEstadoParto/:id', estadoPartoController.update);

module.exports = router;
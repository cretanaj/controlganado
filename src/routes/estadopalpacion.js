const express = require('express');
const router = express.Router();

const estadoPalpacionController = require('../controllers/estadoPalpacionController');

router.get('/', estadoPalpacionController.list);
router.post('/addEstadoPalpacion', estadoPalpacionController.save);
router.get('/deleteEstadoPalpacion/:id', estadoPalpacionController.delete);
router.get('/updateEstadoPalpacion/:id', estadoPalpacionController.edit);
router.post('/updateEstadoPalpacion/:id', estadoPalpacionController.update);

module.exports = router;
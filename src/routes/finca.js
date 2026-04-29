const express = require('express');
const router = express.Router();

const fincaController = require('../controllers/fincaController')

router.get('/', fincaController.list);
router.post('/addFinca', fincaController.save);
router.get('/deleteFinca/:id', fincaController.delete);
router.get('/updateFinca/:id', fincaController.edit);
router.post('/updateFinca/:id', fincaController.update);

module.exports = router;
const express = require('express');
const router = express.Router();

const enfermedadController = require('../controllers/enfermedadController');

router.get('/', enfermedadController.list);
router.post('/addEnfermedad', enfermedadController.save);
router.get('/deleteEnfermedad/:id', enfermedadController.delete);
router.get('/updateEnfermedad/:id', enfermedadController.edit);
router.post('/updateEnfermedad/:id', enfermedadController.update);

module.exports = router;

const express = require('express');
const router = express.Router();

const actividadController = require('../controllers/actividadController');

router.get('/', actividadController.list);
router.post('/addActividad', actividadController.save);
router.get('/deleteActividad/:id', actividadController.delete);
router.get('/updateActividad/:id', actividadController.edit);
router.post('/updateActividad/:id', actividadController.update);

module.exports = router;

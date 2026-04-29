const express = require('express');
const router = express.Router();

const estadoTareaController = require('../controllers/estadoTareaController');

router.get('/', estadoTareaController.list);
router.post('/addEstadoTarea', estadoTareaController.save);
router.get('/deleteEstadoTarea/:id', estadoTareaController.delete);
router.get('/updateEstadoTarea/:id', estadoTareaController.edit);
router.post('/updateEstadoTarea/:id', estadoTareaController.update);

module.exports = router;

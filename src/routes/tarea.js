const express = require('express');
const router = express.Router();

const tareaController = require('../controllers/tareaController');

router.get('/', tareaController.list);
router.post('/addTarea', tareaController.save);
router.get('/deleteTarea/:id', tareaController.delete);
router.get('/updateTarea/:id', tareaController.edit);
router.post('/updateTarea/:id', tareaController.update);

module.exports = router;

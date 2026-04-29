const express = require('express');
const router = express.Router();

const razaController = require('../controllers/razaController')

router.get('/', razaController.list);
router.post('/addRaza', razaController.save);
router.get('/deleteRaza/:id', razaController.delete);
router.get('/updateRaza/:id', razaController.edit);
router.post('/updateRaza/:id', razaController.update);

module.exports = router;
const express = require('express');
const router = express.Router();

const colorController = require('../controllers/colorController')

router.get('/', colorController.list);
router.post('/addColor', colorController.save);
router.get('/deleteColor/:id', colorController.delete);
router.get('/updateColor/:id', colorController.edit);
router.post('/updateColor/:id', colorController.update);

module.exports = router;
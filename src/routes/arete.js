const express = require('express');
const router = express.Router();

const areteController = require('../controllers/areteController');

router.get('/', areteController.list);
router.post('/addArete', areteController.save);
router.get('/deleteArete/:id', areteController.delete);
router.get('/updateArete/:id', areteController.edit);
router.post('/updateArete/:id', areteController.update);

module.exports = router;
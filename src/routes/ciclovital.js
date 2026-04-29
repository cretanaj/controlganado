const express = require('express');
const router = express.Router();

const ciclovitalController = require('../controllers/ciclovitalController')

router.get('/', ciclovitalController.list);
router.post('/addCiclovital', ciclovitalController.save);
router.get('/deleteCiclovital/:id', ciclovitalController.delete);
router.get('/updateCiclovital/:id', ciclovitalController.edit);
router.post('/updateCiclovital/:id', ciclovitalController.update);

module.exports = router;